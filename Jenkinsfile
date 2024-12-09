pipeline {
    agent any

    environment {
        DOCKER_IMAGE_NAME = "franklynux/nodejs-app"
        DOCKER_IMAGE_TAG = "v1.0"
        DOCKERHUB_CREDENTIALS = credentials('docker-hub-credentials')
    }

    stages {
        stage('Build') {
            steps {
                sh 'npm install'
            }
        }
        stage('Test') {
            steps {
                sh 'npm test'
            }
        }
        stage('Build Docker Image') {
            steps {
                script {
                    def dockerImage = docker.build("${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}")
                }
            }
        }
        stage('Push Docker Image') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', DOCKERHUB_CREDENTIALS) {
                        def dockerImage = docker.build("${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}")
                        dockerImage.push()
                    }
                }
            }
        }
        stage('Deploy') {
            steps {
                sh 'docker run -d -p 3000:3000 --name tech-consulting-app ${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}'
            }
        }
    }
}
