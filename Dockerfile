# ====================================================================
# 24K Realtors — Multi-Stage Docker Build (Backend Spring Boot API)
# Railway deploys from ROOT of monorepo using this Dockerfile
# ====================================================================

# Stage 1: Build stage
FROM maven:3.9.6-eclipse-temurin-21-alpine AS build
WORKDIR /app

# Copy pom files and source
COPY pom.xml ./
COPY backend ./backend

# Package application
RUN mvn clean package -DskipTests -B

# Copy EXACT fat jar (ignoring .original) to /app/app.jar
RUN cp backend/target/twentyfourk-0.0.1-SNAPSHOT.jar /app/app.jar || cp target/twentyfourk-0.0.1-SNAPSHOT.jar /app/app.jar

# ====================================================================
# Stage 2: Runtime stage
# ====================================================================
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Install wget for Railway health check
RUN apk add --no-cache wget

# Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy single explicit JAR from build stage
COPY --from=build /app/app.jar /app/app.jar

# Pre-create uploads directory with correct ownership
RUN mkdir -p /app/uploads && chown -R appuser:appgroup /app

USER appuser

EXPOSE 8080

HEALTHCHECK --interval=20s --timeout=10s --start-period=180s --retries=5 \
  CMD wget -qO- http://localhost:${PORT:-8080}/actuator/health 2>/dev/null | grep -q '"status":"UP"' || exit 1

ENV SPRING_PROFILES_ACTIVE=railway

ENTRYPOINT ["java", "-Xmx400m", "-Xms128m", "-XX:+UseContainerSupport", "-Djava.security.egd=file:/dev/./urandom", "-jar", "/app/app.jar"]
