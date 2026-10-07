// ============================================================
// Employee Scheduling System
// Advanced Programming Languages - Week 7
// Assignment 4
// ============================================================

// ------------------------------------------------------------
// Constants
// ------------------------------------------------------------

const DAYS = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
];

const SHIFTS = [
    "Morning",
    "Afternoon",
    "Evening"
];

const MIN_EMPLOYEES_PER_SHIFT = 2;
const MAX_DAYS_PER_EMPLOYEE = 5;

// ------------------------------------------------------------
// Employee class
// ------------------------------------------------------------

class Employee {

    constructor(name, preferences) {
        this.name = name;
        this.preferences = preferences;
        this.daysWorked = 0;
    }
}

// ------------------------------------------------------------
// Employee data
// ------------------------------------------------------------

const employees = [

    new Employee("Alice", [
        "Morning",
        "Morning",
        "Afternoon",
        "Morning",
        "Evening",
        "Morning",
        "Afternoon"
    ]),

    new Employee("Bob", [
        "Afternoon",
        "Morning",
        "Evening",
        "Afternoon",
        "Morning",
        "Evening",
        "Morning"
    ]),

    new Employee("Charlie", [
        "Evening",
        "Afternoon",
        "Morning",
        "Evening",
        "Afternoon",
        "Morning",
        "Evening"
    ]),

    new Employee("David", [
        "Morning",
        "Evening",
        "Morning",
        "Afternoon",
        "Evening",
        "Afternoon",
        "Morning"
    ]),

    new Employee("Emma", [
        "Afternoon",
        "Morning",
        "Afternoon",
        "Evening",
        "Morning",
        "Evening",
        "Afternoon"
    ]),

    new Employee("Frank", [
        "Evening",
        "Evening",
        "Morning",
        "Morning",
        "Afternoon",
        "Morning",
        "Evening"
    ]),

    new Employee("Grace", [
        "Morning",
        "Afternoon",
        "Evening",
        "Morning",
        "Afternoon",
        "Evening",
        "Morning"
    ]),

    new Employee("Henry", [
        "Evening",
        "Morning",
        "Afternoon",
        "Evening",
        "Morning",
        "Afternoon",
        "Evening"
    ]),

    new Employee("Ivy", [
        "Afternoon",
        "Evening",
        "Morning",
        "Afternoon",
        "Evening",
        "Morning",
        "Afternoon"
    ]),

    new Employee("Jack", [
        "Morning",
        "Afternoon",
        "Evening",
        "Evening",
        "Morning",
        "Afternoon",
        "Morning"
    ])
];

// ------------------------------------------------------------
// Utility function for random selection
// ------------------------------------------------------------

function randomChoice(array) {

    if (array.length === 0) {
        return null;
    }

    const index = Math.floor(
        Math.random() * array.length
    );

    return array[index];
}

// ------------------------------------------------------------
// Find employee based on preferred shift
// ------------------------------------------------------------

function findBestEmployee(
    dayIndex,
    shift,
    assignedToday
) {

    let candidates = [];

    // Loop through all employees
    for (const employee of employees) {

        // Employee cannot work more than 5 days
        if (employee.daysWorked >= MAX_DAYS_PER_EMPLOYEE) {
            continue;
        }

        // Employee cannot work twice on the same day
        if (assignedToday.has(employee.name)) {
            continue;
        }

        // Check employee's preferred shift
        if (employee.preferences[dayIndex] === shift) {
            candidates.push(employee);
        }
    }

    if (candidates.length === 0) {
        return null;
    }

    // Find minimum number of days worked
    const minimumDays = Math.min(
        ...candidates.map(employee => employee.daysWorked)
    );

    // Keep employees with the lowest workload
    candidates = candidates.filter(
        employee => employee.daysWorked === minimumDays
    );

    // Randomly choose among equally qualified employees
    return randomChoice(candidates);
}

// ------------------------------------------------------------
// Find any available employee
// Used when there is a shift conflict.
// ------------------------------------------------------------

function findAvailableEmployee(assignedToday) {

    let candidates = [];

    for (const employee of employees) {

        // Maximum 5 days per week
        if (employee.daysWorked >= MAX_DAYS_PER_EMPLOYEE) {
            continue;
        }

        // Maximum one shift per day
        if (assignedToday.has(employee.name)) {
            continue;
        }

        candidates.push(employee);
    }

    if (candidates.length === 0) {
        return null;
    }

    // Sort according to workload
    candidates.sort(
        (a, b) => a.daysWorked - b.daysWorked
    );

    const minimumDays = candidates[0].daysWorked;

    const bestCandidates = candidates.filter(
        employee => employee.daysWorked === minimumDays
    );

    return randomChoice(bestCandidates);
}

