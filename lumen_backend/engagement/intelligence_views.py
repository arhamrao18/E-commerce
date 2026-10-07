"""
AI-ready endpoints for the admin Intelligence section (Sales, Inventory, Fraud, Assistant).

These return realistically-shaped placeholder data today. Each is written so the body
of the function is the only thing that needs to change to call a real model or an n8n
webhook later — the URL, serializer shape, and frontend contract stay the same.
"""
from decouple import config
import requests
from django.db.models import Sum, Count, Avg
from django.utils import timezone
from datetime import timedelta
from rest_framework.views import APIView
from rest_framework.response import Response
from accounts.permissions import IsStaffRole
from orders.models import Order
from catalog.models import Product


class DashboardStatsView(APIView):
    """GET /api/analytics/dashboard/ — the numbers behind the admin Dashboard cards/charts."""
    permission_classes = [IsStaffRole]

    def get(self, request):
        since_30d = timezone.now() - timedelta(days=30)
        orders_30d = Order.objects.filter(created_at__gte=since_30d)

        revenue_by_status = orders_30d.values("status").annotate(count=Count("id"))
        low_stock = Product.objects.filter(stock__gt=0, stock__lte=models_low_stock_threshold())

        return Response({
            "revenue_30d": orders_30d.aggregate(total=Sum("grand_total"))["total"] or 0,
            "orders_30d": orders_30d.count(),
            "new_customers_30d": Order.objects.filter(created_at__gte=since_30d).values("user").distinct().count(),
            "low_stock_count": low_stock.count(),
            "orders_by_status": list(revenue_by_status),
            "top_products": list(
                Product.objects.annotate(units_sold=Count("orderitem")).order_by("-units_sold")[:5]
                .values("id", "name", "units_sold", "price")
            ),
        })


def models_low_stock_threshold():
    return 15  # simple constant; could read per-product low_stock_threshold instead


class SalesIntelligenceView(APIView):
    """GET /api/intelligence/sales/ — placeholder AI sales analytics."""
    permission_classes = [IsStaffRole]

    def get(self, request):
        return Response({
            "note": "Placeholder data. Replace this view body with an n8n webhook call or ML model output.",
            "revenue_forecast_next_2_months": [29800, 31200],
            "customer_ltv_avg": 286,
            "repeat_purchase_rate": 0.34,
            "cart_abandonment_rate": 0.48,
            "gross_margin": 0.58,
            "conversion_funnel": [
                {"stage": "Visits", "value": 42000},
                {"stage": "Product views", "value": 18400},
                {"stage": "Added to cart", "value": 6200},
                {"stage": "Checkout started", "value": 3100},
                {"stage": "Purchased", "value": 2140},
            ],
        })


class InventoryPredictionView(APIView):
    """GET /api/intelligence/inventory-prediction/ — placeholder AI restock forecasting."""
    permission_classes = [IsStaffRole]

    def get(self, request):
        products = Product.objects.all()[:20]
        data = [
            {
                "product_id": p.id,
                "name": p.name,
                "health_score": 55 + (p.id * 7) % 40,
                "velocity": ["Fast moving", "Steady", "Slow moving", "Dead stock"][p.id % 4],
                "days_to_stock_out": 6 + (p.id * 5) % 40,
                "recommended_restock": 20 + (p.id * 9) % 60,
            }
            for p in products
        ]
        return Response({
            "note": "Placeholder data — connect to a demand-forecasting model or n8n workflow.",
            "products": data,
        })


class FraudDetectionView(APIView):
    """GET /api/intelligence/fraud-detection/ — placeholder AI risk scoring for recent orders."""
    permission_classes = [IsStaffRole]

    def get(self, request):
        recent_orders = Order.objects.order_by("-created_at")[:20]
        data = [
            {
                "order_id": o.id,
                "order_number": o.order_number,
                "risk_score": (o.id * 13) % 100,
                "amount": str(o.grand_total),
                "status": "Manual review" if (o.id * 13) % 100 >= 60 else "Cleared",
            }
            for o in recent_orders
        ]
        return Response({
            "note": "Placeholder risk scores — wire this up to real fraud-detection logic or an n8n workflow.",
            "orders": data,
        })


class AIAssistantChatView(APIView):
    """
    POST /api/intelligence/ai-assistant/chat/  { "message": "..." }

    Forwards to an n8n webhook if AI_ASSISTANT_WEBHOOK_URL is configured;
    otherwise returns a canned response so the admin chat UI works end-to-end today.
    """
    permission_classes = [IsStaffRole]

    def post(self, request):
        message = request.data.get("message", "")
        webhook_url = config("AI_ASSISTANT_WEBHOOK_URL", default="")

        if webhook_url:
            try:
                resp = requests.post(webhook_url, json={"message": message, "user": request.user.email}, timeout=15)
                resp.raise_for_status()
                return Response(resp.json())
            except requests.RequestException as e:
                return Response({"reply": f"AI workflow unavailable: {e}"}, status=502)

        return Response({
            "reply": "This is a placeholder reply — set AI_ASSISTANT_WEBHOOK_URL in your environment "
                     "to route this to a real n8n workflow.",
        })
