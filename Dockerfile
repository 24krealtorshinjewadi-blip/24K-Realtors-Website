# ====================================================================
# 24K Realtors — Bulletproof Docker Build (Spring Boot API)
# Works seamlessly whether Railway root context is '/' or '/backend'
# ====================================================================

# Stage 1: Build stage
FROM maven:3.9.6-eclipse-temurin-21-alpine AS build
WORKDIR /app

# Copy all project files into container
COPY . .

# Run Maven build (handles root monorepo pom or backend pom)
RUN if [ -f "backend/pom.xml" ]; then \
      cd backend && mvn clean package -DskipTests -B; \
    else \
      mvn clean package -DskipTests -B; \
    fi

# Locate compiled JAR and place it at fixed path /app/app.jar
RUN find /app -name "*.jar" -path "*/target/*" ! -name "*javadoc*" ! -name "*sources*" -exec cp {} /app/app.jar \;

# ====================================================================
# Stage 2: Runtime stage
# ====================================================================
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Install wget for Railway health check endpoint
RUN apk add --no-cache wget

# Create non-root appuser
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy compiled app.jar from build stage
COPY --from=build /app/app.jar /app/app.jar

# Pre-create uploads directory
RUN mkdir -p /app/uploads && chown -R appuser:appgroup /app

USER appuser

EXPOSE 8080

# Health check
HEALTHCHECK --interval=15s --timeout=10s --start-period=180s --retries=5 \
  CMD wget -qO- http://localhost:${PORT:-8080}/actuator/health 2>/dev/null | grep -q '"status":"UP"' || exit 1

# Activate Railway profile
ENV SPRING_PROFILES_ACTIVE=railway

ENTRYPOINT ["java", "-Xmx400m", "-Xms128m", "-XX:+UseContainerSupport", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
