import java.util.*;

public class EmployeeScheduler {

    // -----------------------------
    // Employee class
    // -----------------------------
    static class Employee {
        String name;
        String[] preferences;
        int daysWorked;

        Employee(String name, String[] preferences) {
            this.name = name;
            this.preferences = preferences;
            this.daysWorked = 0;
        }
    }

    // -----------------------------
    // Constants
    // -----------------------------
    static final String[] DAYS = {
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
    };

    static final String[] SHIFTS = {
        "Morning",
        "Afternoon",
        "Evening"
    };

    static final int MIN_EMPLOYEES_PER_SHIFT = 2;
    static final int MAX_DAYS_PER_EMPLOYEE = 5;

    static Random random = new Random();

    // -----------------------------
    // Main method
    // -----------------------------
    public static void main(String[] args) {

        // ---------------------------------------
        // Employee preferences
        // Each employee has one preferred shift
        // for each day of the week.
        // ---------------------------------------

        List<Employee> employees = new ArrayList<>();

        employees.add(new Employee("Alice",
                new String[]{
                    "Morning", "Morning", "Afternoon",
                    "Morning", "Evening", "Morning", "Afternoon"
                }));

        employees.add(new Employee("Bob",
                new String[]{
                    "Afternoon", "Morning", "Evening",
                    "Afternoon", "Morning", "Evening", "Morning"
                }));

        employees.add(new Employee("Charlie",
                new String[]{
                    "Evening", "Afternoon", "Morning",
                    "Evening", "Afternoon", "Morning", "Evening"
                }));

        employees.add(new Employee("David",
                new String[]{
                    "Morning", "Evening", "Morning",
                    "Afternoon", "Evening", "Afternoon", "Morning"
                }));

        employees.add(new Employee("Emma",
                new String[]{
                    "Afternoon", "Morning", "Afternoon",
                    "Evening", "Morning", "Evening", "Afternoon"
                }));

        employees.add(new Employee("Frank",
                new String[]{
                    "Evening", "Evening", "Morning",
                    "Morning", "Afternoon", "Morning", "Evening"
                }));

        employees.add(new Employee("Grace",
                new String[]{
                    "Morning", "Afternoon", "Evening",
                    "Morning", "Afternoon", "Evening", "Morning"
                }));

        employees.add(new Employee("Henry",
                new String[]{
                    "Evening", "Morning", "Afternoon",
                    "Evening", "Morning", "Afternoon", "Evening"
                }));

        employees.add(new Employee("Ivy",
                new String[]{
                    "Afternoon", "Evening", "Morning",
                    "Afternoon", "Evening", "Morning", "Afternoon"
                }));

        employees.add(new Employee("Jack",
                new String[]{
                    "Morning", "Afternoon", "Evening",
                    "Evening", "Morning", "Afternoon", "Morning"
                }));

        // ---------------------------------------
        // Create weekly schedule
        // ---------------------------------------

        Map<String, Map<String, List<String>>> schedule =
                createSchedule(employees);

        // ---------------------------------------
        // Display final schedule
        // ---------------------------------------

        printSchedule(schedule);

        // ---------------------------------------
        // Display employee workload
        // ---------------------------------------

        printEmployeeWorkload(employees);
    }

    // ============================================================
    // Create schedule
    // ============================================================

    static Map<String, Map<String, List<String>>> createSchedule(
            List<Employee> employees) {

        Map<String, Map<String, List<String>>> schedule =
                new LinkedHashMap<>();

        // Loop through all seven days
        for (int dayIndex = 0; dayIndex < DAYS.length; dayIndex++) {

            String day = DAYS[dayIndex];

            Map<String, List<String>> dailySchedule =
                    new LinkedHashMap<>();

            // Create empty lists for each shift
            for (String shift : SHIFTS) {
                dailySchedule.put(shift, new ArrayList<>());
            }

            // Keep track of employees already assigned today
            Set<String> assignedToday = new HashSet<>();

            // ------------------------------------------------
            // First pass:
            // Try to satisfy employee preferences.
            // ------------------------------------------------

            for (String shift : SHIFTS) {

                while (dailySchedule.get(shift).size()
                        < MIN_EMPLOYEES_PER_SHIFT) {

                    Employee employee = findBestEmployee(
                            employees,
                            dayIndex,
                            shift,
                            assignedToday
                    );

                    if (employee == null) {
                        break;
                    }

                    dailySchedule.get(shift).add(employee.name);
                    assignedToday.add(employee.name);
                    employee.daysWorked++;
                }
            }

            // ------------------------------------------------
            // Second pass:
            // Fill any remaining positions.
            // This handles conflicts and reassignment.
            // ------------------------------------------------

            for (String shift : SHIFTS) {

                while (dailySchedule.get(shift).size()
                        < MIN_EMPLOYEES_PER_SHIFT) {

                    Employee employee = findAvailableEmployee(
                            employees,
                            assignedToday
                    );

                    if (employee == null) {
                        System.out.println(
                                "WARNING: Unable to fill " +
                                shift + " on " + day
                        );
                        break;
                    }

                    dailySchedule.get(shift).add(employee.name);
                    assignedToday.add(employee.name);
                    employee.daysWorked++;
                }
            }

            schedule.put(day, dailySchedule);
        }

        return schedule;
    }

