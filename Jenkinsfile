pipeline {
  agent any
  stages {
    stage('build') {
      steps {
        sh '''cd 410democentral-frontend
npm install
npm run build
cd ../410democentral-backend
npm install

'''
      }
    }

    stage('deploy') {
      steps {
        sh '''pm2 start 410democentral-backend/app.js
pm2 start 410democentral-backend/serv_frontend.js'''
      }
    }

  }
}