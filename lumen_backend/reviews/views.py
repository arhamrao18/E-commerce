from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from accounts.permissions import IsStaffRole
from .models import Review
from .serializers import ReviewSerializer, ReviewModerateSerializer


class ReviewViewSet(viewsets.ModelViewSet):
    """
    /api/reviews/?product=<slug>   — public sees approved+featured only
    Staff (via /admin panel) sees everything and can PATCH /api/reviews/{id}/moderate/
    """
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        qs = Review.objects.select_related("user", "product").prefetch_related("images")
        product_slug = self.request.query_params.get("product")
        if product_slug:
            qs = qs.filter(product__slug=product_slug)
        if not (self.request.user.is_authenticated and self.request.user.is_staff_role):
            qs = qs.filter(status__in=["approved", "featured"])
        return qs

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=["patch"], permission_classes=[IsStaffRole])
    def moderate(self, request, pk=None):
        review = self.get_object()
        serializer = ReviewModerateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        review.status = serializer.validated_data["status"]
        review.save(update_fields=["status"])
        return Response(ReviewSerializer(review).data)
