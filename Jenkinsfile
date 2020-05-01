pipeline {
  agent any
  stages {
    stage('build') {
      parallel {
        stage('build frontend') {
          steps {
            sh '''cd 410democentral-frontend
npm install
npm run build
'''
          }
        }

        stage('build backend') {
          steps {
            sh '''cd 410democentral-backend
npm install'''
          }
        }

      }
    }

    stage('deploy') {
      steps {
        sh '''export JENKINS_NODE_COOKIE=dontKillMe
pm2 kill
pm2 start 410democentral-backend/app.js
pm2 start 410democentral-backend/serv_frontend.js'''
      }
    }

  }
}