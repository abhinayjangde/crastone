FROM python:3.12-slim

WORKDIR /app

# Install system dependencies (poppler for PDF processing)
RUN apt-get update && \
    apt-get install -y --no-install-recommends poppler-utils curl && \
    rm -rf /var/lib/apt/lists/*

# Install uv for fast dependency management
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

# Copy dependency files first for better caching
COPY pyproject.toml .

# Install dependencies
RUN uv sync --no-dev

# Copy application code
COPY src/ src/

# Create directories for uploads and extracted images
RUN mkdir -p uploads extract/images

# Expose port
EXPOSE 8000

# Default: run the web server (overridden for worker service)
CMD ["uv", "run", "fastapi", "run", "src/app.py", "--host", "0.0.0.0", "--port", "8000"]
