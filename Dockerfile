# ====================================================================
# 24K Realtors — Multi-Stage Docker Build (Backend Spring Boot API)
# Railway deploys from ROOT of monorepo using this Dockerfile
# ====================================================================

# Stage 1: Maven Build
FROM maven:3.9.6-eclipse-temurin-21-alpine AS build
WORKDIR /app

# Copy ONLY backend pom.xml first (spring-boot-starter-parent is remote, no root pom needed)
COPY backend/pom.xml ./pom.xml

# Pre-warm Maven dependency cache (fail-safe)
RUN mvn dependency:go-offline -B 2>/dev/null || true

# Copy backend source code
COPY backend/src ./src

# Build the JAR (skip tests for fast deploy)
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

# Copy compiled JAR from build stage
COPY --from=build /app/target/*.jar app.jar

# Pre-create uploads directory with correct ownership
RUN mkdir -p /app/uploads && chown -R appuser:appgroup /app

USER appuser

# Expose Spring Boot default port
EXPOSE 8080

# Health check — allows 2 min startup before marking unhealthy
HEALTHCHECK --interval=30s --timeout=10s --start-period=120s --retries=3 \
  CMD wget -qO- http://localhost:${PORT:-8080}/actuator/health 2>/dev/null | grep -q '"status":"UP"' || exit 1

# Activate Railway profile (PostgreSQL config)
ENV SPRING_PROFILES_ACTIVE=railway

# JVM tuning for Railway container limits
ENTRYPOINT ["java", "-Xmx400m", "-Xms128m", "-XX:+UseContainerSupport", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
