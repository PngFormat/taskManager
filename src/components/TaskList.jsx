import TaskItem from "./TaskItem";
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";

export default function TaskList({ tasks, onToggle, onDelete, onReorder, disabled }) {
    if (tasks.length === 0)
        return <p className="text-center text-gray-500">Задач поки немає 🙌</p>;

    function handleDragEnd(result) {
        if (!result.destination) return;

        const items = Array.from(tasks);
        const [movedTask] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, movedTask);
        console.log("New order:", items);
        onReorder(items);
    }

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="tasklist" isDropDisabled={false}>
                {(provided) => (
                    <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="space-y-2"
                    >
                        {tasks.map((task, index) => {
                            return (
                                <Draggable key={task.id} draggableId={String(task.id)} index={index}>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            className={`rounded p-1 transition ${snapshot.isDragging ? "bg-gray-200" : ""}`}
                                            style={provided.draggableProps.style}
                                        >
                                            <TaskItem
                                                task={task}
                                                onToggle={() => onToggle(task.id)}
                                                onDelete={() => onDelete(task.id)}
                                                disabled={disabled}
                                            />
                                        </div>
                                    )}
                                </Draggable>
                            );
                        })}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
}
