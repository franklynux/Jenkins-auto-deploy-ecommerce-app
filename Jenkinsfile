pipeline {
    agent {
        docker {
            image 'node:18-slim'
        }
    }

    environment {
        DOCKER_IMAGE_NAME     = "franklynux/nodejs-app"
        DOCKER_IMAGE_TAG      = "v1.0"
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
            agent any
            steps {
                script {
                    dockerImage = docker.build("${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}")
                }
            }
        }

        stage('Push Docker Image') {
            agent any
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', DOCKERHUB_CREDENTIALS) {
                        dockerImage.push()
                    }
                }
            }
        }

        stage('Deploy') {
            agent any
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