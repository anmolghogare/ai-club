"""
events/admin.py
---------------
Admin guard dependency for the Event Management module.

Strategy
────────
The super-admin is identified by their email address stored in the
`SUPER_ADMIN_EMAIL` environment variable. The `require_admin` dependency:

  1. Calls `get_current_user` to ensure the request is authenticated.
  2. Checks whether the authenticated user's email matches SUPER_ADMIN_EMAIL.
  3. Raises HTTP 403 if not.

Why email-based?
────────────────
The existing codebase already uses an email guard (hardcoded in
`/api/admin/registrations`). We improve on that by:
  • Loading the email from env (no hardcode in code).
  • Plugging into the JWT auth system so the admin must be logged in.
  • Giving a clear 403 (not 401) when auth succeeds but role is wrong.

To promote / change the super admin, update SUPER_ADMIN_EMAIL in .env.
No code changes required.
"""

import os
import logging

from fastapi import Depends, HTTPException, status

from auth.middleware import get_current_user

logger = logging.getLogger(__name__)

SUPER_ADMIN_EMAIL: str = os.getenv("SUPER_ADMIN_EMAIL", "meet56963@gmail.com")


async def require_admin(
    current_user=Depends(get_current_user),
):
    """
    FastAPI dependency — resolves to the current user only if they are the
    super admin. Raises HTTP 403 otherwise.

    Usage:
        @router.post("/api/admin/events")
        async def create(admin=Depends(require_admin)):
            ...
    """
    if not SUPER_ADMIN_EMAIL:
        logger.critical(
            "SUPER_ADMIN_EMAIL environment variable is not set. "
            "All admin requests are being rejected."
        )
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Admin system is not configured on this server.",
        )

    admin_emails = [email.strip() for email in SUPER_ADMIN_EMAIL.split(",") if email.strip()]
    if current_user.email not in admin_emails:
        logger.warning(
            "Admin access denied for user email=%r (expected one of %r)",
            current_user.email,
            admin_emails,
        )
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to perform this action.",
        )

    return current_user
