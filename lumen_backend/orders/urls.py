from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CartView, CartItemView, ApplyCouponView, OrderViewSet, CouponViewSet

router = DefaultRouter()
router.register("orders", OrderViewSet, basename="order")
router.register("coupons", CouponViewSet, basename="coupon")

urlpatterns = [
    path("cart/", CartView.as_view(), name="cart"),
    path("cart/items/", CartItemView.as_view(), name="cart-items"),
    path("cart/items/<int:item_id>/", CartItemView.as_view(), name="cart-item-detail"),
    path("cart/apply-coupon/", ApplyCouponView.as_view(), name="cart-apply-coupon"),
    path("", include(router.urls)),
]
