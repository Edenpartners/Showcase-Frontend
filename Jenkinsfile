pipeline {
    agent { label 'slave-react' }

    stages {

        stage('Install Dependencies') {
            steps {
                sh 'yarn install'
            }
        }

        stage('Config') {
            steps {
                script {
                    env.APP_ENV = 'develop'
                    env.SSH_PUBLISHER = 'E1 Showcase'
                    if (env.BRANCH_NAME == 'release') {
                        env.APP_ENV = 'staging'
                        env.SSH_PUBLISHER = 'E1 Showcase Staging'
                    }
                }

                sh "cp config/config.${env.APP_ENV}.js src/config.js"
            }
        }

        stage('Build') {
            steps {
                sh 'yarn build'
            }
        }

        stage('Deploy') {
            steps {
                echo "Deploying with branch: ${env.APP_ENV}"
                sshPublisher(publishers: [
                    sshPublisherDesc(
                        configName: "${env.SSH_PUBLISHER}",
                        transfers: [
                            sshTransfer(excludes: '', execCommand: "rm -rf ${env.APP_ENV}/frontend/*", execTimeout: 120000, flatten: false, makeEmptyDirs: false, noDefaultExcludes: false, patternSeparator: '[, ]+', remoteDirectory: '', remoteDirectorySDF: false, removePrefix: '', sourceFiles: ''),
                            sshTransfer(excludes: '', execCommand: '', execTimeout: 120000, flatten: false, makeEmptyDirs: false, noDefaultExcludes: false, patternSeparator: '[, ]+', remoteDirectory: "${env.APP_ENV}/frontend", remoteDirectorySDF: false, removePrefix: 'build', sourceFiles: 'build/**'),
                            sshTransfer(excludes: '', execCommand: '', execTimeout: 120000, flatten: false, makeEmptyDirs: false, noDefaultExcludes: false, patternSeparator: '[, ]+', remoteDirectory: "${env.APP_ENV}/frontend", remoteDirectorySDF: false, removePrefix: '', sourceFiles: 'docker-compose.yml'),
                            sshTransfer(excludes: '', execCommand: '', execTimeout: 120000, flatten: false, makeEmptyDirs: false, noDefaultExcludes: false, patternSeparator: '[, ]+', remoteDirectory: "${env.APP_ENV}/frontend", remoteDirectorySDF: false, removePrefix: '', sourceFiles: 'docker/**'),
                            sshTransfer(excludes: '', execCommand: "cd ${env.APP_ENV}/frontend && source .env && sudo docker-compose -p frontend_${env.APP_ENV} up -d", execTimeout: 120000, flatten: false, makeEmptyDirs: false, noDefaultExcludes: false, patternSeparator: '[, ]+', remoteDirectory: '', remoteDirectorySDF: false, removePrefix: '', sourceFiles: '')
                        ],
                        usePromotionTimestamp: false,
                        useWorkspaceInPromotion: false,
                        verbose: false
                    )])
            }
        }
    }
}
