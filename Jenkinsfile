pipeline {

    agent any

    // NodeJS plugin must be configured in Jenkins > Global Tools
    tools {
        nodejs 'NodeJS'
    }

    // Run parameters — shown as a form when you click "Build with Parameters"
    parameters {
        choice(
            name: 'TEST_ENV',
            choices: ['dev', 'staging', 'prod'],
            description: 'Which environment to run tests against?'
        )
        choice(
            name: 'TEST_SUITE',
            choices: ['all', 'smoke', 'regression', 'schema'],
            description: 'Which test suite to run?'
        )
    }

    environment {
        CI       = 'true'
        BASE_URL = "${params.TEST_ENV == 'staging'
            ? 'https://staging-api.yourcompany.com'
            : 'https://jsonplaceholder.typicode.com'}"
    }

    stages {

        // ── Stage 1: Install ─────────────────────────────────────────────────
        stage('Install Dependencies') {
            steps {
                echo "Installing dependencies..."
                // npm ci = clean install, faster and reproducible on CI
                sh 'npm ci'
            }
        }

        // ── Stage 2: Type Check ──────────────────────────────────────────────
        stage('Type Check') {
            steps {
                echo "Running TypeScript type check..."
                sh 'npm run typecheck'
            }
        }

        // ── Stage 3: Run Tests ───────────────────────────────────────────────
        stage('Run Tests') {
            steps {
                echo "Running ${params.TEST_SUITE} tests on ${params.TEST_ENV}..."
                script {
                    // Run specific suite or all tests
                    if (params.TEST_SUITE == 'all') {
                        sh 'npm run test:ci'
                    } else {
                        sh "npx playwright test --grep @${params.TEST_SUITE}"
                    }
                }
            }
        }

        // ── Stage 4: Generate Report ─────────────────────────────────────────
        stage('Generate Allure Report') {
            steps {
                echo "Generating Allure report..."
                sh 'allure generate allure-results --clean -o allure-report'
            }
        }

        // ── Stage 5: Run on Kubernetes (optional) ───────────────────────────────
        stage('Run on Kubernetes') {
            // Only runs when deploying to staging or prod
            when {
                anyOf {
                    expression { params.TEST_ENV == 'staging' }
                    expression { params.TEST_ENV == 'prod' }
                }
            }
            steps {
                echo "Deploying test job to Kubernetes..."
                sh 'kubectl apply -f k8s/namespace.yml'
                sh 'kubectl apply -f k8s/configmap.yml'
                sh 'kubectl apply -f k8s/test-job.yml'

                // Wait for job to complete (timeout: 5 minutes)
                sh 'kubectl wait --for=condition=complete job/playwright-api-tests -n qa-tests --timeout=300s'

                echo "Fetching logs from Kubernetes pod..."
                sh 'kubectl logs -l app=playwright-api-tests -n qa-tests'
            }
        }

    }

    // ── Post Actions (always run) ────────────────────────────────────────────
    post {

        always {
            // Publish Allure report inside Jenkins UI
            allure([
                reportBuildPolicy: 'ALWAYS',
                results: [[path: 'allure-results']]
            ])

            // Save raw results as downloadable artifact
            archiveArtifacts(
                artifacts: 'allure-results/**, logs/**',
                allowEmptyArchive: true
            )

            // Clean workspace to free disk space
            cleanWs()
        }

        success {
            echo '✅ All tests passed! Safe to deploy.'
        }

        failure {
            echo '❌ Tests failed! Deployment blocked.'
            // In real projects you add Slack/email notification here:
            // slackSend channel: '#qa-alerts', message: "Tests failed on ${params.TEST_ENV}"
        }

        unstable {
            echo '⚠️ Some tests were flaky — check the report'
        }
    }
}
```

---

### What's new in this Jenkinsfile

**`TEST_SUITE` parameter** — lets you choose which tests to run from Jenkins UI:
```
all        → runs every test file
smoke      → runs only @smoke tagged tests
regression → runs only @regression tagged tests
schema     → runs only @schema tagged tests

cleanWs() — cleans the workspace after the build to save disk space on the Jenkins server.
unstable — a separate state between pass and fail. Happens when some tests pass and some fail with retries.