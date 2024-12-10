pipeline {
    agent any

    environment {
        DOCKER_IMAGE_NAME = 'franklynux/nodejs-app'
        DOCKER_IMAGE_TAG = 'v1.0'
        DOCKERHUB_CREDENTIALS = credentials('docker-hub-credentials')
    }

    stages {
        stage('Clean Workspace') {
            steps {
                cleanWs()
            }
        }

        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/franklynux/Jenkins-auto-deploy-ecommerce-app.git'
            }
        }

        stage('Build and Push Docker Image') {
            steps {
                script {
                    // Build Docker image
                    sh """
                        # Ensure buildx is initialized
                        docker buildx create --use || true
                        docker buildx build --platform linux/amd64 -t ${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG} --push .
                    """
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    sh '''
                        # Stop and remove existing container if it exists
                        if docker inspect tech-consulting-app &>/dev/null; then
                            docker stop tech-consulting-app
                            docker rm tech-consulting-app
                        fi
                        
                        # Run new container
                        docker run -d \
                            --name tech-consulting-app \
                            --restart unless-stopped \
                            -p 3000:3000 \
                            ${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}
                    '''
                }
            }
        }
    }

    post {
        always {
            sh 'docker logout'
            cleanWs()
        }
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed! Check the logs for details.'
        }
    }
}
