# AI-Contract-Assistant-Backend/app/api/documents.py
from fastapi import (
    APIRouter,
    Depends,
    File,
    UploadFile,
    status,
    BackgroundTasks,
)

from fastapi.responses import FileResponse


from app.dependencies.auth import get_current_user
from app.dependencies.document import get_document_service
from app.dependencies.processing import get_processing_service


from app.models.user import User


from app.schemas.document import DocumentResponse


from app.services.document_service import DocumentService
from app.services.processing_service import ProcessingService



router = APIRouter(
    prefix="/documents",
    tags=["Documents"],
)



@router.post(
    "/upload",
    response_model=DocumentResponse,
    status_code=status.HTTP_201_CREATED,
)
async def upload_document(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    service: DocumentService = Depends(get_document_service),
    processing_service: ProcessingService = Depends(
        get_processing_service
    ),
):
    """
    Upload PDF and start background processing.
    """

    document = await service.upload_document(
        user_id=current_user.id,
        file=file,
    )

    background_tasks.add_task(
        processing_service.process_document,
        document.id,
    )

    return document


@router.get(
    "/{document_id}/file",
)
def download_document_file(
    document_id: int,
    current_user: User = Depends(get_current_user),
    service: DocumentService = Depends(get_document_service),
):
    """
    Stream PDF file.
    """


    file_path = service.get_document_file(
        document_id=document_id,
        user_id=current_user.id,
    )


    return FileResponse(
        path=file_path,
        media_type="application/pdf",
        filename=file_path.name,
    )





@router.get(
    "",
    response_model=list[DocumentResponse],
)
def get_documents(
    current_user: User = Depends(get_current_user),
    service: DocumentService = Depends(get_document_service),
):
    """
    Get all documents belonging to current user.
    """


    return service.get_user_documents(
        user_id=current_user.id
    )





@router.get(
    "/{document_id}",
    response_model=DocumentResponse,
)
def get_document(
    document_id: int,
    current_user: User = Depends(get_current_user),
    service: DocumentService = Depends(get_document_service),
):
    """
    Get a single document.
    """


    return service.get_document(
        document_id=document_id,
        user_id=current_user.id,
    )





@router.delete(
    "/{document_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_document(
    document_id: int,
    current_user: User = Depends(get_current_user),
    service: DocumentService = Depends(get_document_service),
):
    """
    Delete a document.
    """


    service.delete_document(
        document_id=document_id,
        user_id=current_user.id,
    )