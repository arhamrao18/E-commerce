from rest_framework import serializers
from catalog.models import Product, ProductVariant
from catalog.serializers import ProductListSerializer
from .models import Coupon, Cart, CartItem, Order, OrderItem, OrderStatusEvent


class CouponSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coupon
        fields = "__all__"


class CartItemSerializer(serializers.ModelSerializer):
    product_detail = ProductListSerializer(source="product", read_only=True)
    line_total = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    unit_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = CartItem
        fields = ["id", "product", "product_detail", "variant", "quantity", "saved_for_later", "unit_price", "line_total"]


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    coupon_code = serializers.CharField(source="coupon.code", read_only=True, default=None)

    class Meta:
        model = Cart
        fields = ["id", "items", "subtotal", "coupon", "coupon_code", "updated_at"]


class AddCartItemSerializer(serializers.Serializer):
    product_id = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all(), source="product")
    variant_id = serializers.PrimaryKeyRelatedField(queryset=ProductVariant.objects.all(), source="variant", required=False, allow_null=True)
    quantity = serializers.IntegerField(min_value=1, default=1)


class OrderItemSerializer(serializers.ModelSerializer):
    line_total = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = OrderItem
        fields = ["id", "product", "product_name", "variant", "unit_price", "quantity", "line_total"]


class OrderStatusEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderStatusEvent
        fields = ["id", "status", "note", "changed_by", "created_at"]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    timeline = OrderStatusEventSerializer(many=True, read_only=True)
    customer_email = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = [
            "id", "order_number", "user", "guest_email", "customer_email", "status",
            "shipping_full_name", "shipping_line1", "shipping_line2", "shipping_city",
            "shipping_state", "shipping_postal_code", "shipping_country", "shipping_phone",
            "subtotal", "discount_total", "shipping_total", "tax_total", "grand_total",
            "coupon", "payment_status", "payment_provider", "items", "timeline",
            "created_at", "updated_at",
        ]
        read_only_fields = ["order_number", "subtotal", "discount_total", "shipping_total", "tax_total", "grand_total"]

    def get_customer_email(self, obj):
        return obj.user.email if obj.user else obj.guest_email


class CheckoutSerializer(serializers.Serializer):
    """Body for POST /api/orders/checkout/ — turns the current cart into an Order."""
    shipping_full_name = serializers.CharField()
    shipping_line1 = serializers.CharField()
    shipping_line2 = serializers.CharField(required=False, allow_blank=True)
    shipping_city = serializers.CharField()
    shipping_state = serializers.CharField()
    shipping_postal_code = serializers.CharField()
    shipping_country = serializers.CharField()
    shipping_phone = serializers.CharField(required=False, allow_blank=True)
    guest_email = serializers.EmailField(required=False, allow_blank=True)
    payment_method_id = serializers.CharField(help_text="Stripe PaymentMethod ID from the frontend")


class OrderStatusUpdateSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=Order.Status.choices)
    note = serializers.CharField(required=False, allow_blank=True)
