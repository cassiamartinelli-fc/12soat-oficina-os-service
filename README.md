# OS Service

Microsserviço responsável pela gestão de Ordens de Serviço (OS) no sistema da oficina mecânica.

## Responsabilidades

- Abertura de novas Ordens de Serviço.
- Consulta de status e histórico das OS.
- Atualização de status durante o ciclo de vida da OS.
- Publicação e consumo de eventos de negócio via AWS SQS para orquestrar o fluxo com outros serviços.

## Tecnologias

- **Framework**: NestJS (Node.js + TypeScript)
- **Banco de Dados**: PostgreSQL (via TypeORM)
- **Mensageria**: AWS SQS

## Variáveis de Ambiente (Secrets)

As seguintes variáveis de ambiente devem ser configuradas como secrets no repositório do GitHub para que o pipeline de CI/CD funcione corretamente:

- `AWS_ACCESS_KEY_ID`: AWS Access Key
- `AWS_SECRET_ACCESS_KEY`: AWS Secret Key
- `KUBECONFIG`: Obtido no Passo 1.3
- `OS_DATABASE_URL`: Connection string PostgreSQL (Neon)
- `SONAR_TOKEN`:  Token do Sonar
- `SQS_BILLING_QUEUE_URL`: URL da fila SQS de Billing Service
- `SQS_OS_QUEUE_URL`: URL da fila SQS de OS Service
- `NEW_RELIC_LICENSE_KEY`: License key New Relic
