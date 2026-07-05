# ====================================================================
# 24K Realtors — Multi-Stage Docker Build (Backend Spring Boot API)
# ====================================================================
# Stage 1: Maven Build
FROM maven:3.9.6-eclipse-temurin-21-alpine AS build
WORKDIR /app

# Cache Maven dependencies layer separately (invalidated only when pom changes)
COPY backend/pom.xml ./backend/pom.xml
RUN mvn -f backend/pom.xml dependency:go-offline -B --quiet 2>/dev/null || true

# Copy full source code and compile
COPY backend/src ./backend/src
RUN mvn -f backend/pom.xml clean package -DskipTests -B -q

# ====================================================================
# Stage 2: Minimal JRE runtime image
# ====================================================================
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Security: run as non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy compiled jar from build stage
COPY --from=build /app/backend/target/*.jar app.jar

# Pre-create uploads directory and change ownership to non-root user
RUN mkdir -p /app/uploads && chown -R appuser:appgroup /app

USER appuser

# Expose Spring Boot port
EXPOSE 8080

# Health check for Railway container orchestration
HEALTHCHECK --interval=30s --timeout=10s --start-period=90s --retries=3 \
  CMD wget -qO- http://localhost:8080/actuator/health 2>/dev/null | grep -q '"UP"' || exit 1

# Production profile via Railway environment
ENV SPRING_PROFILES_ACTIVE=railway

ENTRYPOINT ["java", "-Xmx400m", "-Xms128m", "-XX:+UseContainerSupport", "-jar", "app.jar"]
