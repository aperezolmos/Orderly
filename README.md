# 🍽️ Restaurant Business Management Project

Web application for **comprehensive management of restaurant establishments**. Allows administrators to manage offered products, nutritional information, orders, and table reservations.

## 🚀 Deployment

### Prerequisites
1. Git _(for cloning the repository)_
2. Docker and Docker Compose

### Installation Steps
#### 1. Clone the repository

```bash
git clone https://github.com/aperezolmos/tfg-aperezolmos.git
cd tfg-aperezolmos
```

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
