package com.example.digimart;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.core.env.MapPropertySource;

import java.util.HashMap;
import java.util.Map;

@SpringBootApplication
public class DigimartApplication {

    public static void main(String[] args) {
        // Load variables from .env
        Dotenv dotenv = Dotenv.configure()
                .directory("./")         // look inside current directory
                .ignoreIfMissing()       // avoid crash if not found
                .load();

        // Set each env var as system property for Spring to resolve
        dotenv.entries().forEach(entry -> System.setProperty(entry.getKey(), entry.getValue()));

        // Prepare Spring Boot app
        SpringApplication app = new SpringApplication(DigimartApplication.class);

        // Optionally also inject into Spring context directly (redundant but okay)
        app.addInitializers(ctx -> {
            Map<String, Object> envVars = new HashMap<>();
            dotenv.entries().forEach(entry -> envVars.put(entry.getKey(), entry.getValue()));
            ctx.getEnvironment().getPropertySources().addFirst(new MapPropertySource("dotenv", envVars));
        });



        // Run app
        app.run(args);
    }
}
