# DevOps-Based To-Do List Application with Automated CI/CD, Docker Deployment & Monitoring

A complete, beginner-friendly college DevOps mini-project showcasing an automated end-to-end software development lifecycle (SDLC) pipeline.

---

## 📌 Project Overview

This project demonstrates how a simple **Spring Boot REST API** and **Web Frontend** are integrated into a modern DevOps ecosystem. Rather than focusing on complex business logic, the project emphasizes automation, containerization, continuous integration, and real-time application monitoring.

### Core Features
1. **Add Task**: Create new To-Do items.
2. **View Tasks**: Display all tasks retrieved from MySQL database.
3. **Complete Task**: Toggle task completion status.
4. **Delete Task**: Remove tasks from database.

---

## 🛠️ Technology Stack

* **Backend**: Java 17, Spring Boot 3.3.x, Spring Web, Spring Data JPA
* **Frontend**: HTML5, CSS3, JavaScript (Fetch API)
* **Database**: MySQL 8.0 / H2 In-Memory (for testing)
* **Build Tool**: Apache Maven
* **Version Control**: Git & GitHub
* **CI/CD Pipeline**: GitHub Actions
* **Containerization**: Docker & Docker Compose
* **Monitoring & Metrics**: Spring Boot Actuator, Prometheus, Grafana

---

## 📐 Architecture & DevOps Workflow

```text
                  Developer
                      │ (git push)
                      ▼
                   GitHub
                      │ (webhook trigger)
                      ▼
               GitHub Actions CI
           ┌──────────┴──────────┐
           ▼                     ▼
     Build App (Maven)    Run Tests (JUnit 5)
```

```text
                           Docker Compose Stack
                                    │
           ┌────────────────────────┼────────────────────────┐
           ▼                        ▼                        ▼
    Spring Boot App           MySQL Database             Prometheus
  (http://localhost:8080)   (http://localhost:3306)    (http://localhost:9090)
           │                                                 │
           └─────────────────────────────────────────────────┼──────────┐
                                                             ▼          ▼
                                                          Grafana   Actuator
                                                   (http://localhost:3000)
```

---

## 🚀 Prerequisites

Ensure you have the following installed on your machine:
* **Java Development Kit (JDK 17 or 21)**
* **Apache Maven 3.8+**
* **Git**
* **Docker & Docker Compose** (or Docker Desktop)
* **MySQL Server** (if running locally without Docker)

---

## 🏃 Method 1: Running Locally (Without Docker)

### 1. Database Setup
Ensure MySQL is running on your machine with database name `todo_db` or allow Spring Boot to auto-create it:
```sql
CREATE DATABASE IF NOT EXISTS todo_db;
```

### 2. Configure Environment Variables
You can pass environment variables or use the default values configured in `application.properties`:
* `DB_HOST`: `localhost`
* `DB_PORT`: `3306`
* `DB_NAME`: `todo_db`
* `DB_USERNAME`: `root`
* `DB_PASSWORD`: `Rohan@1234`

### 3. Run Application
Run the Spring Boot application using Maven:
```bash
mvn spring-boot:run
```

Access the application in your browser:
👉 **http://localhost:8080**

---

## 🐳 Method 2: Running With Docker Compose (Recommended)

To launch the complete DevOps stack (Spring Boot + MySQL + Prometheus + Grafana) in containers with a single command:

```bash
docker compose up --build -d
```

### Check Running Containers
```bash
docker compose ps
```

### Stop All Services
```bash
docker compose down
```

---

## 📊 Monitoring & Service URLs

| Service / Endpoint | Description | URL |
| :--- | :--- | :--- |
| **Application UI** | To-Do Web Frontend | [http://localhost:8080](http://localhost:8080) |
| **REST API** | Task API Endpoint | [http://localhost:8080/api/tasks](http://localhost:8080/api/tasks) |
| **Actuator Health** | Application Health Check | [http://localhost:8080/actuator/health](http://localhost:8080/actuator/health) |
| **Prometheus Metrics**| Metrics Scrape Target | [http://localhost:8080/actuator/prometheus](http://localhost:8080/actuator/prometheus) |
| **Prometheus Web UI** | Metrics Monitoring Console | [http://localhost:9090](http://localhost:9090) |
| **Grafana Dashboard** | Visual Dashboard UI | [http://localhost:3000](http://localhost:3000) |

*Default Grafana Credentials: Username `admin` / Password `admin`*

---

## 🧪 Running Unit & Integration Tests

Execute all backend unit tests using Maven:
```bash
mvn test
```
*Note: Tests run using an in-memory H2 database, requiring no active MySQL server.*

---

## 🔄 GitHub Actions CI/CD Pipeline

The `.github/workflows/ci.yml` pipeline automatically triggers whenever changes are pushed to GitHub:

1. **Checkout Code**: Fetches source code from repository.
2. **Setup JDK 17**: Configures Java environment.
3. **Build & Test**: Runs `mvn clean test` to ensure zero regressions.
4. **Package JAR**: Builds the production JAR executable.

### Git Push Instructions
To push this codebase to your GitHub repository:

```bash
git init
git add .
git commit -m "Initial commit: DevOps To-Do List Application with Docker, CI/CD and Monitoring"
git branch -M main
git remote add origin https://github.com/rohanshelar991/devop.git
git push -u origin main
```

---

## ❓ Troubleshooting & FAQs

### 1. MySQL Connection Failed
* **Symptom**: `Communications link failure` or `Access denied for user`
* **Fix**: Verify MySQL server is running. Check username and password in `application.properties` or environment variables (`DB_USERNAME` and `DB_PASSWORD`).

### 2. Port Already in Use (8080, 3306, 9090, 3000)
* **Symptom**: `Port 8080 is already in use`
* **Fix**: Stop any existing process occupying the port or change port mappings in `docker-compose.yml`.

### 3. Prometheus Cannot Scrape Spring Boot
* **Symptom**: Target state is `DOWN` in Prometheus UI (`http://localhost:9090/targets`)
* **Fix**: Ensure Spring Boot application is healthy at `http://localhost:8080/actuator/prometheus`. In Docker Compose, ensure the host name `app` matches the service name.
