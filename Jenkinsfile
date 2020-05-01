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
        sh '''chmod +x ./scripts/productionStart
BUILD_ID=dontKillMe ./scripts/productionStart'''
      }
    }

  }
}