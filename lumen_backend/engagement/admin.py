from django.contrib import admin
from .models import Wishlist, Notification, ActivityLog

admin.site.register(Wishlist)
admin.site.register(Notification)
admin.site.register(ActivityLog)
