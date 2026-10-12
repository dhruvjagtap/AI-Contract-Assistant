from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.user import User


class UserRepository:
    """
    Repository class for User database operations.
    """

    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, user_id: UUID) -> User | None:
        """
        Retrieve a user by ID.
        """
        statement = select(User).where(User.id == user_id)
        result = self.db.execute(statement)
        return result.scalar_one_or_none()

    def get_by_email(self, email: str) -> User | None:
        """
        Retrieve a user by email.
        """
        statement = select(User).where(User.email == email)
        result = self.db.execute(statement)
        return result.scalar_one_or_none()

    def create(self, user: User) -> User:
        """
        Create a new user.
        """
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user

    def update(self, user: User) -> User:
        """
        Update an existing user.
        """
        self.db.commit()
        self.db.refresh(user)
        return user

    def delete(self, user: User) -> None:
        """
        Delete a user.
        """
        self.db.delete(user)
        self.db.commit()

    from uuid import UUID


def get_user_by_id(db: Session, user_id: UUID):
    return (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )