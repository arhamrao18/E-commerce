from decimal import Decimal
from django.db import transaction
from django.utils import timezone
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.permissions import IsStaffRole, ReadOnlyOrStaff
from .models import Coupon, Cart, CartItem, Order, OrderItem, OrderStatusEvent
from .serializers import (
    CouponSerializer, CartSerializer, AddCartItemSerializer,
    OrderSerializer, CheckoutSerializer, OrderStatusUpdateSerializer,
)
from .services import charge_payment, PaymentError

SHIPPING_FLAT_RATE = Decimal("8.00")
FREE_SHIPPING_THRESHOLD = Decimal("75.00")
TAX_RATE = Decimal("0.08")


def get_or_create_cart(request):
    if request.user.is_authenticated:
        cart, _ = Cart.objects.get_or_create(user=request.user)
        return cart
    if not request.session.session_key:
        request.session.create()
    cart, _ = Cart.objects.get_or_create(session_key=request.session.session_key, user__isnull=True)
    return cart


class CartView(APIView):
    """
    GET    /api/cart/                — current cart (session-based for guests, user-based when logged in)
    POST   /api/cart/items/          — add item {product_id, variant_id?, quantity}
    PATCH  /api/cart/items/{id}/     — update quantity {quantity}
    DELETE /api/cart/items/{id}/     — remove item
    POST   /api/cart/apply-coupon/   — {code}
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        cart = get_or_create_cart(request)
        return Response(CartSerializer(cart).data)


class CartItemView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        cart = get_or_create_cart(request)
        serializer = AddCartItemSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        product = serializer.validated_data["product"]
        variant = serializer.validated_data.get("variant")
        qty = serializer.validated_data["quantity"]

        item, created = CartItem.objects.get_or_create(
            cart=cart, product=product, variant=variant, defaults={"quantity": qty}
        )
        if not created:
            item.quantity += qty
            item.save()
        return Response(CartSerializer(cart).data, status=status.HTTP_201_CREATED)

    def patch(self, request, item_id):
        cart = get_or_create_cart(request)
        item = cart.items.filter(id=item_id).first()
        if not item:
            return Response({"detail": "Item not found."}, status=404)
        qty = request.data.get("quantity")
        if qty is not None:
            if int(qty) <= 0:
                item.delete()
            else:
                item.quantity = int(qty)
                item.save()
        return Response(CartSerializer(cart).data)

    def delete(self, request, item_id):
        cart = get_or_create_cart(request)
        cart.items.filter(id=item_id).delete()
        return Response(CartSerializer(cart).data)


class ApplyCouponView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        cart = get_or_create_cart(request)
        code = request.data.get("code", "").upper().strip()
        try:
            coupon = Coupon.objects.get(code=code, is_active=True)
        except Coupon.DoesNotExist:
            return Response({"detail": "Invalid or expired coupon."}, status=400)

        now = timezone.now()
        if coupon.expires_at and coupon.expires_at < now:
            return Response({"detail": "This coupon has expired."}, status=400)
        if coupon.usage_limit and coupon.times_used >= coupon.usage_limit:
            return Response({"detail": "This coupon has reached its usage limit."}, status=400)
        if cart.subtotal < coupon.min_order_amount:
            return Response({"detail": f"Minimum order of ${coupon.min_order_amount} required."}, status=400)

        cart.coupon = coupon
        cart.save()
        return Response(CartSerializer(cart).data)


class OrderViewSet(viewsets.ReadOnlyModelViewSet):
    """
    GET /api/orders/            — staff: all orders, customer: only their own
    GET /api/orders/{id}/       — order detail
    POST /api/orders/checkout/  — turn the current cart into an order (Stripe-ready)
    PATCH /api/orders/{id}/status/ — staff only, updates status + writes a timeline event
    """
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = Order.objects.prefetch_related("items", "timeline")
        if self.request.user.is_staff_role:
            return qs
        return qs.filter(user=self.request.user)

    @action(detail=False, methods=["post"], permission_classes=[permissions.AllowAny])
    def checkout(self, request):
        serializer = CheckoutSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        cart = get_or_create_cart(request)
        if not cart.items.exists():
            return Response({"detail": "Cart is empty."}, status=400)

        subtotal = cart.subtotal
        discount_total = Decimal("0.00")
        if cart.coupon:
            c = cart.coupon
            if c.coupon_type == Coupon.Type.PERCENTAGE:
                discount_total = subtotal * (c.value / Decimal("100"))
            elif c.coupon_type == Coupon.Type.FIXED:
                discount_total = min(c.value, subtotal)

        shipping_total = Decimal("0.00") if (subtotal - discount_total) >= FREE_SHIPPING_THRESHOLD else SHIPPING_FLAT_RATE
        if cart.coupon and cart.coupon.coupon_type == Coupon.Type.FREE_SHIPPING:
            shipping_total = Decimal("0.00")
        tax_total = (subtotal - discount_total) * TAX_RATE
        grand_total = subtotal - discount_total + shipping_total + tax_total

        try:
            payment_intent_id = charge_payment(grand_total, "usd", data["payment_method_id"], description="Lumen order")
        except PaymentError as e:
            return Response({"detail": str(e)}, status=402)

        with transaction.atomic():
            order = Order.objects.create(
                user=request.user if request.user.is_authenticated else None,
                guest_email=data.get("guest_email", ""),
                shipping_full_name=data["shipping_full_name"],
                shipping_line1=data["shipping_line1"],
                shipping_line2=data.get("shipping_line2", ""),
                shipping_city=data["shipping_city"],
                shipping_state=data["shipping_state"],
                shipping_postal_code=data["shipping_postal_code"],
                shipping_country=data["shipping_country"],
                shipping_phone=data.get("shipping_phone", ""),
                subtotal=subtotal,
                discount_total=discount_total,
                shipping_total=shipping_total,
                tax_total=tax_total,
                grand_total=grand_total,
                coupon=cart.coupon,
                payment_status="paid",
                stripe_payment_intent_id=payment_intent_id,
                status=Order.Status.PAID,
            )
            for item in cart.items.all():
                OrderItem.objects.create(
                    order=order, product=item.product, variant=item.variant,
                    product_name=item.product.name, unit_price=item.unit_price, quantity=item.quantity,
                )
                if item.product.track_inventory:
                    item.product.stock = max(0, item.product.stock - item.quantity)
                    item.product.save(update_fields=["stock"])
            OrderStatusEvent.objects.create(order=order, status=Order.Status.PAID, note="Payment confirmed at checkout.")
            if cart.coupon:
                cart.coupon.times_used += 1
                cart.coupon.save(update_fields=["times_used"])
            cart.items.all().delete()
            cart.coupon = None
            cart.save()

        return Response(OrderSerializer(order).data, status=201)

    @action(detail=True, methods=["patch"], permission_classes=[IsStaffRole], url_path="status")
    def update_status(self, request, pk=None):
        order = self.get_object()
        serializer = OrderStatusUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        order.status = serializer.validated_data["status"]
        order.save(update_fields=["status", "updated_at"])
        OrderStatusEvent.objects.create(
            order=order, status=order.status,
            note=serializer.validated_data.get("note", ""), changed_by=request.user,
        )
        return Response(OrderSerializer(order).data)


class CouponViewSet(viewsets.ModelViewSet):
    """/api/coupons/ — staff only manage; used by admin Coupons page."""
    queryset = Coupon.objects.all().order_by("-id")
    serializer_class = CouponSerializer
    permission_classes = [IsStaffRole]
