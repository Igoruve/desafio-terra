FROM python:3.10-slim
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        build-essential \
        git \
        curl \
        libglib2.0-0 \
        libsm6 \
        libxrender1 \
        libxext6 \
        libjpeg-dev \
        libpng-dev && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /src
RUN pip install --upgrade pip
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
RUN mkdir /src/tmp
CMD ["python", "/src/src/api.py"]
# CMD ["tail", "-f", "/dev/null"]

EXPOSE 5000