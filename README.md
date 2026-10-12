# AI Contract Assistant

### Intelligent Document-Based Question Answering and Contract Review

AI Contract Assistant is a document-centric AI application that enables users to upload PDF documents, ask questions in natural language, and retrieve answers grounded in the contents of their documents.

The backend uses Retrieval-Augmented Generation (RAG) to retrieve relevant document passages before generating answers with a locally hosted Llama 3 model through Ollama. Source metadata, including page numbers and chunk references, helps users trace responses to the original document.

> **Project status:** Academic mini project — B.E. Computer Engineering, International Institute of Information Technology, Pune, Academic Year 2026–2027.

## Features

- **Document upload:** Upload PDF documents through the document management interface.
- **PDF text extraction:** Extract text from uploaded documents.
- **Text chunking:** Divide extracted text into smaller sections for retrieval.
- **Semantic embeddings:** Convert document chunks and user questions into vector representations.
- **Vector database:** Store document chunks and embeddings in PostgreSQL with pgvector.
- **Semantic search:** Retrieve document passages relevant to a user's question.
- **Retrieval-Augmented Generation:** Supply retrieved passages as context to the language model.
- **Local AI inference:** Generate responses using Llama 3 through Ollama.
- **Source references:** Associate responses with source passages, page numbers, and chunk identifiers.
- **Document-based chat:** Interact with documents using natural-language questions.
- **Web interface:** Access document management, dashboard, chat, profile, and settings interfaces.

Some frontend workflows currently use mock data or simulated operations. Refer to the implementation and testing results when evaluating end-to-end functionality.

## Technology Stack

| Component                         | Technology                            |
| --------------------------------- | ------------------------------------- |
| Frontend                          | React, TypeScript, Vite               |
| UI and styling                    | Tailwind CSS, Radix UI                |
| Backend                           | Python, FastAPI                       |
| Data validation and configuration | Pydantic, pydantic-settings           |
| Database                          | PostgreSQL                            |
| Vector search                     | pgvector                              |
| Database migrations               | Alembic                               |
| Embedding generation              | Sentence Transformers embedding model |
| Language model                    | Llama 3                               |
| Local model runtime               | Ollama                                |
| API testing                       | Postman                               |

## System Architecture

The application follows a document-processing and question-answering pipeline.

### Document ingestion

```text
PDF Upload
    |
    v
PDF Text Extraction
    |
    v
Text Chunking
    |
    v
Embedding Generation
    |
    v
PostgreSQL + pgvector
```

### Question answering

```text
User Question
    |
    v
Query Embedding
    |
    v
Semantic Similarity Search
    |
    v
Relevant Document Chunks
    |
    v
RAG Context Construction
    |
    v
Llama 3 via Ollama
    |
    v
Generated Answer + Source References
```

The retrieval stage supplies relevant document content to the language model. This is intended to improve answer relevance and traceability; it does not guarantee that every generated answer is correct.

## Repository Structure

```text
AI-Contract-Assistant/
├── AI-Contract-Assistant-Frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.ts
│
├── AI-Contract-Assistant-Backend/
│   ├── app/
│   ├── alembic/
│   ├── docker/
│   ├── scripts/
│   ├── tests/
│   ├── uploads/
│   ├── alembic.ini
│   ├── requirements.txt
│   └── .env.example
│
├── .gitignore
└── README.md
```

The backend's `uploads/` directory is used for runtime document uploads and is excluded from version control to avoid publishing private documents. The Python virtual environment and frontend dependencies are also excluded.

## Prerequisites

Install and configure the following before running the application:

- Git
- Python compatible with the project's dependencies
- Node.js and npm
- PostgreSQL
- The pgvector PostgreSQL extension
- Ollama
- The Llama 3 model required by the backend
- The embedding model configured in the backend

Local LLM inference and embedding generation can require substantial RAM, storage, and processing resources. A compatible GPU may improve performance but is not mandatory for every model configuration.

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/AI-Contract-Assistant.git
cd AI-Contract-Assistant
```

Replace `YOUR_USERNAME` with the GitHub account that hosts the repository.

### 2. Set up the Python backend

```bash
cd AI-Contract-Assistant-Backend

python3 -m venv venv
source venv/bin/activate

python -m pip install --upgrade pip
pip install -r requirements.txt
```

On Windows, activate the virtual environment with:

```powershell
venv\Scripts\activate
```

If installation fails, check the Python version and the compatibility of the packages listed in `requirements.txt`.

### 3. Configure PostgreSQL

Install PostgreSQL and ensure the server is running. Create a database and a database user for the application.

For example, after connecting to PostgreSQL as an administrator:

```sql
CREATE USER contract_user WITH PASSWORD 'replace_with_a_local_password';
CREATE DATABASE contract_assistant OWNER contract_user;
```

Install pgvector for your PostgreSQL installation, then enable it in the application database:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

The pgvector extension must be installed on the PostgreSQL server before this SQL command can succeed.

### 4. Configure environment variables

Create a backend `.env` file based on `.env.example`.

```bash
cp .env.example .env
```

Update the local configuration with your actual database credentials and a securely generated JWT secret.

Example configuration:

```dotenv
DATABASE_URL=postgresql+psycopg://contract_user:replace_with_a_local_password@localhost:5432/contract_assistant

