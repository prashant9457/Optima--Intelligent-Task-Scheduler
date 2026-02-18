package com.optima.controller;

import com.optima.dto.AppDtos.*;
import com.optima.service.SchedulingService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Tag(name = "Task Scheduler API", description = "Endpoints for managing projects and schedules")
public class ApiController {

    private final SchedulingService schedulingService;

    // Project Endpoints
    @GetMapping("/projects")
    public List<ProjectDTO> getAllProjects() {
        return schedulingService.getAllProjects();
    }

    @GetMapping("/projects/{id}")
    public ProjectDTO getProjectById(@PathVariable Long id) {
        return schedulingService.getProjectById(id);
    }

    @PostMapping("/projects")
    @ResponseStatus(HttpStatus.CREATED)
    public ProjectDTO createProject(@Valid @RequestBody ProjectDTO projectDTO) {
        return schedulingService.createProject(projectDTO);
    }

    @PutMapping("/projects/{id}")
    public ProjectDTO updateProject(@PathVariable Long id, @Valid @RequestBody ProjectDTO projectDTO) {
        return schedulingService.updateProject(id, projectDTO);
    }

    @DeleteMapping("/projects/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteProject(@PathVariable Long id) {
        schedulingService.deleteProject(id);
    }

    // Schedule Endpoints
    @PostMapping("/schedule/generate")
    public WeeklyScheduleResponseDTO generateSchedule() {
        return schedulingService.generateWeeklySchedule();
    }

    @GetMapping("/schedule/current")
    public WeeklyScheduleResponseDTO getCurrentSchedule() {
        return schedulingService.generateWeeklySchedule();
    }

    @PostMapping("/schedule/strategy")
    public Map<String, String> setStrategy(@RequestParam String type) {
        schedulingService.setStrategy(type);
        return Map.of("currentStrategy", schedulingService.getCurrentStrategyName());
    }

    @GetMapping("/schedule/strategy")
    public Map<String, String> getStrategy() {
        return Map.of("currentStrategy", schedulingService.getCurrentStrategyName());
    }

    @GetMapping("/schedule/stats")
    public DashboardDTO getStats() {
        return schedulingService.getDashboardStats();
    }

    @GetMapping("/schedule/analytics")
    public List<Map<String, Object>> getAnalytics() {
        return schedulingService.getAnalyticsData();
    }

    @PostMapping("/schedule/execute")
    public void executeSchedule() {
        schedulingService.executeCurrentSchedule();
    }
}
