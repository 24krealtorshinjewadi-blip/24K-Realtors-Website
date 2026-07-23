# ====================================================================
# 24K Realtors — Multi-Stage Docker Build (Backend Spring Boot API)
# Railway deploys from ROOT of monorepo using this Dockerfile
# ====================================================================

# Stage 1: Maven Build
FROM maven:3.9.6-eclipse-temurin-21-alpine AS build
WORKDIR /app

# Copy root POM and backend project files
COPY pom.xml ./pom.xml
COPY backend ./backend

# Pre-warm dependencies (fail-safe)
RUN mvn dependency:go-offline -B 2>/dev/null || true

# Build the JAR across monorepo modules (skip tests for fast deploy)
RUN mvn clean package -DskipTests -B

# ====================================================================
# Stage 2: Minimal JRE runtime image
# ====================================================================
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Install wget for Railway health checks
RUN apk add --no-cache wget

# Security: run as non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy compiled JAR from backend module target directory
COPY --from=build /app/backend/target/*.jar app.jar

# Pre-create uploads directory with correct ownership
RUN mkdir -p /app/uploads && chown -R appuser:appgroup /app

USER appuser

# Expose Spring Boot default port
EXPOSE 8080

# Health check — allows 5 min startup window for database migration
HEALTHCHECK --interval=20s --timeout=10s --start-period=180s --retries=5 \
  CMD wget -qO- http://localhost:${PORT:-8080}/actuator/health 2>/dev/null | grep -q '"status":"UP"' || exit 1

# Activate Railway profile (PostgreSQL config)
ENV SPRING_PROFILES_ACTIVE=railway

# JVM tuning for Railway container limits
ENTRYPOINT ["java", "-Xmx400m", "-Xms128m", "-XX:+UseContainerSupport", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
