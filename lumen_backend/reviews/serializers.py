from rest_framework import serializers
from .models import Review, ReviewImage


class ReviewImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReviewImage
        fields = ["id", "image"]


class ReviewSerializer(serializers.ModelSerializer):
    images = ReviewImageSerializer(many=True, read_only=True)
    customer_name = serializers.SerializerMethodField()
    product_name = serializers.CharField(source="product.name", read_only=True)

    class Meta:
        model = Review
        fields = [
            "id", "product", "product_name", "user", "customer_name", "rating", "title",
            "body", "status", "flagged", "flagged_reason", "images", "created_at",
        ]
        read_only_fields = ["user", "status", "flagged", "flagged_reason"]

    def get_customer_name(self, obj):
        return obj.user.first_name or obj.user.username


class ReviewModerateSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=Review.Status.choices)
