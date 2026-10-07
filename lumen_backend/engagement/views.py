from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from accounts.permissions import IsStaffRole
from .models import Wishlist, Notification, ActivityLog
from .serializers import WishlistSerializer, NotificationSerializer, ActivityLogSerializer


class WishlistViewSet(viewsets.ModelViewSet):
    """/api/wishlist/ — the current user's saved products."""
    serializer_class = WishlistSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Wishlist.objects.filter(user=self.request.user).select_related("product")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class NotificationViewSet(viewsets.ReadOnlyModelViewSet):
    """/api/notifications/ — staff notification center."""
    serializer_class = NotificationSerializer
    permission_classes = [IsStaffRole]

    def get_queryset(self):
        return Notification.objects.filter(recipient__in=[self.request.user, None])

    @action(detail=True, methods=["patch"])
    def read(self, request, pk=None):
        n = self.get_object()
        n.read = True
        n.save(update_fields=["read"])
        return Response(NotificationSerializer(n).data)

    @action(detail=False, methods=["post"], url_path="mark-all-read")
    def mark_all_read(self, request):
        self.get_queryset().update(read=True)
        return Response({"detail": "All notifications marked read."})


class ActivityLogViewSet(viewsets.ReadOnlyModelViewSet):
    """/api/activity-log/ — audit trail, staff only."""
    queryset = ActivityLog.objects.select_related("actor")
    serializer_class = ActivityLogSerializer
    permission_classes = [IsStaffRole]
    filterset_fields = ["category"]
