# ---- Stage 1: Build ----
FROM eclipse-temurin:17-jdk-alpine AS builder

WORKDIR /app

# Copy maven wrapper and pom first (layer caching — faster rebuilds)
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Download dependencies separately (cached unless pom.xml changes)
RUN ./mvnw dependency:go-offline -B

# Copy source and build
COPY src src
RUN ./mvnw clean package -DskipTests -B

# ---- Stage 2: Run ----
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copy only the built jar from stage 1
COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-Xmx400m", "-jar", "app.jar"]