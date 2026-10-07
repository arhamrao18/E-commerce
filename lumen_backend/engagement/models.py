from django.conf import settings
from django.db import models
from catalog.models import Product


class Wishlist(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="wishlist_items")
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="wishlisted_by")
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = [("user", "product")]


class Notification(models.Model):
    class Type(models.TextChoices):
        ORDER = "order", "Order"
        INVENTORY = "inventory", "Inventory"
        REVIEW = "review", "Review"
        PAYMENT = "payment", "Payment"
        AI = "ai", "AI insight"
        CUSTOMER = "customer", "Customer"

    recipient = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="notifications",
        null=True, blank=True, help_text="Null = broadcast to all staff",
    )
    type = models.CharField(max_length=20, choices=Type.choices)
    title = models.CharField(max_length=200)
    body = models.CharField(max_length=300)
    read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]


class ActivityLog(models.Model):
    """Audit trail — one row per meaningful admin action."""
    actor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name="activity_entries")
    action = models.CharField(max_length=300)
    category = models.CharField(
        max_length=20,
        choices=[("order", "Order"), ("coupon", "Coupon"), ("product", "Product"),
                  ("review", "Review"), ("security", "Security"), ("inventory", "Inventory")],
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
