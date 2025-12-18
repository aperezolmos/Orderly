# 🍽️ Proyecto de Gestión de Negocios de Restauración

Aplicación web para **gestión integral de locales de restauración**. Permite administrar productos ofertados, información nutricional, comandas y reservas de mesas.

## 🚀 Despliegue

### Prerrequisitos
1. Git _(para clonar el repositorio)_
2. Docker y Docker Compose

### Pasos de instalación
#### 1. Clonar repositorio

```bash
git clone https://github.com/aperezolmos/tfg-aperezolmos.git
cd tfg-aperezolmos
```

#### 2. Configurar variables
```bash
cp .env.example .env
```
Edita `.env` con tus credenciales (contraseñas, puertos, usuarios).

#### 3. Construir contenedores y ejecutar con Docker
```bash
docker-compose up --build -d
```
#### 4. Acceder a la aplicación
Se accede a la aplicación desde el navegador a través de [http://localhost:5173](http://localhost:5173).

* **Backend API:** [http://localhost:8080](http://localhost:8080)
* **Base de datos:** `localhost:3307` (Acceso vía cliente SQL)

## 🛠️ Tecnologías utilizadas

<p align="left"> 
    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" title="React" alt="React" height="30"/> 
    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vitejs/vitejs-original.svg" title="Vite" alt="Vite" height="30"/> 
    <img src="https://mantine.dev/favicon.svg" title="Mantine UI" alt="Mantine UI" height="30"/>
    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" title="Java" alt="Java" height="30"/> 
    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg" title="Spring Boot" alt="Spring Boot" height="30"/> 
    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" title="MySQL" alt="MySQL" height="30"/> 
    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" title="Docker" alt="Docker" height="40"/> 
</p>
