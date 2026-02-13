# 🍽️ Orderly

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=aperezolmos_Orderly&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=aperezolmos_Orderly)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=aperezolmos_Orderly&metric=bugs)](https://sonarcloud.io/summary/new_code?id=aperezolmos_Orderly)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=aperezolmos_Orderly&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=aperezolmos_Orderly)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=aperezolmos_Orderly&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=aperezolmos_Orderly)
[![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=aperezolmos_Orderly&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=aperezolmos_Orderly)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=aperezolmos_Orderly&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=aperezolmos_Orderly)
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=aperezolmos_Orderly&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=aperezolmos_Orderly)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=aperezolmos_Orderly&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=aperezolmos_Orderly)
[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=aperezolmos_Orderly&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=aperezolmos_Orderly)

Orderly is the **all-in-one** digital hub for modern restaurants. Manage **products**, track **orders**, handle **reservations**, and ensure **nutritional transparency** — all through a unified platform designed for efficiency and team collaboration.

## 🚀 Deployment

### Prerequisites
1. Git _(for cloning the repository)_
2. Docker and Docker Compose

### Installation Steps
#### 1. Download the source code

🔸**Option A: Clone the repository _(recommended for developers)_**
```bash
git clone https://github.com/aperezolmos/Orderly.git
```

Navigate to the `app` folder.

```bash
cd Orderly/app
```

🔹**Option B: Download a stable release**

Download the **latest** source code (ZIP or tar.gz) from the [Releases page](https://github.com/aperezolmos/Orderly/releases), extract it, and navigate to the `app` folder.

#### 2. Configure environment variables
```bash
cp .env.example .env
```
Edit `.env` with your credentials (passwords, ports, users).

#### 3. Build and run containers with Docker
```bash
docker-compose up --build -d
```
#### 4. Access the application
Access the application through your browser at [http://localhost:5173](http://localhost:5173).
> 🔐 _Login with default user_: `admin` (_password_: `admin`)

* **Backend API:** [http://localhost:8080](http://localhost:8080)
* **Database:** `localhost:3307` (Access via SQL client)

## 🛠️ Technologies Used

<p align="left"> 
    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" title="React" alt="React" height="30"/> 
    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vitejs/vitejs-original.svg" title="Vite" alt="Vite" height="30"/> 
    <img src="https://mantine.dev/favicon.svg" title="Mantine UI" alt="Mantine UI" height="30"/>
    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" title="Java" alt="Java" height="30"/> 
    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg" title="Spring Boot" alt="Spring Boot" height="30"/> 
    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" title="MySQL" alt="MySQL" height="30"/> 
    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" title="Docker" alt="Docker" height="40"/> 
</p>
