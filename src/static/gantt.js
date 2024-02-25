let tasks = [
    {
        id: 'Task 1',
        name: 'Buy hosting',
        start: '2022-01-22',
        end: '2022-01-23',
        progress: 100,
    },
    {
        id: 'Task 2',
        name: 'Draw wireframes',
        start: '2022-01-23',
        end: '2022-01-25',
        progress: 100,
    },
    {
        id: 'Task 3',
        name: 'Visual Design',
        start: '2022-01-25',
        end: '2022-01-27',
        progress: 20,
        dependencies: 'Task 2'
    },
    {
        id: 'Task 4',
        name: 'Build frontend',
        start: '2022-02-01',
        end: '2022-02-03',
        progress: 0,
        dependencies: 'Task 3'
    },
    {
        id: 'Task 5',
        name: 'Build backend',
        start: '2022-02-03',
        end: '2022-02-07',
        progress: 0,
    },
    {
        id: 'Task 6',
        name: 'Deploy Website',
        start: '2022-02-07',
        end: '2022-02-09',
        progress: 0,
        dependencies: 'Task 4, Task 5'
    },
]

let ganttChart = new Gantt("#gantt", tasks, {});

document.querySelector(".change-chart #day").addEventListener("click", () => {
    ganttChart.change_view_mode("Day");
});

document.querySelector(".change-chart #week").addEventListener("click", () => {
    ganttChart.change_view_mode("Week");
});

document.querySelector(".change-chart #month").addEventListener("click", () => {
    ganttChart.change_view_mode("Month");
});