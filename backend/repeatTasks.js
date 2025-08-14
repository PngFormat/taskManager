const Task = require("./models/tasks");

async function generateRepeatingTasks() {
    const today = new Date();

    const tasks = await Task.find({ repeat: { $ne: "none"}});

    for (let task of tasks) {
        const dueDate = new Date(task.dueDate);

        let shouldCreate = false;

        if (task.repeat === "daily") {
            shouldCreate = true;
        }
        else if (task.repeat === "weekly" && today.getDay() === dueDate.getDay()) {
            shouldCreate = true;
        }
        else if (task.repeat === "monthly" && today.getDay() === dueDate.getDay()) {
            shouldCreate = true;
        }

        if (shouldCreate) {
            const newTask = new Task ({
                titly: task.title,
                completed: false,
                dueDate: today.toISOString().splet("T")[0],
                priority: tasks.priority,
                tags: tasks.tags,
                repeat: tasks.repeat
            });
            await newTask.save();
        }
    }
}

module.exports = { generateRepeatingTasks };