JWT_SECRET_KEY=replace_with_a_secure_random_secret
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Optional; configure only if required by the application
OPENAI_API_KEY=
```

Use the database URL format supported by the application's database driver. The example above assumes SQLAlchemy with a compatible PostgreSQL driver.

The backend configuration uses Pydantic Settings:

- `DATABASE_URL`: PostgreSQL connection string.
- `JWT_SECRET_KEY`: Secret used for JWT signing.
- `JWT_ALGORITHM`: JWT signing algorithm; defaults to `HS256`.
- `ACCESS_TOKEN_EXPIRE_MINUTES`: Access-token lifetime; defaults to 30 minutes.
- `OPENAI_API_KEY`: Optional configuration field.

**Security:** Never commit `.env` files, real API keys, database passwords, JWT secrets, or private documents to GitHub. Keep `.env.example` limited to variable names and safe placeholder values.

### 5. Apply database migrations with Alembic

From the backend directory, with the virtual environment activated and environment variables configured, run:

```bash
alembic upgrade head
```

This applies the database migrations defined in the project's Alembic configuration.

To inspect the current migration state:

```bash
alembic current
alembic history
```

If the database schema changes, create a migration using the project's established migration workflow and review the generated migration before applying it.

### 6. Start Ollama and download Llama 3

Install Ollama from the official website:

https://ollama.com/

Download the model:

```bash
ollama pull llama3
```

Start the Ollama service if it is not already running. On systems where the service is managed separately, use the appropriate service command or run:

```bash
ollama serve
```

In another terminal, verify that the model is available:

```bash
ollama list
```

Test the model:

```bash
ollama run llama3
```

Enter a test prompt and verify that the model responds.

The backend must use a model name that matches the locally available Ollama model. Model size and resource requirements depend on the selected variant.

### 7. Start the backend API

From the backend directory, activate the virtual environment and run the FastAPI application.

If the application instance is defined as `app` in `app/main.py`, use:

```bash
uvicorn app.main:app --reload
```

If the FastAPI entry point is defined in another module, adjust the import path accordingly.

When the application starts successfully, use the configured API URL to access the service. FastAPI's interactive API documentation is commonly available at `/docs` when enabled.

### 8. Start the React frontend

Open another terminal:

```bash
cd AI-Contract-Assistant/AI-Contract-Assistant-Frontend

npm install
npm run dev
```

Vite prints the local development URL in the terminal. Open that URL in a web browser.

If the frontend requires a backend API URL, configure the environment variable expected by the existing frontend service layer. For Vite applications, client-side variables typically use the `VITE_` prefix. Check the existing source code and environment examples for the exact variable name.

## Testing

Testing should cover individual components as well as the complete document-question-answering workflow.

Suggested test areas include:

- Authentication and form validation.
- PDF upload and text extraction.
- Chunk creation and page-number preservation.
- Embedding generation and vector dimensions.
- PostgreSQL persistence and pgvector similarity search.
- RAG context construction.
- Llama 3 response generation.
- Source-reference accuracy.
- Invalid files, empty questions, and unavailable services.
- Frontend navigation and responsive layouts.

Run the project's available backend tests from the backend directory:

```bash
pytest
```

This command assumes pytest is installed and the tests are configured for the current environment. Tests requiring PostgreSQL, pgvector, or Ollama may need those services running.

For frontend checks, use the scripts defined in `package.json`, for example:

```bash
npm run
```

This lists the available npm scripts.

## Known Limitations

- The application primarily targets text-based PDF documents.
- Scanned documents may require OCR support.
- AI response quality depends on extraction quality, retrieval relevance, and the selected language model.
- Local model inference may be slow on systems with limited resources.
- Some frontend workflows currently use mock data or simulated processing.
- Production-grade authentication, access control, deployment, and service integration require additional validation.
- AI-generated contract analysis should be verified against the original document and must not replace professional legal advice.

## Future Enhancements

- Complete frontend-backend integration.
- Stronger authentication and document-level authorization.
- Support for DOCX and additional document formats.
- OCR for scanned PDFs.
- Improved source highlighting and citation verification.
- Multi-document question answering.
- Evaluation metrics for retrieval relevance and answer grounding.
- Performance optimization for larger document collections.
- Production deployment and monitoring.

## Disclaimer

AI Contract Assistant is an academic software project intended to support document understanding and information retrieval. Generated answers may contain errors or omit relevant context. Users should verify important information against the original documents. The application does not replace qualified legal advice.
