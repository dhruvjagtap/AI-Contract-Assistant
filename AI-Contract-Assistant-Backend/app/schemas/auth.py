from pydantic import BaseModel, EmailStr, Field, ConfigDict


class RegisterRequest(BaseModel):
    """
    Request body for user registration.
    """

    full_name: str = Field(
        ...,
        min_length=2,
        max_length=100,
        description="Full name of the user",
    )

    email: EmailStr

    password: str = Field(
        ...,
        min_length=8,
        max_length=128,
        description="User password",
    )


class LoginRequest(BaseModel):
    """
    Request body for user login.
    """

    email: EmailStr

    password: str = Field(
        ...,
        min_length=8,
        max_length=128,
    )


class TokenResponse(BaseModel):
    """
    Response returned after successful authentication.
    """

    access_token: str
    token_type: str = "bearer"


class UserResponse(BaseModel):
    """
    Public user information.
    """

    id: str
    full_name: str | None
    email: EmailStr

    model_config = ConfigDict(from_attributes=True)