export function autoMoveUnfinishedTasks( tasks ) {
    const today = new Date().toISOString().split("T")[0];
    return tasks.map( task => {
        if (!task.completed && task.dueDate < today) {
            return {...task, dueDate: today};
        }
        return task;
    });
}