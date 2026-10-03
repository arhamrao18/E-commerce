from django.contrib import admin
from .models import Review, ReviewImage

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ["product", "user", "rating", "status", "flagged", "created_at"]
    list_filter = ["status", "flagged"]

admin.site.register(ReviewImage)
