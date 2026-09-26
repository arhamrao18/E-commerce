from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """Custom user: login by email, carries the admin RBAC role."""

    class Role(models.TextChoices):
        CUSTOMER = "customer", "Customer"
        SUPER_ADMIN = "super_admin", "Super Admin"
        ADMIN = "admin", "Admin"
        MANAGER = "manager", "Manager"
        INVENTORY_MANAGER = "inventory_manager", "Inventory Manager"
        CUSTOMER_SUPPORT = "customer_support", "Customer Support"
        SALES_MANAGER = "sales_manager", "Sales Manager"
        MARKETING_MANAGER = "marketing_manager", "Marketing Manager"

    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True)
    role = models.CharField(max_length=32, choices=Role.choices, default=Role.CUSTOMER)
    is_blocked = models.BooleanField(default=False)
    email_verified = models.BooleanField(default=False)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    def __str__(self):
        return self.email

    @property
    def is_staff_role(self):
        return self.role != self.Role.CUSTOMER


class Address(models.Model):
    class Kind(models.TextChoices):
        SHIPPING = "shipping", "Shipping"
        BILLING = "billing", "Billing"

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="addresses")
    label = models.CharField(max_length=50, default="Home")
    kind = models.CharField(max_length=10, choices=Kind.choices, default=Kind.SHIPPING)
    full_name = models.CharField(max_length=150)
    line1 = models.CharField(max_length=200)
    line2 = models.CharField(max_length=200, blank=True)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=20)
    country = models.CharField(max_length=100, default="United States")
    phone = models.CharField(max_length=20, blank=True)
    is_default = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.label} — {self.full_name}"
