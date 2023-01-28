pipeline {
    agent any     

    stages { 
        stage('docker compose up chat.dev.tool - dev') {     
             when { 
                branch 'master'
            }       
            steps {
                 sh '''                  
                    docker-compose up -d --build
                '''             
            }
        }        
    }

     post{
        always{
            sh 'docker image prune --all --filter until=48h -f'
        }
    }
}