const Task = require("../models/tasks");

async function autoMoveUnfinishedTasks() {
    const today = new Date().toISOString().split("T")[0];
    const tasks = await Task.find();

    for (const task of tasks) {
        if (!task.completed && task.dueDate < today) {
            task.dueDate = today;
            await task.save();
        }
    }
    console.log("✅ Незавершённые задачи перенесены на сегодня");
}

module.exports = { autoMoveUnfinishedTasks };
