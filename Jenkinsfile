pipeline {
   agent any
   
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

       stage('Build') {
           agent {
               docker {
                   image 'node:18-slim'
                   args '-u root:root'  // Run as root to avoid permission issues
               }
           }
           steps {
               sh '''
                   mkdir -p /.npm
                   chown -R $(id -u):$(id -g) /.npm
                   npm install
               '''
           }
       }

       stage('Test') {
           agent {
               docker {
                   image 'node:18-slim'
                   args '-u root:root'  // Run as root to avoid permission issues
               }
           }
           steps {
               sh '''
                   mkdir -p /.npm
                   chown -R $(id -u):$(id -g) /.npm
                   npm test
               '''
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