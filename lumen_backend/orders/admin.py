from django.contrib import admin
from .models import Coupon, Cart, CartItem, Order, OrderItem, OrderStatusEvent


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0


class OrderStatusEventInline(admin.TabularInline):
    model = OrderStatusEvent
    extra = 0


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ["order_number", "user", "status", "payment_status", "grand_total", "created_at"]
    list_filter = ["status", "payment_status"]
    search_fields = ["order_number", "user__email", "guest_email"]
    inlines = [OrderItemInline, OrderStatusEventInline]


@admin.register(Coupon)
class CouponAdmin(admin.ModelAdmin):
    list_display = ["code", "coupon_type", "value", "is_active", "times_used", "usage_limit", "expires_at"]
    list_filter = ["coupon_type", "is_active"]


admin.site.register(Cart)
admin.site.register(CartItem)
