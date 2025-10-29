// jenkinsfile
pipeline {
    agent any
    
    environment {
        DOCKER_HUB_CREDENTIALS = credentials('dockerhub-credentials')
        DOCKER_HUB_USERNAME = 'gayathriem'
        FRONTEND_IMAGE = "${DOCKER_HUB_USERNAME}/extrail-frontend"
        BACKEND_IMAGE = "${DOCKER_HUB_USERNAME}/extrail-backend"
        VERSION = "${BUILD_NUMBER}"
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo '🔄 Checking out code from GitHub...'
                checkout scm
            }
        }
        
        stage('Build Backend') {
            steps {
                echo '🏗️ Building Backend with Maven...'
                dir('extrail_expense_tracker_backend') {
                    sh 'mvn clean package -DskipTests'
                }
            }
        }
        
        stage('Build Frontend') {
            steps {
                echo '🎨 Building Frontend with npm...'
                dir('extrail_expense_tracker_frontend') {
                    sh 'npm ci --silent'
                    sh 'npm run build -- --configuration production'
                }
            }
        }
        
        stage('Build Docker Images') {
            steps {
                echo '🐳 Building Docker images...'
                sh "docker build -t ${BACKEND_IMAGE}:${VERSION} -t ${BACKEND_IMAGE}:latest ./extrail_expense_tracker_backend"
                sh "docker build -t ${FRONTEND_IMAGE}:${VERSION} -t ${FRONTEND_IMAGE}:latest ./extrail_expense_tracker_frontend"
            }
        }
        
        stage('Push to Docker Hub') {
            steps {
                echo '📤 Pushing images to Docker Hub...'
                sh "echo ${DOCKER_HUB_CREDENTIALS_PSW} | docker login -u ${DOCKER_HUB_CREDENTIALS_USR} --password-stdin"
                sh "docker push ${BACKEND_IMAGE}:${VERSION}"
                sh "docker push ${BACKEND_IMAGE}:latest"
                sh "docker push ${FRONTEND_IMAGE}:${VERSION}"
                sh "docker push ${FRONTEND_IMAGE}:latest"
            }
        }
        
        stage('Deploy Application') {
            steps {
                echo '🚀 Deploying application on same EC2...'
                sh '''bash -c "
                    # Copy compose file to app directory
                    cp docker-compose.prod.yml /home/ubuntu/extrail-expense-tracker/
                    cd /home/ubuntu/extrail-expense-tracker
                    
                    # Load environment variables
                    set -a
                    source .env
                    set +a
                    
                    # Pull latest images
                    docker-compose -f docker-compose.prod.yml pull
                    
                    # Stop old containers (ignore errors if first run)
                    docker-compose -f docker-compose.prod.yml down || true
                    
                    # Start new containers
                    docker-compose -f docker-compose.prod.yml up -d
                    
                    # Clean up old images
                    docker image prune -f
                    
                    # Show running containers
                    echo '✅ Deployment complete! Running containers:'
                    docker ps
                "
                '''
            }
        }
    }
    
    post {
        always {
            echo '🧹 Cleaning up...'
            sh 'docker logout'
        }
        success {
            echo '=========================================='
            echo '✅ DEPLOYMENT SUCCESSFUL!'
            echo '=========================================='
            echo 'Access your application:'
            echo '  Frontend: http://YOUR_EC2_IP'
            echo '  Jenkins: http://YOUR_EC2_IP:8080'
            echo '  Backend API: http://YOUR_EC2_IP:8081/api/...'
            sh 'docker ps'
        }
        failure {
            echo '=========================================='
            echo '❌ DEPLOYMENT FAILED!'
            echo 'Check the console output above for errors'
            echo '=========================================='
        }
    }
}
