# ====================================================================
# 24K Realtors — Multi-Stage Docker Build (Backend Spring Boot API)
# ====================================================================
# Stage 1: Maven Build
FROM maven:3.9.6-eclipse-temurin-21-alpine AS build
WORKDIR /app

# Copy root pom.xml (required for parent POM resolution)
COPY pom.xml ./pom.xml

# Copy backend pom.xml to cache Maven dependencies separately
COPY backend/pom.xml ./backend/pom.xml
RUN mvn -f backend/pom.xml dependency:go-offline -B -q 2>/dev/null || true

# Copy full source and compile
COPY backend/src ./backend/src
RUN mvn -f backend/pom.xml clean package -DskipTests -B -q

# ====================================================================
# Stage 2: Minimal JRE runtime image
# ====================================================================
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Install wget for health checks
RUN apk add --no-cache wget

# Security: run as non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy compiled jar from build stage
COPY --from=build /app/backend/target/*.jar app.jar

# Pre-create uploads directory with correct ownership
RUN mkdir -p /app/uploads && chown -R appuser:appgroup /app

USER appuser

# Expose Spring Boot port
EXPOSE 8080

# Health check (start-period gives app 2 min to boot before marking unhealthy)
HEALTHCHECK --interval=30s --timeout=10s --start-period=120s --retries=3 \
  CMD wget -qO- http://localhost:${PORT:-8080}/actuator/health 2>/dev/null | grep -q '"status":"UP"' || exit 1

# Active railway profile for production Postgres config
ENV SPRING_PROFILES_ACTIVE=railway

ENTRYPOINT ["java", "-Xmx400m", "-Xms128m", "-XX:+UseContainerSupport", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
