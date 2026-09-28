from rest_framework import serializers
from .models import Category, Brand, Product, ProductImage, ProductVariant


class CategorySerializer(serializers.ModelSerializer):
    children = serializers.SerializerMethodField()
    product_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = [
            "id", "name", "slug", "parent", "tagline", "image",
            "is_featured", "display_order", "children", "product_count",
        ]

    def get_children(self, obj):
        return CategorySerializer(obj.children.all(), many=True, context=self.context).data

    def get_product_count(self, obj):
        return obj.products.filter(status="published").count()


class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = ["id", "name", "slug", "logo", "description"]


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ["id", "image", "alt_text", "is_thumbnail", "display_order"]


class ProductVariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVariant
        fields = ["id", "color", "size", "material", "sku", "price_override", "stock"]


class ProductListSerializer(serializers.ModelSerializer):
    """Lightweight — used for listing/grid pages."""
    brand = serializers.SlugRelatedField(read_only=True, slug_field="name")
    category = serializers.SlugRelatedField(read_only=True, slug_field="slug")
    thumbnail = serializers.SerializerMethodField()
    rating = serializers.SerializerMethodField()
    review_count = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            "id", "name", "slug", "brand", "category", "price", "discount_price",
            "thumbnail", "stock", "tags", "rating", "review_count", "is_featured",
        ]

    def get_thumbnail(self, obj):
        img = obj.images.filter(is_thumbnail=True).first() or obj.images.first()
        request = self.context.get("request")
        if img and request:
            return request.build_absolute_uri(img.image.url)
        return None

    def get_rating(self, obj):
        return round(getattr(obj, "avg_rating", None) or 0, 1)

    def get_review_count(self, obj):
        return obj.reviews.filter(status__in=["approved", "featured"]).count()


class ProductDetailSerializer(serializers.ModelSerializer):
    """Full detail — used for the product detail page."""
    brand = BrandSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    variants = ProductVariantSerializer(many=True, read_only=True)
    in_stock = serializers.BooleanField(read_only=True)
    is_low_stock = serializers.BooleanField(read_only=True)

    class Meta:
        model = Product
        fields = [
            "id", "name", "slug", "brand", "category", "short_description", "description",
            "sku", "barcode", "price", "discount_price", "stock", "in_stock", "is_low_stock",
            "weight_kg", "dimensions", "tags", "video_url", "images", "variants",
            "status", "is_featured", "seo_title", "seo_description", "created_at",
        ]


class ProductWriteSerializer(serializers.ModelSerializer):
    """Used by the admin panel to create/update products."""

    class Meta:
        model = Product
        fields = [
            "id", "name", "brand", "category", "short_description", "description",
            "sku", "barcode", "price", "discount_price", "cost_price", "stock",
            "low_stock_threshold", "track_inventory", "weight_kg", "dimensions",
            "tags", "video_url", "status", "is_featured", "seo_title", "seo_description",
        ]