    // ============================================================
    // Find best employee based on preference
    // ============================================================

    static Employee findBestEmployee(
            List<Employee> employees,
            int dayIndex,
            String shift,
            Set<String> assignedToday) {

        List<Employee> candidates = new ArrayList<>();

        for (Employee employee : employees) {

            // Branching condition:
            // Employee cannot work more than 5 days.
            if (employee.daysWorked >= MAX_DAYS_PER_EMPLOYEE) {
                continue;
            }

            // Employee cannot work twice on the same day.
            if (assignedToday.contains(employee.name)) {
                continue;
            }

            // Check preferred shift.
            if (employee.preferences[dayIndex].equals(shift)) {
                candidates.add(employee);
            }
        }

        if (candidates.isEmpty()) {
            return null;
        }

        // Sort employees by number of days worked.
        candidates.sort(
                Comparator.comparingInt(e -> e.daysWorked)
        );

        // Randomly select among employees with equal workload.
        int lowestDays = candidates.get(0).daysWorked;

        List<Employee> bestCandidates = new ArrayList<>();

        for (Employee employee : candidates) {
            if (employee.daysWorked == lowestDays) {
                bestCandidates.add(employee);
            }
        }

        return bestCandidates.get(
                random.nextInt(bestCandidates.size())
        );
    }

    // ============================================================
    // Find employee for conflict resolution
    // ============================================================

    static Employee findAvailableEmployee(
            List<Employee> employees,
            Set<String> assignedToday) {

        List<Employee> candidates = new ArrayList<>();

        for (Employee employee : employees) {

            // Maximum 5 working days
            if (employee.daysWorked >= MAX_DAYS_PER_EMPLOYEE) {
                continue;
            }

            // Maximum one shift per day
            if (assignedToday.contains(employee.name)) {
                continue;
            }

            candidates.add(employee);
        }

        if (candidates.isEmpty()) {
            return null;
        }

        // Prefer employees who have worked fewer days.
        candidates.sort(
                Comparator.comparingInt(e -> e.daysWorked)
        );

        int lowestDays = candidates.get(0).daysWorked;

        List<Employee> bestCandidates = new ArrayList<>();

        for (Employee employee : candidates) {
            if (employee.daysWorked == lowestDays) {
                bestCandidates.add(employee);
            }
        }

        return bestCandidates.get(
                random.nextInt(bestCandidates.size())
        );
    }

    // ============================================================
    // Print weekly schedule
    // ============================================================

    static void printSchedule(
            Map<String, Map<String, List<String>>> schedule) {

        System.out.println();
        System.out.println("==============================================");
        System.out.println("       EMPLOYEE WEEKLY SCHEDULE");
        System.out.println("==============================================");

        for (String day : DAYS) {

            System.out.println();
            System.out.println("----------- " + day + " -----------");

            Map<String, List<String>> dailySchedule =
                    schedule.get(day);

            for (String shift : SHIFTS) {

                System.out.printf(
                        "%-10s : ",
                        shift
                );

                List<String> employees =
                        dailySchedule.get(shift);

                for (int i = 0; i < employees.size(); i++) {

                    System.out.print(employees.get(i));

                    if (i < employees.size() - 1) {
                        System.out.print(", ");
                    }
                }

                System.out.println();
            }
        }

        System.out.println();
        System.out.println("==============================================");
    }

    // ============================================================
    // Print employee workload
    // ============================================================

    static void printEmployeeWorkload(
            List<Employee> employees) {

        System.out.println();
        System.out.println("==============================================");
        System.out.println("          EMPLOYEE WORKLOAD");
        System.out.println("==============================================");

        for (Employee employee : employees) {

            System.out.printf(
                    "%-10s : %d days%n",
                    employee.name,
                    employee.daysWorked
            );
        }

        System.out.println("==============================================");
    }
}