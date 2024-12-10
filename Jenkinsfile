pipeline {
    agent any

    environment {
        DOCKER_IMAGE_NAME     = "franklynux/nodejs-app"
        DOCKER_IMAGE_TAG      = "v1.0"
        // This line creates DOCKERHUB_CREDENTIALS_USR and DOCKERHUB_CREDENTIALS_PSW variables
        DOCKERHUB_CREDENTIALS = credentials('docker-hub-credentials')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies and Test') {
            agent {
                docker {
                    image 'node:18-slim'
                    reuseNode true
                }
            }
            steps {
                sh '''
                    echo "Cleaning npm cache and node_modules..."
                    rm -rf node_modules package-lock.json
                    
                    echo "Installing dependencies..."
                    npm cache clean --force
                    npm install
                    
                    echo "Running tests..."
                    npm test
                '''
            }
        }

        stage('Build and Push Docker Image') {
            steps {
                script {
                    // Using the automatically created credential variables
                    withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', usernameVariable: 'DOCKERHUB_CREDENTIALS_USR', passwordVariable: 'DOCKERHUB_CREDENTIALS_PSW')]) {
                        // Login to DockerHub
                        sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
                        
                        // Build Docker image
                        sh "docker build -t ${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG} ."
                        
                        // Push Docker image
                        sh "docker push ${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}"
                    }
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    sh '''
                        docker stop tech-consulting-app || true
                        docker rm tech-consulting-app || true
                        docker run -d -p 3000:3000 --name tech-consulting-app ${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}
                    '''
                }
            }
        }
    }

    post {
        always {
            sh 'docker logout'
        }
    }
}
