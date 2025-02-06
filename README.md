# 🚗 AutoCars - Plataforma de Anúncios de Carros
Este projeto começou como um pequeno experimento há 8 meses, mas foi retomado e escalado com novos aprendizados, como arquitetura limpa, testes, desacoplamento e muito mais. Agora, é uma plataforma robusta onde os usuários podem publicar anúncios de carros, incluindo envio de imagens, detalhes do veículo, histórico de vendas, favoritar anúncios, deixar comentários e funcionalidades adicionais.

Atualmente, o projeto segue a arquitetura monolítica. No entanto, em breve pretendo aprender sobre microsserviços para maior desacoplamento e facilidade de manutenção.

## 🚀 Tecnologias Utilizadas

As principais tecnologias usadas no projeto incluem:

- ![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white) - Framework para Node.js
- ![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white) - Utilizado internamente pelo NestJS
- ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white) - Banco de dados
- ![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white) - ORM para interação com o banco
- ![Vitest](https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white) - Testes unitários e de integração
- ![Nodemailer](https://img.shields.io/badge/Nodemailer-333?style=for-the-badge&logo=nodemailer&logoColor=white) - Envio de emails
- ![MinIO](https://img.shields.io/badge/MinIO-FF4F00?style=for-the-badge&logo=minio&logoColor=white) - Armazenamento de imagens

## 📂 Estrutura de Pastas

```bash
prisma/
src/
  ├── core/
  │   ├── domain/
  │   ├── dto/
  │   ├── errors/
  │   ├── logic/
  │
  ├── domain/
  │   ├── application/
  │   │   ├── cryptography/
  │   │   ├── errors/
  │   │   ├── repositories/
  │   │   ├── use-cases/
  │   ├── enterprise/
  │   │   ├── entities/
  │   │   ├── value-object/
  │
  ├── infra/
  │   ├── auth/
  │   ├── cryptography/
  │   ├── database/
  │   ├── env/
  │   ├── http/
  │   ├── mailer/
  │   ├── storage/
  │
  tests/ # Implementações InMemory para testes
```

## 📜 Arquitetura

O projeto segue a **Arquitetura Limpa**, garantindo modularidade, baixo acoplamento e alta testabilidade. Além disso, utilizamos os princípios **SOLID**, com forte aplicação de **Inversão de Dependência** e **Injeção de Dependências** do NestJS.

### 📌 Camadas da Arquitetura

- **Core**: Contém elementos essenciais como DTOs, erros e lógica comum.
- **Domain**:
  - `application`: Casos de uso, criptografia, repositórios e erros.
  - `enterprise`: Entidades e value objects do domínio.
- **Infra**:
  - `auth`: Mecanismos de autenticação.
  - `cryptography`: Módulos de hashing e tokenização.
  - `database`: Conexão com o banco de dados via Prisma.
  - `env`: Configuração de variáveis de ambiente.
  - `http`: Controladores e interações com a API.
  - `mailer`: Envio de emails usando Nodemailer.
  - `storage`: Upload de imagens com MinIO.
- **Tests**: Implementações in-memory para testes unitários.

---

## ⚙️ Instalação

```bash
$ npm install
```

## 🚀 Rodando a Aplicação

```bash
# Desenvolvimento
$ npm run start

# Modo Watch
$ npm run start:dev

# Produção
$ npm run start:prod
```

## 🧪 Testes

```bash
# Testes unitários
$ npm run test

# Modo Watch
$ npm run test:watch
```

## 📦 Migrations

```bash
$ npx prisma migrate dev
```

## 🔑 Variáveis de Ambiente

Crie um arquivo `.env` com as seguintes variáveis:

```ini
SERVICE=
PORT=
VERSION=

APP_URL_AUTOCARS=
NODE_MAILER_HOST=
NODE_MAILER_USER=
NODE_MAILER_PORT=
NODE_MAILER_PASSWORD=
NODE_MAILER_FROM=

DATABASE_URL=

MINIO_BUCKET_NAME=
MINIO_BUCKET_URL=
MINIO_ACCESS_KEY_ID=
MINIO_SECRET_ACCESS_KEY=

JWT_PRIVATE_KEY=
JWT_PUBLIC_KEY=
```


## ✉️ Envio de Emails

O envio de emails utiliza o [Nodemailer](https://nodemailer.com/) e requer um email próprio para funcionar (o serviço gratuito possui limitações).

### Funcionalidades disponíveis:
- Envio de token para recuperação de senha  
- Recuperação de senha com token válido  

⚠️ **Importante:** O **envio de token para recuperação de senha** e a **recuperação de senha com token válido** só podem ser executados pelo proprietário do serviço de email configurado no Nodemailer. Como o serviço gratuito exige um remetente próprio, essas funcionalidades funcionarão apenas para quem configurar corretamente as variáveis de ambiente (`.env`) com suas credenciais do Nodemailer.  


---

## 🖼️ Upload de Imagens

O upload de imagens é feito via MinIO, simulando o Amazon S3, permitindo armazenar e acessar imagens de anúncios de forma segura.

---

## 📬 Contato

- **Autor**: YuriLRodrigues
- **LinkedIn**: [Yuri Leite Rodrigues](https://www.linkedin.com/in/yuri-leite-rodrigues)

