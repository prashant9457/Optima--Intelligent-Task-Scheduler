package com.optima.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.util.Map;

public class AppDtos {
        public record ProjectDTO(
                        Long id,
                        @NotBlank(message = "Title is required") String title,
                        @NotNull(message = "Deadline is required") @Min(1) @Max(365) Integer deadline,
                        @NotNull(message = "Expected revenue is required") @Positive BigDecimal expectedRevenue,
                        String status) {
        }

        public record DashboardDTO(
                        BigDecimal weeklyRevenue,
                        BigDecimal monthlyRevenue,
                        long projectsCompletedThisMonth,
                        long projectsCompletedThisWeek) {
        }

        public record WeeklyScheduleResponseDTO(
                        Map<Integer, ProjectDTO> schedule,
                        BigDecimal totalRevenue,
                        int projectsScheduled) {
        }
}
