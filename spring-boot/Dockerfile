FROM maven:3.9.6-eclipse-temurin-17 AS build

WORKDIR /spring-boot

COPY pom.xml ./
RUN mvn dependency:go-offline

COPY src ./src
RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jre-alpine
LABEL org.opencontainers.image.authors="Amanda Pérez Olmos"

WORKDIR /app

COPY --from=build /spring-boot/target/*.jar app.jar

ENTRYPOINT ["java", "-jar", "app.jar"]
