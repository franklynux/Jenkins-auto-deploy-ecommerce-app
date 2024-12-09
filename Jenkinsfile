pipeline {
   agent {
       docker {
           image 'node:18-slim'
           args '-u root:root -v /var/run/docker.sock:/var/run/docker.sock'
       }
   }
   
   environment {
       DOCKER_IMAGE_NAME     = "franklynux/nodejs-app"
       DOCKER_IMAGE_TAG      = "v1.0"
       DOCKERHUB_CREDENTIALS = credentials('docker-hub-credentials')
   }

   stages {
       stage('Check Docker') {
           steps {
               script {
                   // Check if Docker is installed and running
                   sh '''
                       docker --version || {
                           echo "Docker is not installed or not in PATH"
                           exit 1
                       }
                       docker info || {
                           echo "Docker daemon is not running"
                           exit 1
                       }
                   '''
               }
           }
       }

       stage('Build and Test') {
           steps {
               script {
                   // Clean install
                   sh '''
                       echo "Cleaning npm cache and node_modules..."
                       rm -rf node_modules package-lock.json
                       mkdir -p /.npm
                       chown -R $(id -u):$(id -g) /.npm
                       
                       echo "Installing dependencies..."
                       npm cache clean --force
                       # Install both production and dev dependencies
                       NODE_ENV=development npm install
                       
                       echo "Running tests..."
                       NODE_ENV=development npm test
                   '''
               }
           }
       }

       stage('Build Docker Image') {
           steps {
               script {
                   dockerImage = docker.build("${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}")
               }
           }
       }

       stage('Push Docker Image') {
           steps {
               script {
                   docker.withRegistry('https://index.docker.io/v1/', DOCKERHUB_CREDENTIALS) {
                       dockerImage.push()
                   }
               }
           }
       }

       stage('Deploy') {
           steps {
               sh '''
                   docker stop tech-consulting-app || true
                   docker rm tech-consulting-app || true
                   docker run -d -p 3000:3000 --name tech-consulting-app ${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}
               '''
           }
       }
   }

   post {
       always {
           sh 'docker logout'
       }
   }
}
