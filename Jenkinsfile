// jenkinsfile
pipeline {
    agent any
    
    //connect to hub
    //its like keeping the variables - jenkins will take the values from the dockerhub credentials(check)
    environment {
        DOCKER_HUB_CREDENTIALS = credentials('dockerhub-credentials') //id -  
        DOCKER_HUB_USERNAME = 'gayathriem'
        FRONTEND_IMAGE = "${DOCKER_HUB_USERNAME}/extrail-frontend"
        BACKEND_IMAGE = "${DOCKER_HUB_USERNAME}/extrail-backend"
        VERSION = "${BUILD_NUMBER}"
    }
    
    stages {
        //pull code from github
        stage('Checkout') {
            steps {
                echo '🔄 Checking out code from GitHub...'
                checkout scm
            }
        }
        
        //backend build - goes to backend dir in the github and build using maven - mainly to run code, and check if the code runs properly
        stage('Build Backend') {
            steps {
                echo '🏗️ Building Backend with Maven...'
                dir('extrail_expense_tracker_backend') {
                    sh 'mvn clean package -DskipTests'
                }
            }
        }
        //building frontend - similar ng build (current files -> dist folder), build frontend sep - mainly to run code, and check if the code runs properly
        stage('Build Frontend') {
            steps {
                echo '🎨 Building Frontend with npm...'
                dir('extrail_expense_tracker_frontend') {
                    sh 'npm ci --silent'
                    sh 'npm run build -- --configuration production'
                }
            }
        }
        
        //build docker image - folder where the dockerfile is presenet 
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
                sh "echo ${DOCKER_HUB_CREDENTIALS_PSW} | docker login -u ${DOCKER_HUB_CREDENTIALS_USR} --password-stdin" //puts username and pass and connect to docker hub
                sh "docker push ${BACKEND_IMAGE}:${VERSION}" //push all the images to docker hub
                sh "docker push ${BACKEND_IMAGE}:latest"
                sh "docker push ${FRONTEND_IMAGE}:${VERSION}"
                sh "docker push ${FRONTEND_IMAGE}:latest"
            }
        }
        
        //from here only ec2
        //docker-compose  - jenkins - keep in home directory (goes to repo, and all the files are present, take the compose files and put to home dir of ec2 - from here pull the images that is the frontend and backend images)
        // go to home dir and 
        //take .env out
        //pushed latest image - pull here (to ec2) 
        //pipeline is run a lot of times, so down old container and run new container

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
