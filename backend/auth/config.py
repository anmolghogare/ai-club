"""
auth/config.py
--------------
Centralised authentication configuration.
All auth-related settings are loaded from environment variables here
so that the rest of the app never calls os.getenv() directly.
"""

import os
from dotenv import load_dotenv

load_dotenv()


class AuthConfig:
    # ── Google OAuth ──────────────────────────────────────────────────────────
    GOOGLE_CLIENT_ID: str = os.getenv("GOOGLE_CLIENT_ID", "")

    # ── JWT ───────────────────────────────────────────────────────────────────
    # Generate a strong random secret: python -c "import secrets; print(secrets.token_hex(64))"
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "CHANGE_ME_IN_PRODUCTION")
    JWT_ALGORITHM: str = "HS256"
    # Access token expires in 7 days (in minutes)
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = int(
        os.getenv("JWT_ACCESS_TOKEN_EXPIRE_MINUTES", str(60 * 24 * 7))
    )

    # ── Cookie ────────────────────────────────────────────────────────────────
    COOKIE_NAME: str = "access_token"
    COOKIE_HTTPONLY: bool = True
    COOKIE_SECURE: bool = True
    COOKIE_SAMESITE: str = "none"
    COOKIE_MAX_AGE: int = JWT_ACCESS_TOKEN_EXPIRE_MINUTES * 60  # seconds

    # ── Misc ──────────────────────────────────────────────────────────────────
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")

    @classmethod
    def validate(cls) -> None:
        """Raise ValueError early if critical settings are missing or insecure."""
        if not cls.GOOGLE_CLIENT_ID:
            raise ValueError("GOOGLE_CLIENT_ID environment variable is not set.")
        if cls.JWT_SECRET_KEY == "CHANGE_ME_IN_PRODUCTION":
            raise ValueError(
                "JWT_SECRET_KEY must be changed from the default value in all environments.\n"
                "Generate a strong secret with: python -c \"import secrets; print(secrets.token_hex(64))\"\n"
                "Then set it as JWT_SECRET_KEY in your .env file."
            )



settings = AuthConfig()
