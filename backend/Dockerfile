# ====================================================================
# 24K Realtors — Standalone Backend Dockerfile
# ====================================================================

FROM maven:3.9.6-eclipse-temurin-21-alpine AS build
WORKDIR /app

COPY pom.xml ./
COPY src ./src

RUN mvn clean package -DskipTests -B

# Copy EXACT fat jar (ignoring .original) to /app/app.jar
RUN cp target/twentyfourk-0.0.1-SNAPSHOT.jar /app/app.jar

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

RUN apk add --no-cache wget

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=build /app/app.jar /app/app.jar

RUN mkdir -p /app/uploads && chown -R appuser:appgroup /app

USER appuser

EXPOSE 8080

HEALTHCHECK --interval=20s --timeout=10s --start-period=180s --retries=5 \
  CMD wget -qO- http://localhost:${PORT:-8080}/actuator/health 2>/dev/null | grep -q '"status":"UP"' || exit 1

ENV SPRING_PROFILES_ACTIVE=railway

ENTRYPOINT ["java", "-Xmx400m", "-Xms128m", "-XX:+UseContainerSupport", "-Djava.security.egd=file:/dev/./urandom", "-jar", "/app/app.jar"]
