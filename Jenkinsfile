pipeline {
    agent any

    environment {
        DOCKER_REGISTRY = 'docker.io'
        DOCKER_IMAGE_NAME = 'franklynux/nodejs-app'
        DOCKER_IMAGE_TAG = 'v1.0'
        // This creates DOCKERHUB_CREDENTIALS_USR and DOCKERHUB_CREDENTIALS_PSW
        DOCKERHUB_CREDENTIALS = credentials('docker-hub-credentials')
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/franklynux/Jenkins-auto-deploy-ecommerce-app.git'
            }
        }

        stage('Install Dependencies and Test') {
            agent {
                docker {
                    image 'node:18-slim'
                    args '-u root:root'
                    reuseNode true
                }
            }
            steps {
                sh '''
                    echo "Setting up npm permissions..."
                    mkdir -p /.npm
                    chown -R $(id -u):$(id -g) /.npm
                    
                    echo "Cleaning npm cache and node_modules..."
                    rm -rf node_modules package-lock.json
                    
                    echo "Installing dependencies..."
                    npm cache clean --force
                    NODE_ENV=production npm install --no-fund --no-audit
                    
                    echo "Running tests..."
                    npm test
                '''
            }
        }

        stage('Build and Push Docker Image') {
            steps {
                script {
                    // Build Docker image using buildx
                    sh """
                        docker buildx create --use
                        docker buildx build --platform linux/amd64 -t ${DOCKER_REGISTRY}/${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG} .
                    """
                    
                    // Login and push using credentials in a secure way
                    withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_USERNAME')]) {
                        sh '''
                            echo "$DOCKER_PASSWORD" | docker login ${DOCKER_REGISTRY} -u "$DOCKER_USERNAME" --password-stdin
                            docker push ${DOCKER_REGISTRY}/${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}
                        '''
                    }
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    sh '''
                        # Stop and remove existing container if it exists
                        if docker ps -a | grep -q tech-consulting-app; then
                            docker stop tech-consulting-app
                            docker rm tech-consulting-app
                        fi
                        
                        # Run new container
                        docker run -d \\
                            --name tech-consulting-app \\
                            --restart unless-stopped \\
                            -p 3000:3000 \\
                            ${DOCKER_REGISTRY}/${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}
                    '''
                }
            }
        }
    }

    post {
        always {
            sh 'docker logout ${DOCKER_REGISTRY}'
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
