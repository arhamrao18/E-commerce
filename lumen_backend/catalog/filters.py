import django_filters
from .models import Product


class ProductFilter(django_filters.FilterSet):
    category = django_filters.CharFilter(field_name="category__slug")
    brand = django_filters.CharFilter(field_name="brand__slug")
    min_price = django_filters.NumberFilter(method="filter_min_price")
    max_price = django_filters.NumberFilter(method="filter_max_price")
    tag = django_filters.CharFilter(method="filter_tag")
    in_stock = django_filters.BooleanFilter(method="filter_in_stock")

    class Meta:
        model = Product
        fields = ["category", "brand", "status", "is_featured"]

    def filter_min_price(self, qs, name, value):
        return qs.filter(price__gte=value)

    def filter_max_price(self, qs, name, value):
        return qs.filter(price__lte=value)

    def filter_tag(self, qs, name, value):
        return qs.filter(tags__contains=[value])

    def filter_in_stock(self, qs, name, value):
        return qs.filter(stock__gt=0) if value else qs.filter(stock=0)
