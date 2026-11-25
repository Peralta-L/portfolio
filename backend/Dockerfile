# ---- Build ----------------------------------------------------------------
FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /app

# Resolve dependencies first so this layer is cached between code changes.
COPY pom.xml .
RUN mvn -B -ntp dependency:go-offline

COPY src ./src
# Tests run in CI (they need PostgreSQL binaries); skip them in the image build.
RUN mvn -B -ntp package -DskipTests \
    && java -Djarmode=tools -jar target/portfolio-api.jar extract --layers --launcher --destination target/extracted

# ---- Runtime --------------------------------------------------------------
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# Layered copy: dependencies change rarely, application code often.
COPY --from=build /app/target/extracted/dependencies/ ./
COPY --from=build /app/target/extracted/spring-boot-loader/ ./
COPY --from=build /app/target/extracted/snapshot-dependencies/ ./
COPY --from=build /app/target/extracted/application/ ./

# Render sets PORT; the app reads it (defaults to 8080).
EXPOSE 8080
ENV JAVA_TOOL_OPTIONS="-XX:MaxRAMPercentage=75 -XX:+ExitOnOutOfMemoryError"

ENTRYPOINT ["java", "org.springframework.boot.loader.launch.JarLauncher"]
