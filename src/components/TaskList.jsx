import TaskItem from "./TaskItem";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";


export default function TaskList({ tasks, onToggle, onDelete, onReorder, disabled }) {
    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const items = Array.from(tasks);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setTimeout(() => {
            onReorder(items);
        }, 0);
    };

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="tasklist">
                {(provided) => (
                    <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="space-y-2"
                    >

                        {tasks.map((task, index) => (

                            <Draggable key={task.id} draggableId={String(task.id)} index={index}>

                                {(provided, snapshot) => (

                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        className={`rounded p-1 transition ${
                                            snapshot.isDragging ? "bg-gray-200" : ""
                                        }`}
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
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
}
