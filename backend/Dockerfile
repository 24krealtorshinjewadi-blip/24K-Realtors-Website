# ====================================================================
# 24K Realtors — Backend Spring Boot API Dockerfile (standalone /backend root)
# ====================================================================
# Stage 1: Maven Build
FROM maven:3.9.6-eclipse-temurin-21-alpine AS build
WORKDIR /app

# Copy pom.xml first for dependency caching
COPY pom.xml .
RUN mvn dependency:go-offline -B 2>/dev/null || true

# Copy source and compile
COPY src ./src
RUN mvn clean package -DskipTests -B

# ====================================================================
# Stage 2: Minimal JRE runtime
# ====================================================================
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Install wget for health checks
RUN apk add --no-cache wget

# Security: non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy compiled JAR
COPY --from=build /app/target/*.jar app.jar

# Uploads directory
RUN mkdir -p /app/uploads && chown -R appuser:appgroup /app

USER appuser

EXPOSE 8080

# Health check
HEALTHCHECK --interval=20s --timeout=10s --start-period=180s --retries=5 \
  CMD wget -qO- http://localhost:${PORT:-8080}/actuator/health 2>/dev/null | grep -q '"status":"UP"' || exit 1

# Railway profile for production Postgres
ENV SPRING_PROFILES_ACTIVE=railway

ENTRYPOINT ["java", "-Xmx400m", "-Xms128m", "-XX:+UseContainerSupport", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
