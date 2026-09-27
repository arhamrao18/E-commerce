from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Address


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    model = User
    list_display = ["email", "username", "role", "is_blocked", "is_staff", "date_joined"]
    list_filter = ["role", "is_blocked", "is_active"]
    fieldsets = UserAdmin.fieldsets + (
        ("Lumen profile", {"fields": ("phone", "role", "is_blocked", "email_verified")}),
    )


@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    list_display = ["user", "label", "kind", "city", "is_default"]
    list_filter = ["kind", "is_default"]
