package com.optima.strategy;

import com.optima.entity.Project;
import org.springframework.stereotype.Component;
import java.util.*;

public interface SchedulingStrategy {
    Map<Integer, Project> schedule(List<Project> projects);

    String getName();
}

@Component("fcfs")
class FcfsSchedulingStrategy implements SchedulingStrategy {
    @Override
    public Map<Integer, Project> schedule(List<Project> projects) {
        List<Project> sorted = new ArrayList<>(projects);
        sorted.sort(Comparator.comparing(Project::getId));
        Map<Integer, Project> result = new LinkedHashMap<>();
        int day = 1;
        for (Project p : sorted) {
            if (p.getDeadline() >= day) {
                result.put(day, p);
                day++;
            }
            if (result.size() >= 5)
                break;
        }
        return result;
    }

    @Override
    public String getName() {
        return "FCFS (First Come First Served)";
    }
}

@Component("edf")
class EdfSchedulingStrategy implements SchedulingStrategy {
    @Override
    public Map<Integer, Project> schedule(List<Project> projects) {
        List<Project> sorted = new ArrayList<>(projects);
        sorted.sort(Comparator.comparing(Project::getDeadline));
        Map<Integer, Project> result = new LinkedHashMap<>();
        int day = 1;
        for (Project p : sorted) {
            if (p.getDeadline() >= day) {
                result.put(day, p);
                day++;
            }
            if (result.size() >= 5)
                break;
        }
        return result;
    }

    @Override
    public String getName() {
        return "EDF (Earliest Deadline First)";
    }
}

@Component("priority")
class MaxRevenueSchedulingStrategy implements SchedulingStrategy {
    @Override
    public Map<Integer, Project> schedule(List<Project> projects) {
        List<Project> sorted = new ArrayList<>(projects);
        sorted.sort(Comparator.comparing(Project::getExpectedRevenue).reversed());
        Map<Integer, Project> result = new LinkedHashMap<>();
        int day = 1;
        for (Project p : sorted) {
            if (p.getDeadline() >= day) {
                result.put(day, p);
                day++;
            }
            if (result.size() >= 5)
                break;
        }
        return result;
    }

    @Override
    public String getName() {
        return "Priority (Highest Revenue)";
    }
}

@Component("greedy")
class GreedySchedulingStrategy implements SchedulingStrategy {
    @Override
    public Map<Integer, Project> schedule(List<Project> projects) {
        if (projects.isEmpty())
            return new HashMap<>();
        List<Project> sorted = new ArrayList<>(projects);
        sorted.sort(Comparator.comparing(Project::getExpectedRevenue).reversed());
        Map<Integer, Project> result = new HashMap<>();
        Set<Integer> occupiedSlots = new HashSet<>();
        for (Project p : sorted) {
            for (int day = p.getDeadline(); day >= 1; day--) {
                if (!occupiedSlots.contains(day)) {
                    occupiedSlots.add(day);
                    result.put(day, p);
                    break;
                }
            }
            if (result.size() >= 5)
                break;
        }
        return result;
    }

    @Override
    public String getName() {
        return "Greedy (Revenue-Deadline)";
    }
}
