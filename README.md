![API Tests](https://github.com/YOUR_USERNAME/playwright-api-framework/actions/workflows/tests.yml/badge.svg)

# Playwright API Automation Framework

A production-ready REST API test automation framework built with **Playwright** and **TypeScript**.

## 🏗️ Framework Architecture
```
playwright-api-framework/
├── src/
│   ├── pages/          # API Page Objects — one file per resource
│   ├── models/         # TypeScript interfaces + JSON schemas
│   ├── utils/          # ApiClient + SchemaValidator
│   └── data/           # Test data for data-driven tests
├── tests/
│   ├── users.spec.ts            # Core CRUD tests
│   ├── users.data-driven.spec.ts # Data driven tests
│   └── users.schema.spec.ts     # Schema validation tests
├── Jenkinsfile         # CI/CD pipeline
├── Dockerfile          # Containerised test runs
└── k8s/                # Kubernetes job manifests
```

## 🛠️ Tech Stack

| Tool | Purpose |
|------|---------|
| [Playwright](https://playwright.dev) | HTTP client + test runner |
| TypeScript | Type safety across the framework |
| AJV | JSON schema validation |
| Allure | Interactive test reporting |
| Jenkins | CI/CD pipeline |
| Docker | Containerised test execution |
| Kubernetes | Scalable test runs |

## ✅ What's Covered

- **CRUD testing** — GET, POST, PUT, DELETE
- **Schema validation** — verifies entire response structure using AJV
- **Data driven tests** — same test runs with multiple inputs automatically
- **Type safety** — TypeScript interfaces for all request/response models
- **Environment switching** — dev/staging/prod via `.env` files
- **API Page Object pattern** — all endpoint logic in one place per resource
- **Allure reporting** — visual interactive reports with severity tags

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Install
```bash
npm install
```

### Run all tests
```bash
npm test
```

### Run specific suite
```bash
# Smoke tests only
npx playwright test --grep @smoke

# Regression tests only
npx playwright test --grep @regression

# Schema tests only
npx playwright test --grep @schema
```

### Run against different environment
```bash
# Staging
TEST_ENV=staging npm test
```

### Generate and view Allure report
```bash
npm run report
```

## 🏛️ Design Patterns

### API Page Object Pattern

Each API resource has its own page class. Tests never hardcode URLs.
```typescript
// ✅ Clean — tests call methods
const response = await usersPage.getById(1);

// ❌ Avoid — tests hardcode URLs
const response = await request.get('/users/1');
```

### Schema Validation

Validates the entire response structure in one call.
```typescript
// Checks ALL fields and types automatically
SchemaValidator.validate(response.body, UserSchema);
```

### Data Driven Tests

One test runs multiple times with different inputs.
```typescript
for (const user of validUsers) {
  test(`POST /users - create ${user.name}`, async () => {
    const response = await usersPage.create(user);
    expect(response.status).toBe(201);
  });
}
```

## 🔁 CI/CD

The `Jenkinsfile` defines a parameterised pipeline:
```
Install → Type Check → Run Tests → Generate Report
```

**Parameters:**
- `TEST_ENV` — choose dev, staging, or prod
- `TEST_SUITE` — choose all, smoke, regression, or schema

## 🐳 Docker
```bash
# Build image
docker build -t playwright-api-framework .

# Run tests in container
docker run playwright-api-framework
```

## ☸️ Kubernetes
```bash
# Create namespace
kubectl apply -f k8s/namespace.yml

# Apply config
kubectl apply -f k8s/configmap.yml

# Run test job
kubectl apply -f k8s/test-job.yml

# Watch progress
kubectl get jobs -n qa-tests
```

## 📊 Test Structure

| File | Tests | Tags |
|------|-------|------|
| users.spec.ts | Core CRUD + edge cases | smoke, regression |
| users.data-driven.spec.ts | Multiple inputs | data-driven |
| users.schema.spec.ts | Response structure | schema |