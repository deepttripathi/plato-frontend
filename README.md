# **Platform Automation Tool – Frontend**

## **Overview**
The *Platform Automation Tool Frontend* is a web-based interface designed to manage, visualize, and automate operational workflows across infrastructure and development environments.  
It provides a dashboard for configuration, status monitoring, and integration with backend APIs, supporting scalable automation within the organization’s CI/CD ecosystem.

---

## **Technology Stack**
- **Framework:** Next.js (TypeScript)
- **Styling:** Tailwind CSS, PostCSS, Shadcn/UI
- **Package Manager:** pnpm
- **Containerization:** Docker
- **CI/CD:** GitLab Pipeline (`.gitlab-ci.yml`)
- **Configuration:** Environment-driven via `.env` files

---

## **Prerequisites**
Ensure the following dependencies are installed before setup:

| Dependency | Version / Requirement |
|-------------|-----------------------|
| Node.js     | v22 or later |
| pnpm        | Latest stable release |
| Docker (optional) | For containerized builds and deployments |

---

## **Local Setup**

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd plato-frontend-develop
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Configure environment variables**
   - Copy the example environment file:
     ```bash
     cp .example.env .env
     ```
   - Update the `.env` file with the required configuration (API URLs, secrets, etc.).

4. **Run the development server**
   ```bash
   pnpm run dev
   ```
   - The application will be accessible at `http://localhost:3000`.

---

## **Building for Production**

To generate an optimized production build:
```bash
pnpm run build
```

To serve the production build locally:
```bash
pnpm run start
```

---

## **Docker Deployment**

To build and run the containerized frontend:
```bash
docker build -t plato-frontend .
docker run -p 3000:3000 --env-file .env plato-frontend
```

This image can be deployed to any container orchestration platform (e.g., Kubernetes, ECS, or internal infrastructure).

---

## **GitLab CI/CD Integration**

This project includes a `.gitlab-ci.yml` pipeline for automated builds and deployments:
- **Build Stage:** Installs dependencies and builds the Next.js application.
- **Test Stage (optional):** Runs linting or automated tests if configured.
- **Deploy Stage:** Publishes the Docker image or deploys to the specified environment.

Ensure CI/CD variables (such as registry credentials and environment secrets) are configured in GitLab.

---

## **Project Structure**
```
plato-frontend-develop/
│
├── app/                   # Next.js application pages and routes
├── components/            # Shared UI components
├── hooks/                 # Custom React hooks
├── lib/                   # Helper utilities and configurations
├── public/                # Static assets
├── styles/                # Global and component styles (Tailwind, CSS modules)
├── deployment/            # Deployment configuration and manifests
├── Dockerfile             # Container build definition
├── .gitlab-ci.yml         # CI/CD pipeline configuration
├── tsconfig.json          # TypeScript configuration
└── package.json           # Project metadata and scripts
```

---

## **Common Commands**

| Command | Description |
|----------|-------------|
| `pnpm run dev` | Start local development server |
| `pnpm run build` | Build production assets |
| `pnpm run start` | Serve built application |
| `pnpm run lint` | Run code linting |
| `pnpm run test` | Execute test suite (if defined) |

---
