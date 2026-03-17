# Microservices Platform

A production-grade microservices application built with NestJS and KafkaJS, featuring event-driven architecture, infrastructure as code with Terraform, and CI/CD with GitHub Actions.

## Architecture

This platform consists of four microservices:
- **user-service**: Manages user data
- **order-service**: Handles order creation and emits `order.created` events
- **payment-service**: Consumes `order.created` events, processes payments, and emits `payment.completed` events
- **notification-service**: Consumes `payment.completed` events and sends notifications

## Technologies

- **Framework**: NestJS (Node.js)
- **Database**: MongoDB with Mongoose
- **Event Streaming**: KafkaJS with Kafka
- **Infrastructure**: Terraform (AWS EKS, MSK)
- **Containerization**: Docker
- **Orchestration**: Kubernetes with Kustomize
- **CI/CD**: GitHub Actions
- **Local Development**: Skaffold, Docker Compose

## Repository Structure

```
microservices-platform/
├── services/
│   ├── user-service/
│   ├── order-service/
│   ├── payment-service/
│   └── notification-service/
├── shared/
│   └── event-contracts/
├── infrastructure/
│   ├── terraform/
│   │   ├── modules/
│   │   └── environments/
│   └── kubernetes/
│       ├── base/
│       └── overlays/
├── .github/
│   └── workflows/
├── skaffold.yaml
└── README.md
```

## Local Development

### Option 1: Local Infrastructure
1. Start local infrastructure (Kafka + MongoDB):
   ```bash
   docker-compose up -d
   ```

2. Connect MongoDB Compass to: `mongodb://admin:password@localhost:27017`

### Option 2: Atlas MongoDB + Local Kafka
1. Start only Kafka locally:
   ```bash
   docker-compose up -d kafka zookeeper
   ```

2. Use your existing MongoDB Atlas connection in Compass: `mongodb+srv://ekomers_db:LVPJlUwSYhG502a1@cluster-fk.nn5tsbh.mongodb.net/`

### Common Steps
3. Run services with Skaffold:
   ```bash
   skaffold dev
   ```

4. Test the event flow:
   ```bash
   curl -X POST http://localhost:3000/orders \
     -H "Content-Type: application/json" \
     -d '{"userId":"user123","amount":100,"items":[{"id":"item1","qty":1}]}'
   ```

## Deployment

### Infrastructure

1. Initialize Terraform:
   ```bash
   cd infrastructure/terraform/environments/dev
   terraform init
   ```

2. Plan and apply:
   ```bash
   terraform plan
   terraform apply
   ```

### Services

GitHub Actions handles CI/CD:
- Push to `develop` → Deploy to dev
- Tag release → Deploy to staging
- Manual approval → Deploy to prod

## Event Flow

1. `order-service` creates order → emits `order.created`
2. `payment-service` consumes `order.created` → processes payment → emits `payment.completed`
3. `notification-service` consumes `payment.completed` → sends notification

## Security

- Secrets managed via AWS Secrets Manager
- Service-to-service authentication with JWT
- Environment-specific configurations

## Observability

- Prometheus for metrics
- Grafana for dashboards
- Centralized logging with ELK stack

## Best Practices

- Independent deployments
- Event-driven decoupling
- Infrastructure as code
- Automated testing and linting
- Multi-environment support
- Health checks and resource limits