FROM python:latest

WORKDIR /app

RUN apt-get update
RUN apt-get install -y poppler-utils
 
COPY requirements.txt requirements.txt

COPY /app /app/app

RUN pip install -r requirements.txt


CMD ["/bin/sh", "-c", "python -m app.main" ]