# DevOps-Based To-Do List Application

A small college-level project that demonstrates a complete DevOps workflow:

```text
Developer -> GitHub -> GitHub Actions -> Maven build and tests
          -> Docker Compose -> Spring Boot + MySQL
          -> Prometheus -> Grafana
```

The application is intentionally simple. Users can add tasks, view tasks, mark
tasks as completed, and delete tasks. Tasks are stored in MySQL.

## Features

- Add a task
- View all tasks
- Mark a task as completed
- Delete a task

## Technology Stack

- Java 25 and Spring Boot 3.3
- Maven, Spring Web, Spring Data JPA
- MySQL 8
- HTML, CSS, and JavaScript Fetch API
- JUnit 5 and Mockito
- Git, GitHub, and GitHub Actions
- Docker, Docker Compose, Prometheus, and Grafana

## Project Structure

```text
src/main/java/com/rohan/todo/
  controller/       REST endpoints
  model/            Task JPA entity
  repository/       Spring Data repository
  service/          Task business logic
src/main/resources/static/
  index.html        web page
  style.css         page styles
  script.js         API calls and rendering
.github/workflows/ci.yml
docker-compose.yml
prometheus.yml
grafana/provisioning/
```

## Prerequisites

- JDK 25
- Maven 3.8 or newer
- Git
- Docker Desktop with Docker Compose
- A GitHub account for the CI workflow

## Run Locally With MySQL

Create a database and user in MySQL, then export the connection variables. The
application does not contain a real password.

```bash
export DB_HOST=localhost
export DB_PORT=3306
export DB_NAME=todo_db
export DB_USERNAME=todo_user
export DB_PASSWORD=your_password
mvn spring-boot:run
```

Open <http://localhost:8080>.

## Run the Complete Stack With Docker Compose

Copy the example environment file and change the example passwords:

```bash
cp .env.example .env
docker compose up --build -d
docker compose ps
```

Compose starts the Spring Boot application, MySQL, Prometheus, and Grafana.
MySQL is marked healthy before the application starts. Stop the stack with:

```bash
docker compose down
```

To stop it and remove the stored MySQL volume, use `docker compose down -v`.
This deletes local database data, so use it only when that is intended.

## URLs

| Service | URL |
| --- | --- |
| To-Do application | http://localhost:8080 |
| REST API | http://localhost:8080/api/tasks |
| Health check | http://localhost:8080/actuator/health |
| Prometheus metrics | http://localhost:8080/actuator/prometheus |
| Prometheus UI | http://localhost:9090 |
| Grafana | http://localhost:3000 |

Grafana is provisioned with the Prometheus data source and a dashboard named
`To-Do Application Overview`. The default local login is `admin` / `admin`.

## REST API

```text
GET    /api/tasks       list all tasks
POST   /api/tasks       create a task, for example {"title":"Learn Docker"}
PUT    /api/tasks/{id}  mark a task complete
DELETE /api/tasks/{id}  delete a task
```

## Tests and Packaging

Run the unit and controller tests without starting MySQL:

```bash
mvn clean test
```

Build the executable JAR:

```bash
mvn clean package
java -jar target/todo-devops-1.0.0.jar
```

Build and run only the application image:

```bash
docker build -t todo-app .
docker run --rm -p 8080:8080 \
  -e DB_HOST=host.docker.internal \
  -e DB_PORT=3306 \
  -e DB_NAME=todo_db \
  -e DB_USERNAME=todo_user \
  -e DB_PASSWORD=your_password \
  todo-app
```

## GitHub Actions

The workflow in `.github/workflows/ci.yml` runs on pushes and pull requests to
`main` or `master`. It checks out the code, installs Java 25, runs
`mvn clean test`, and packages the JAR. The job fails when a test or build
fails. It does not require Docker Hub credentials.

Example Git workflow:

```bash
git init
git add .
git commit -m "Initial project setup"
git branch -M main
git remote add origin <GITHUB_REPOSITORY_URL>
git push -u origin main
```

Useful follow-up commits include `Add REST APIs`, `Add frontend`, `Add unit
tests`, `Add Docker configuration`, `Add GitHub Actions CI`, and
`Add Prometheus monitoring`.

## Troubleshooting

- **MySQL connection failure:** confirm MySQL is healthy, then check `DB_*`
  values. With Compose, confirm `.env` exists and matches the `MYSQL_*` values.
- **Port already in use:** stop the process using 8080, 3306, 9090, or 3000,
  or change the host-side port in `docker-compose.yml`.
- **Docker is not running:** start Docker Desktop and retry the Compose command.
- **Maven build failure:** check that Java 25 is active with `java -version`,
  then retry `mvn clean test`.
- **Prometheus target is down:** open `/actuator/prometheus` in the browser and
  check `http://localhost:9090/targets`. Inside Compose the target is `app:8080`.

Never commit `.env`, passwords, API keys, `target/`, or IDE files. The included
`.gitignore` protects the common local files.
