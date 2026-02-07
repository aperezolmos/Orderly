FROM maven:3.9.11-eclipse-temurin-21 AS build

WORKDIR /spring-boot

COPY pom.xml ./
RUN mvn dependency:go-offline

COPY src ./src
RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

COPY --from=build /spring-boot/target/*.jar app.jar

ENTRYPOINT ["java", "-jar", "app.jar"]
