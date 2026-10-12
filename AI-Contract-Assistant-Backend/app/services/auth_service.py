from uuid import UUID

from sqlalchemy.orm import Session

from app.core.security import (
    create_access_token,
    hash_password,
    verify_password,
)
from app.models import user
from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.schemas.auth import (
    LoginRequest,
    RegisterRequest,
)


class AuthService:

    def __init__(self, db: Session):
        self.user_repository = UserRepository(db)

    def register_user(self, data: RegisterRequest) -> str:

        existing_user = self.user_repository.get_by_email(data.email)

        if existing_user:
            raise ValueError("Email already registered")

        hashed_password = hash_password(data.password)

        user = User(
            full_name=data.full_name,
            email=data.email,
            password_hash=hashed_password,
        )
        user = self.user_repository.create(user)

        token = create_access_token(
            {"sub": str(user.id)}
        )   

        return token

    def login_user(self, data: LoginRequest) -> str:

        user = self.user_repository.get_by_email(data.email)

        if not user:
            raise ValueError("Invalid email or password")

        if not verify_password(
            data.password,
            user.password_hash,
        ):
            raise ValueError("Invalid email or password")

        token = create_access_token(
            {
                "sub": str(user.id)
            }
        )

        return token

    def get_user(self, user_id: UUID):

        user = self.user_repository.get_by_id(user_id)

        if not user:
            raise ValueError("User not found")

        return user