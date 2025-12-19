# Dummy TTS Client

This is a React.js client application designed to crawl/fetch text data from various sources.

## Features
- **TTVFetcher**: Fetches chapters from TangThuVien.
- **TCHFetcher**: Fetches chapters from TruyenChuHay.
- **LinkFetcher**: Helper tool to fetch data from a list of URLs.

## Setup and Usage

### Prerequisites
- Node.js installed.

### Installation
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the App
To start the development server:
```bash
npm start
```
The app will open at [http://localhost:3000](http://localhost:3000).

> **Note:** The application is configured to proxy API requests to `http://localhost:8000` during development. Ensure your backend service is running on this port.

### Building
To create a production build:
```bash
npm run build
```

## Note
This application was originally designed to work with a backend server to bypass CORS. 
Ensure you have the appropriate backend services running or proxy configured if fetching from external sites encountered CORS issues.
Configuration for API endpoints can be found in `src/services/apiService.js`.

## Deployment with Docker

### Prerequisites
- Docker and Docker Compose installed.

### Running with Docker Compose
To build and run the application in a production-ready Nginx container:
```bash
docker-compose up --build
```
The app will be accessible at [http://localhost](http://localhost).

### Manual Docker Build
1. Build the image:
    ```bash
    docker build -t dummy-tts .
    ```
2. Run the container:
    ```bash
    docker run -p 80:80 dummy-tts
    ```

### Deploying to AWS
This Docker setup is compatible with AWS services like ECS or Elastic Beanstalk (Docker platform).
- **ECS**: Push the image to ECR and create a task definition using the image.
- **Elastic Beanstalk**: Zip the `Dockerrun.aws.json` (if needed) or just the application code with `Dockerfile` and `docker-compose.yml`.