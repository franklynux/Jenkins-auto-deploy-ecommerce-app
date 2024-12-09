pipeline {
   agent any
   
   environment {
       DOCKER_IMAGE_NAME     = "franklynux/nodejs-app"
       DOCKER_IMAGE_TAG      = "v1.0"
       DOCKERHUB_CREDENTIALS = credentials('docker-hub-credentials')
   }

   stages {
       stage('Install Docker') {
           steps {
               sh '''
                   sudo apt update
                   sudo apt install -y docker.io
                   sudo usermod -aG docker jenkins
                   sudo systemctl start docker
                   sudo systemctl enable docker
               '''
           }
       }

       stage('Build') {
           agent {
               docker {
                   image 'node:18-slim'
               }
           }
           steps {
               sh 'npm install'
           }
       }

       stage('Test') {
           agent {
               docker {
                   image 'node:18-slim'
               }
           }
           steps {
               sh 'npm test'
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