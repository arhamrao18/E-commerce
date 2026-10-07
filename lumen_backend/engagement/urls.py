from rest_framework.routers import DefaultRouter
from .views import WishlistViewSet, NotificationViewSet, ActivityLogViewSet

router = DefaultRouter()
router.register("wishlist", WishlistViewSet, basename="wishlist")
router.register("notifications", NotificationViewSet, basename="notification")
router.register("activity-log", ActivityLogViewSet, basename="activity-log")
urlpatterns = router.urls

from django.urls import path
from .intelligence_views import (
    DashboardStatsView, SalesIntelligenceView, InventoryPredictionView,
    FraudDetectionView, AIAssistantChatView,
)

urlpatterns += [
    path("analytics/dashboard/", DashboardStatsView.as_view(), name="dashboard-stats"),
    path("intelligence/sales/", SalesIntelligenceView.as_view(), name="intelligence-sales"),
    path("intelligence/inventory-prediction/", InventoryPredictionView.as_view(), name="intelligence-inventory"),
    path("intelligence/fraud-detection/", FraudDetectionView.as_view(), name="intelligence-fraud"),
    path("intelligence/ai-assistant/chat/", AIAssistantChatView.as_view(), name="intelligence-ai-chat"),
]
