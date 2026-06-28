# =======================================================
# Stage 1: Build the Spring Boot Application JAR
# =======================================================
FROM maven:3.9-eclipse-temurin-17-alpine AS build
WORKDIR /app

# Copy the pom.xml and cache dependencies to speed up subsequent builds
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code and build the package
COPY src ./src
RUN mvn clean package -DskipTests -B

# =======================================================
# Stage 2: Production JRE runtime container
# =======================================================
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy the compiled jar from the build stage
COPY --from=build /app/target/*.jar app.jar

# Expose backend service port
EXPOSE 8080

# Configure JVM flags and run the app
ENTRYPOINT ["java", "-XX:+UseG1GC", "-jar", "app.jar"]
