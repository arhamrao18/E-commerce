from rest_framework import serializers
from catalog.serializers import ProductListSerializer
from .models import Wishlist, Notification, ActivityLog


class WishlistSerializer(serializers.ModelSerializer):
    product_detail = ProductListSerializer(source="product", read_only=True)

    class Meta:
        model = Wishlist
        fields = ["id", "product", "product_detail", "added_at"]


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ["id", "type", "title", "body", "read", "created_at"]


class ActivityLogSerializer(serializers.ModelSerializer):
    actor_email = serializers.CharField(source="actor.email", read_only=True, default=None)

    class Meta:
        model = ActivityLog
        fields = ["id", "actor", "actor_email", "action", "category", "created_at"]
