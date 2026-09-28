from django.db.models import Avg, Q
from rest_framework import viewsets, permissions
from accounts.permissions import ReadOnlyOrStaff
from .models import Category, Brand, Product
from .filters import ProductFilter
from .serializers import (
    CategorySerializer, BrandSerializer,
    ProductListSerializer, ProductDetailSerializer, ProductWriteSerializer,
)


class CategoryViewSet(viewsets.ModelViewSet):
    """/api/categories/ — public read, staff write. Nested (parent__isnull) at top level."""
    serializer_class = CategorySerializer
    permission_classes = [ReadOnlyOrStaff]
    lookup_field = "slug"

    def get_queryset(self):
        qs = Category.objects.all()
        if self.action == "list":
            qs = qs.filter(parent__isnull=True)
        return qs


class BrandViewSet(viewsets.ModelViewSet):
    """/api/brands/"""
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer
    permission_classes = [ReadOnlyOrStaff]
    lookup_field = "slug"


class ProductViewSet(viewsets.ModelViewSet):
    """
    /api/products/ — public catalog + admin management.
    Supports ?search=, ?category=, ?brand=, ?min_price=, ?max_price=,
    ?tag=, ?ordering=price,-price,-created_at,-rating
    """
    permission_classes = [ReadOnlyOrStaff]
    lookup_field = "slug"
    filterset_class = ProductFilter
    search_fields = ["name", "brand__name", "sku", "description"]
    ordering_fields = ["price", "created_at", "avg_rating", "stock"]

    def get_queryset(self):
        qs = Product.objects.select_related("brand", "category").prefetch_related("images", "variants")
        qs = qs.annotate(avg_rating=Avg("reviews__rating", filter=Q(reviews__status__in=["approved", "featured"])))
        if self.action == "list" and not (self.request.user.is_authenticated and self.request.user.is_staff_role):
            qs = qs.filter(status="published")
        return qs

    def get_serializer_class(self):
        if self.action == "list":
            return ProductListSerializer
        if self.action in ("create", "update", "partial_update"):
            return ProductWriteSerializer
        return ProductDetailSerializer
