# =======================================================
# Stage 1: Build Stage (Compile and Package Spring Boot App)
# =======================================================
FROM maven:3.9.6-eclipse-temurin-21-alpine AS builder

WORKDIR /app

# Copy pom.xml and download dependencies (enables layer caching)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code and build executable JAR
COPY src ./src
RUN mvn package -DskipTests

# =======================================================
# Stage 2: Runtime Stage (Lightweight JRE execution)
# =======================================================
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Copy built jar file from builder stage
COPY --from=builder /app/target/todo-devops-1.0.0.jar app.jar

# Expose Spring Boot port
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
