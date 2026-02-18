package com.optima.config;

import com.optima.entity.Project;
import com.optima.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Configuration
@RequiredArgsConstructor
public class AppConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("*")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*");
            }
        };
    }

    @Bean
    CommandLineRunner initDatabase(ProjectRepository repository) {
        return args -> {
            if (repository.count() < 10) {
                repository.deleteAll();
                LocalDateTime now = LocalDateTime.now();
                Random random = new Random();
                List<Project> demoData = new ArrayList<>();

                String[] pastTitles = {
                        "System Audit", "Logo Design", "Bug Bounty", "AWS Migration",
                        "UI Sprint", "Backend Patch", "SEO Overhaul", "Data Backup",
                        "Client Meeting", "Code Review", "Server Setup", "Email Fix",
                        "Beta Launch", "User Research", "Compliance Check", "API Docs",
                        "Asset Backup", "Network Tuning", "Security Patch", "CI/CD Setup"
                };

                for (int i = 0; i < 20; i++) {
                    demoData.add(Project.builder()
                            .title(pastTitles[i % pastTitles.length] + " #" + (i + 1))
                            .deadline(random.nextInt(10) + 1)
                            .expectedRevenue(new BigDecimal(2000 + random.nextInt(15000)))
                            .status(Project.ProjectStatus.COMPLETED)
                            .completedAt(now.minusDays(random.nextInt(30))
                                    .minusHours(random.nextInt(24)))
                            .build());
                }

                String[] pendingTitles = {
                        "E-Commerce Engine", "Mobile App v3", "AI Predictor", "Crypto Wallet",
                        "HR Portal", "Sales Dashboard", "IoT Hub", "Payment V2",
                        "Smart Contract", "Video Streamer", "Chat Bot", "Edge Cache",
                        "VR Sandbox", "ML Model Training", "Auth Service"
                };

                for (int i = 0; i < 15; i++) {
                    demoData.add(Project.builder()
                            .title(pendingTitles[i % pendingTitles.length])
                            .deadline(random.nextInt(25) + 2)
                            .expectedRevenue(new BigDecimal(5000 + random.nextInt(45000)))
                            .status(Project.ProjectStatus.PENDING)
                            .build());
                }

                repository.saveAll(demoData);
                System.out.println("Enhanced demo data seeded successfully.");
            }
        };
    }
}
