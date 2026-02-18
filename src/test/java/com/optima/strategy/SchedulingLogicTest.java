package com.optima.strategy;

import com.optima.entity.Project;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class SchedulingLogicTest {

    private GreedySchedulingStrategy strategy;

    @BeforeEach
    void setUp() {
        strategy = new GreedySchedulingStrategy();
    }

    @Test
    void testGreedySchedulingMaximizesRevenue() {
        Project p1 = Project.builder().id(1L).title("P1").deadline(2).expectedRevenue(new BigDecimal("100")).build();
        Project p2 = Project.builder().id(2L).title("P2").deadline(1).expectedRevenue(new BigDecimal("50")).build();
        Project p3 = Project.builder().id(3L).title("P3").deadline(2).expectedRevenue(new BigDecimal("10")).build();

        List<Project> projects = Arrays.asList(p1, p2, p3);
        Map<Integer, Project> schedule = strategy.schedule(projects);

        assertEquals(2, schedule.size());
        assertEquals("P1", schedule.get(2).getTitle());
        assertEquals("P2", schedule.get(1).getTitle());
    }

    @Test
    void testProjectWithShortDeadlineAndHighRevenue() {
        Project p1 = Project.builder().id(1L).title("P1").deadline(1).expectedRevenue(new BigDecimal("500")).build();
        Project p2 = Project.builder().id(2L).title("P2").deadline(5).expectedRevenue(new BigDecimal("100")).build();

        List<Project> projects = Arrays.asList(p1, p2);
        Map<Integer, Project> schedule = strategy.schedule(projects);

        assertEquals(2, schedule.size());
        assertEquals("P1", schedule.get(1).getTitle());
        assertEquals("P2", schedule.get(5).getTitle());
    }
}
