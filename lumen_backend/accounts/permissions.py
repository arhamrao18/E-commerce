from rest_framework import permissions


class IsStaffRole(permissions.BasePermission):
    """Allows access only to admin-side roles (anything but 'customer')."""

    def has_permission(self, request, view):
        user = request.user
        return bool(user and user.is_authenticated and user.is_staff_role)


class IsSuperAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        user = request.user
        return bool(user and user.is_authenticated and user.role == "super_admin")


class ReadOnlyOrStaff(permissions.BasePermission):
    """Public can read (list/retrieve); only staff roles can write."""

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        user = request.user
        return bool(user and user.is_authenticated and user.is_staff_role)
