package com.optima.service;

import com.optima.dto.AppDtos.*;
import com.optima.entity.Project;
import com.optima.repository.ProjectRepository;
import com.optima.strategy.SchedulingStrategy;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SchedulingService {

        private final ProjectRepository projectRepository;
        private final Map<String, SchedulingStrategy> strategies;
        private String currentStrategy = "greedy";

        public List<ProjectDTO> getAllProjects() {
                return projectRepository.findAll().stream()
                                .map(this::convertToDTO)
                                .collect(Collectors.toList());
        }

        public ProjectDTO getProjectById(Long id) {
                return projectRepository.findById(id)
                                .map(this::convertToDTO)
                                .orElseThrow(() -> new RuntimeException("Project not found: " + id));
        }

        @Transactional
        public ProjectDTO createProject(ProjectDTO projectDTO) {
                Project project = Project.builder()
                                .title(projectDTO.title())
                                .deadline(projectDTO.deadline())
                                .expectedRevenue(projectDTO.expectedRevenue())
                                .status(Project.ProjectStatus.PENDING)
                                .build();
                return convertToDTO(projectRepository.save(project));
        }

        @Transactional
        public ProjectDTO updateProject(Long id, ProjectDTO projectDTO) {
                Project project = projectRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Project not found: " + id));
                project.setTitle(projectDTO.title());
                project.setDeadline(projectDTO.deadline());
                project.setExpectedRevenue(projectDTO.expectedRevenue());
                return convertToDTO(projectRepository.save(project));
        }

        @Transactional
        public void deleteProject(Long id) {
                projectRepository.deleteById(id);
        }

        public void setStrategy(String strategyName) {
                if (strategies.containsKey(strategyName)) {
                        this.currentStrategy = strategyName;
                }
        }

        public String getCurrentStrategyName() {
                return strategies.get(currentStrategy).getName();
        }

        public WeeklyScheduleResponseDTO generateWeeklySchedule() {
                List<Project> pendingProjects = projectRepository.findByStatus(Project.ProjectStatus.PENDING);
                SchedulingStrategy strategy = strategies.get(currentStrategy);
                Map<Integer, Project> schedule = strategy.schedule(pendingProjects);

                BigDecimal totalRevenue = schedule.values().stream()
                                .map(Project::getExpectedRevenue)
                                .reduce(BigDecimal.ZERO, BigDecimal::add);

                Map<Integer, ProjectDTO> scheduleDTO = schedule.entrySet().stream()
                                .collect(Collectors.toMap(
                                                Map.Entry::getKey,
                                                e -> convertToDTO(e.getValue())));

                return new WeeklyScheduleResponseDTO(scheduleDTO, totalRevenue, schedule.size());
        }

        @Transactional
        public void executeCurrentSchedule() {
                WeeklyScheduleResponseDTO schedule = generateWeeklySchedule();
                LocalDateTime now = LocalDateTime.now();
                schedule.schedule().values().forEach(p -> {
                        Project project = projectRepository.findById(p.id()).orElse(null);
                        if (project != null) {
                                project.setStatus(Project.ProjectStatus.COMPLETED);
                                project.setCompletedAt(now);
                                projectRepository.save(project);
                        }
                });
        }

        public DashboardDTO getDashboardStats() {
                LocalDateTime now = LocalDateTime.now();
                LocalDateTime weekStart = now.minusDays(7);
                LocalDateTime monthStart = now.minusDays(30);

                List<Project> weeklyProjects = projectRepository.findCompletedSince(weekStart);
                List<Project> monthlyProjects = projectRepository.findCompletedSince(monthStart);

                BigDecimal weeklyRev = weeklyProjects.stream()
                                .map(Project::getExpectedRevenue)
                                .reduce(BigDecimal.ZERO, BigDecimal::add);

                BigDecimal monthlyRev = monthlyProjects.stream()
                                .map(Project::getExpectedRevenue)
                                .reduce(BigDecimal.ZERO, BigDecimal::add);

                return new DashboardDTO(weeklyRev, monthlyRev, monthlyProjects.size(), weeklyProjects.size());
        }

        public List<Map<String, Object>> getAnalyticsData() {
                LocalDateTime now = LocalDateTime.now();
                LocalDateTime thirtyDaysAgo = now.minusDays(30);
                List<Project> projects = projectRepository.findCompletedSince(thirtyDaysAgo);

                Map<String, BigDecimal> dailyRevenue = projects.stream()
                                .collect(Collectors.groupingBy(
                                                p -> p.getCompletedAt().toLocalDate().toString(),
                                                Collectors.reducing(BigDecimal.ZERO, Project::getExpectedRevenue,
                                                                BigDecimal::add)));

                return dailyRevenue.entrySet().stream()
                                .sorted(Map.Entry.comparingByKey())
                                .map(e -> {
                                        Map<String, Object> map = new HashMap<>();
                                        map.put("date", e.getKey());
                                        map.put("revenue", e.getValue());
                                        return map;
                                })
                                .collect(Collectors.toList());
        }

        private ProjectDTO convertToDTO(Project project) {
                return new ProjectDTO(
                                project.getId(),
                                project.getTitle(),
                                project.getDeadline(),
                                project.getExpectedRevenue(),
                                project.getStatus().name());
        }
}
