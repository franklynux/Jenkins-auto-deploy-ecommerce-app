# Jenkins CI/CD Pipeline for E-commerce Application

This project demonstrates a comprehensive CI/CD pipeline implementation using Jenkins for an E-commerce application. The pipeline includes automated building, testing, containerization, and deployment processes.

![Project Architecture](./images/Jenkins%20CI_CD%20pipeline.png)
***[Flow chart diagram showing the complete CI/CD flow: GitHub -> Jenkins (Build/Test) -> Docker Hub -> Deployment]***

## Table of Contents

- [Project Overview](#project-overview)
- [Prerequisites](#prerequisites)
- [Infrastructure Setup](#infrastructure-setup)
- [Jenkins Configuration](#jenkins-configuration)
- [Pipeline Implementation](#pipeline-implementation)
- [Local Development](#local-development)
- [Security Considerations](#security-considerations)
- [Monitoring and Maintenance](#monitoring-and-maintenance)
- [Troubleshooting](#troubleshooting)
- [Project Structure](#project-structure)
- [Live Demo Documentation](#live-demo-documentation)

## Project Overview

This project implements a complete CI/CD pipeline for an E-commerce application with the following features:

- Automated build and test processes
- Docker containerization
- Automated deployment
- Secure credential management
- Separate jobs for build/test and deployment phases

### Technology Stack

- Jenkins (CI/CD)
- Node.js (Application Runtime)
- Docker (Containerization)
- GitHub (Version Control)
- Ubuntu EC2 (Hosting Environment)

## Prerequisites

### System Requirements

- Ubuntu EC2 instance (t2.micro or larger)
- Minimum 2GB RAM
- 20GB storage
- Open ports: 22 (SSH), 8080 (Jenkins), 3000 (Application)

### Required Software

- Jenkins
- Docker
- Node.js
- Git

## Infrastructure Setup

### EC2 Instance Setup

1. Launch Ubuntu EC2 instance

   ```bash
   # Security Group Configuration
   - SSH (22)
   - HTTP (80)
   - Custom TCP (8080) for Jenkins
   - Custom TCP (3000) for Application
   ```

   ![Security Group Configuration](./images/Security%20group%20fro%20jenkins%20server.png)
   [Image placeholder: Add screenshot of EC2 security group settings]

2. Connect to EC2 instance

   ```bash
   ssh -i "your-key.pem" ubuntu@your-ec2-public-dns
   ```

   **Note:** Replace "your-key.pem" with your EC2 key pair file and "your-ec2-public-dns" with your Jenkins instance public IP/dns.
   ![EC2 connect](./images/ssh%20into%20jenkins%20server.png)

### Installing Required Software

1. Update System Packages

   ```bash
   sudo apt update
   sudo apt upgrade -y
   ```

   **Note:** This command updates the package list and upgrades the system packages to the latest version.
   ![Update packages](./images/apt%20upgrade.png)

2. Install Jenkins

   ```bash
   # This is the Debian package repository of Jenkins to automate installation and upgrade. To use this repository, first add the key to your system:
   sudo wget -O /usr/share/keyrings/jenkins-keyring.asc \
     https://pkg.jenkins.io/debian/jenkins.io-2023.key 

   # Then add a Jenkins apt repository entry:  
   echo deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] \
     https://pkg.jenkins.io/debian-stable binary/ | sudo tee \
     /etc/apt/sources.list.d/jenkins.list > /dev/null

   # Update your local package index, install java, then finally install Jenkins: 
   sudo apt update
   sudo apt-get install fontconfig openjdk-17-jre
   sudo apt install jenkins -y

   # Start Jenkins
   sudo systemctl start jenkins
   sudo systemctl enable jenkins
   ```

   **Jenkins active (running):**
   ![Jenkins Installation](./images/Jenkins%20install%207%20(active%20running).png)
   [Image placeholder: Add screenshot of successful Jenkins installation]

3. Install Docker

   ```bash
   sudo apt install docker.io -y
   sudo systemctl start docker
   sudo systemctl enable docker
   ```

   **Docker active (running):**
   ![docker installed on jenkins](./images/install%20docker%20on%20jenkins%205%20(docker%20running).png)

4. Configure Permissions

   ```bash
   # Add Jenkins user to Docker group
   sudo usermod -aG docker jenkins
   
   # Add Ubuntu user to Docker group
   sudo usermod -aG docker ubuntu
   
   # Restart Jenkins
   sudo systemctl restart jenkins
   ```

## Jenkins Configuration

### Initial Setup

1. Access Jenkins
   - Open browser: `http://your-ec2-public-dns:8080`
   - Get initial admin password:

     ```bash
     sudo cat /var/lib/jenkins/secrets/initialAdminPassword
     ```

   **Jenkins unlock page:**
   ![Jenkins Initial Setup](./images/1.%20jenkins%20login.png)

   **Install suggested plugins (Git, Credentials, Timestamper plugins, etc.) are installed by default:**
   ![Jenkins Initial Setup](./images/2.%20install%20default%20plugins.png)

   **Create First Admin User:**
   ![Jenkins Initial Setup](./images/3.%20create%20new%20user.png)

   **Jenkins URL:**
   ![Jenkins Initial Setup](./images/4.%20Jenkins%20url.png)

2. Install Docker & Pipeline Plugins
   - Docker Pipeline
     
     ![Docker pipeline plugin installed](./images/Docker%20plugin%20install.png)

   - Pipeline

     ![Pipeline plugin installed](./images/Pipeline%20plugin.png)

    **[Docker Pipeline and Pipeline Plugins installed]**

### Configure Authentication and Authorization

1. **Setup Authentication**:
   - Go to Dashboard → Manage Jenkins → Security
   - Under Security Realm, select "Jenkins' own user database"
   - Check "Allow users to sign up" (you can uncheck this later)

   ![Jenkins Security](./images/Jenkins%20User%20Authenticaion.png)
   ***[Screenshot showing Jenkins security realm configuration]***

2. **Configure Authorization**:
   - In the same Security page
   - Under Authorization, select "Matrix-based security"
   - Add admin user with all permissions
   - Add other users with specific permissions:
     - Overall: Read
     - Job: Build, Read, Workspace
     - View: Read
   - Click Save

   ![Jenkins Authorization](./images/Jenkins%20User%20Authorization.png)
   ***[Screenshot showing Jenkins authorization matrix configuration]***

3. **Manage Users**:
   - Go to Dashboard → Manage Jenkins → Users
   - Add/remove users as needed
   - Set strong passwords
   - Disable sign-up option after adding necessary users

### Configure Credentials

1. Add DockerHub Credentials
   - Dashboard → Manage Jenkins → Credentials → System → Global credentials
   - Add Credentials:
     - Kind: Username with password
     - Scope: Global
     - ID: docker-hub-credentials
     - Description: DockerHub credentials

   ![DockerHub Credentials](./images/6.%20docker%20cred.png)

   ![DockerHub Credentials](./images/7.%20docker%20cred%202.png)
   ![DockerHub Credentials](./images/8.%20docker%20cred%203.png)
   ![DockerHub Credentials](./images/9.%20docker%20cred%20create.png)
   ![DockerHub Credentials](./images/10.%20docker%20cred%20complete.png)
   - DockerHub username and password are stored securely in Jenkins credentials.

## Pipeline Implementation

### GitHub Webhook Setup

To enable automatic triggering of the Jenkins pipeline when code changes are pushed to GitHub:

1. **Setup GitHub Webhook**:
   - Go to your GitHub repository
   - Click Settings → Webhooks → Add webhook

    ![webhook navigation](./images/11.%20github%20webhook%20set.png)
    ![webhook navigation](./images/12.%20github%20webhook%20set%202.png)

   - Configure webhook:
     - Payload URL: `http://your-jenkins-url/github-webhook/`
     - Content type: `application/json`
     - Secret: (Optional) Add a secret token
     - SSL verification: Enable if using HTTPS
     - Events: Select "Just the push event"
     - Active: Check to enable the webhook

   ![GitHub Webhook Setup](./images/14.%20github%20webhook%20set%204%20(add).png)
   ***[Screenshot showing GitHub webhook configuration page]***

2. **Verify Webhook**:
   - GitHub will send a ping event
   - Check the webhook's Recent Deliveries
   - Verify the ping event was successful (green checkmark)

   ![GitHub Webhook Delivery](./images/15.%20github%20webhook%20complete.png)
   ***[Screenshot showing successful webhook delivery]***

### Freestyle Job Setup (Build & Test)

1. Create New Freestyle Job
   - Dashboard → New Item → Freestyle project
   - Name: "Job for Build and Unit tests (E-commerce app)"
      ![Freestyle Job Config-Name](./images/16.%20freestyle%20job%20create.png)

   - Source Code Management: Git
      ![Freestyle Job Config-scm](./images/17.%20scm%20set.png)

   - Build Steps: Execute shell

     ```bash
     chmod +x jenkins-freestyle-build.sh
     ./jenkins-freestyle-build.sh
     ```

     ![Freestyle Job Config-build](./images/Freestyle%20job%20build%20step%20(exec%20cmds).png)

     ***[Screenshots of freestyle job configuration]***

### Pipeline Job Setup (Docker Build & Deploy)

1. Create New Pipeline Job
   Dashboard → New Item → Freestyle project
   - Name: "Pipeline Job for running a web app (E-commerce app)"
   ![Pipeline Job Configuration](./images/19.%20pipeline%20job%20set.png)

   - Pipeline script from SCM
   - SCM: Git
   ![Pipeline Job Configuration](./images/20.%20pipeline%20job%20set.png)

   - Script Path: Jenkinsfile

   ![Pipeline Job Configuration](./images/21.%20pipeline%20job%20set%202.png)

   ***[Screenshots of pipeline job configuration]***

## Security Measures

- **Jenkins Server Security**:
  - Ensure Jenkins is running behind a reverse proxy with SSL termination.
  - Use strong passwords for Jenkins users and enable two-factor authentication if possible.
  - Regularly update Jenkins and its plugins to the latest versions to mitigate vulnerabilities.

- **Source Code Management Security**:
  - Use SSH keys for GitHub integration instead of username/password.
  - Limit access to the repository and use branch protection rules.

- **Pipeline Security**:
  - Use environment variables for sensitive information (e.g., Docker Hub credentials).
  - Regularly review and audit Jenkins jobs and pipelines for security best practices.

- **Docker Security**:
  - Use official base images and regularly scan images for vulnerabilities.
  - Limit container privileges and use user namespaces to enhance security.

## Monitoring and Maintenance

1. Jenkins Monitoring
   - Monitor build logs
   - Set up email notifications
   - Regular backup of Jenkins configuration

2. Application Monitoring
   - Monitor container logs
   - Health checks
   - Resource utilization

## Troubleshooting

Common Issues and Solutions:

1. Permission Issues

   ```bash
   # Fix Docker permissions
   sudo chmod 666 /var/run/docker.sock
   sudo systemctl restart docker
   sudo systemctl restart jenkins
   ```

2. Build Failures
   - Check Node.js installation
   - Verify Docker daemon status
   - Check network connectivity

3. Deployment Issues
   - Verify port availability
   - Check container logs
   - Verify DockerHub credentials

## Project Structure

```
.
├── app.js                 # Main application file
├── app.test.js           # Test files
├── Dockerfile            # Docker configuration
├── Jenkinsfile          # Pipeline definition
├── jenkins-freestyle-build.sh  # Build script
├── package.json         # Node.js dependencies
├── live_demo_documentation.md  # Live demo documentation
└── README.md           # Project documentation
```

### Dockerfile

The Dockerfile defines how the application is containerized:

```dockerfile
# Base image - using Node.js 18 slim version for smaller image size
FROM node:18-slim 

# Set working directory for application
WORKDIR /usr/src/app

# Copy package files first to leverage Docker cache
COPY package*.json ./ 

# Install dependencies
RUN npm install

# Copy application source code
COPY . .

# Container listens on port 3000
EXPOSE 3000

# Default command to start application
CMD [ "npm", "start" ]
```

![Dockerfile in project structure](./images/Dockerfile%20image.png)

### Jenkinsfile

The Jenkinsfile defines the CI/CD pipeline stages:

```groovy
pipeline {
    agent any

    environment {
        DOCKER_REGISTRY = 'docker.io'
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
                    sh "docker build -t ${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG} ."
                    
                    // Login and push using credentials in a secure way
                    withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', 
                        passwordVariable: 'DOCKER_PASSWORD', 
                        usernameVariable: 'DOCKER_USERNAME')]) {
                        sh '''
                            echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin
                            docker push ${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}
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
```

![jenkins pipeline script](./images/Jenkinsfile%20image.png)

### Jenkins Freestyle Build Script

The `jenkins-freestyle-build.sh` script handles the build and test process:

```bash
#!/bin/bash

# Function to install Node.js using nvm
setup_nodejs() {
    # Install nvm if not present
    export NVM_DIR="$HOME/.nvm"
    if [ ! -d "$NVM_DIR" ]; then
        echo "Installing nvm..."
        curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
        [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # Load nvm
    fi

    # Load nvm if already installed
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

    # Install and use Node.js 18
    echo "Installing Node.js 18..."
    nvm install 18
    nvm use 18
}

# Setup Node.js
setup_nodejs

# Verify installation
echo "Node.js version:"
node -v
echo "npm version:"
npm -v

# Clean npm cache and install dependencies
echo "Cleaning npm cache and installing dependencies..."
rm -rf node_modules package-lock.json
npm cache clean --force
npm install

# Run tests
echo "Running tests..."
npm test
```

![Freestyle job Build & Test Script](./images/freestyle%20job%20script.png)

## Results and Screenshots

### Build Process

![Build Process](./images/Jenkins%20Build%20(Success).png)
***[Freestyle job successful build]***

### Test Results

![Test Results](./images/Jenkins%20Test%20(Success).png)
***[Freestyle job successful test results]***

### Deployment

![Deployment](./images/Jenkins%20Running%20app%20(success)%201.png)
![Deployment](./images/Jenkins%20Running%20app%20(success)%202.png)
***[Docker image built, pushed and deployed. Pipeline completed with success]***

### Running Application

![Application](./images/Access%20web%20app.png)
![Application](./images/Access%20web%20app%202.png)
***[Web application running successfully]***

## Local Development

### Prerequisites

- Ensure you have Node.js (version 18 or higher) and npm installed on your machine.

### Building the Application

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/franklynux/Jenkins-auto-deploy-ecommerce-app.git
   cd Jenkins-auto-deploy-ecommerce-app
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

### Running the Application

To start the application locally, run:

```bash
npm start
```

The application will be available at `http://localhost:3000`.

### Running Tests

To execute the tests, run:

```bash
npm test
```

This will run the test suite and display the results in the terminal.

### Stopping the Application

To stop the application, you can use `Ctrl + C` in the terminal where the application is running.

## API Endpoints

### Home Page

- **URL:** `/`

![Home Page Screenshot](./images/API%20endpoints%20-%20Home.png)

- **Method:** `GET`
- **Description:** Landing page with navigation links

### Services

- **URL:** `/services`

![Services Page Screenshot](./images/API%20endpoints%20-%20Services.png)

- **Method:** `GET`
- **Description:** Displays available consulting services

### Contact Form

- **URL:** `/contact`

![Contact Form Screenshot](./images/API%20endpoints%20-%20contact.png)

- **Method:** `GET`
- **Description:** Contact form for inquiries

### Submit Contact

- **URL:** `/submit-contact`

![Submit Contact Screenshot](./images/API%20endpoints%20-%20(submit-contact).png)

- **Method:** `POST`
- **Description:** Handles contact form submissions
- **Body Parameters:**
  - `name`: String (required)
  - `email`: String (required)
  - `message`: String (required)

![Body parameters validation](./images/API%20endpoints%20-%20contact%202.png)
***[Body parameters validation]***

## Error Handling

The application includes built-in error handling for:

![Error Page Screenshot](./images/API%20endpoints%20-%20(error%20404).png)

- 404 Not Found errors
- 500 Server errors
- Invalid form submissions

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License - see the package.json file for details.

## Author

[franklynux](https://github.com/franklynux)