// ------------------------------------------------------------
// Create schedule
// ------------------------------------------------------------

function createSchedule() {

    const schedule = {};

    // Loop through every day
    for (let dayIndex = 0; dayIndex < DAYS.length; dayIndex++) {

        const day = DAYS[dayIndex];

        schedule[day] = {
            Morning: [],
            Afternoon: [],
            Evening: []
        };

        // Track employees already working today
        const assignedToday = new Set();

        // ----------------------------------------------------
        // First pass:
        // Assign employees according to preferences.
        // ----------------------------------------------------

        for (const shift of SHIFTS) {

            while (
                schedule[day][shift].length <
                MIN_EMPLOYEES_PER_SHIFT
            ) {

                const employee = findBestEmployee(
                    dayIndex,
                    shift,
                    assignedToday
                );

                if (employee === null) {
                    break;
                }

                schedule[day][shift].push(
                    employee.name
                );

                assignedToday.add(employee.name);

                employee.daysWorked++;
            }
        }

        // ----------------------------------------------------
        // Second pass:
        // Resolve conflicts.
        //
        // If a preferred shift is full or no preferred
        // employee is available, select another employee.
        // ----------------------------------------------------

        for (const shift of SHIFTS) {

            while (
                schedule[day][shift].length <
                MIN_EMPLOYEES_PER_SHIFT
            ) {

                const employee =
                    findAvailableEmployee(assignedToday);

                if (employee === null) {

                    console.log(
                        `WARNING: Unable to fill ${shift} on ${day}`
                    );

                    break;
                }

                schedule[day][shift].push(
                    employee.name
                );

                assignedToday.add(employee.name);

                employee.daysWorked++;
            }
        }
    }

    return schedule;
}

// ------------------------------------------------------------
// Display schedule
// ------------------------------------------------------------

function printSchedule(schedule) {

    console.log("");
    console.log("==============================================");
    console.log("       EMPLOYEE WEEKLY SCHEDULE");
    console.log("==============================================");

    for (const day of DAYS) {

        console.log("");
        console.log(`----------- ${day} -----------`);

        for (const shift of SHIFTS) {

            const employeeList =
                schedule[day][shift];

            console.log(
                `${shift.padEnd(10)} : ${employeeList.join(", ")}`
            );
        }
    }

    console.log("");
    console.log("==============================================");
}

// ------------------------------------------------------------
// Display employee workload
// ------------------------------------------------------------

function printEmployeeWorkload() {

    console.log("");
    console.log("==============================================");
    console.log("          EMPLOYEE WORKLOAD");
    console.log("==============================================");

    for (const employee of employees) {

        console.log(
            `${employee.name.padEnd(10)} : ${employee.daysWorked} days`
        );
    }

    console.log("==============================================");
}

// ------------------------------------------------------------
// Validate schedule
// ------------------------------------------------------------

function validateSchedule(schedule) {

    console.log("");
    console.log("==============================================");
    console.log("          SCHEDULE VALIDATION");
    console.log("==============================================");

    let valid = true;

    // Check each day
    for (const day of DAYS) {

        // Check each shift
        for (const shift of SHIFTS) {

            const count =
                schedule[day][shift].length;

            if (count < MIN_EMPLOYEES_PER_SHIFT) {

                console.log(
                    `ERROR: ${day} ${shift} has only ${count} employees.`
                );

                valid = false;
            }
        }

        // Check duplicate employees on same day
        const employeesToday = [];

        for (const shift of SHIFTS) {

            for (const employee of schedule[day][shift]) {

                if (employeesToday.includes(employee)) {

                    console.log(
                        `ERROR: ${employee} is assigned twice on ${day}.`
                    );

                    valid = false;
                }

                employeesToday.push(employee);
            }
        }
    }

    // Check maximum 5 working days
    for (const employee of employees) {

        if (employee.daysWorked > MAX_DAYS_PER_EMPLOYEE) {

            console.log(
                `ERROR: ${employee.name} works ${employee.daysWorked} days.`
            );

            valid = false;
        }
    }

    if (valid) {
        console.log("Schedule validation successful!");
        console.log("All scheduling rules are satisfied.");
    }

    console.log("==============================================");

    return valid;
}

// ------------------------------------------------------------
// Main program
// ------------------------------------------------------------

console.log("");
console.log("==============================================");
console.log("       EMPLOYEE SCHEDULING SYSTEM");
console.log("==============================================");

const schedule = createSchedule();

printSchedule(schedule);

printEmployeeWorkload();

validateSchedule(schedule);