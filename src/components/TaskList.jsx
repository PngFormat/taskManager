import TaskItem from "./TaskItem.tsx";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";


export default function TaskList({
                                     tasks,
                                     onToggle,
                                     onDelete,
                                     onReorder,
                                     disabled,
                                     focusedTaskId,
                                     onFocusSelect,
                                     onUpdateDeadline,
                                     viewMode
                                 }) {
    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const items = Array.from(tasks);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setTimeout(() => {
            onReorder(items);
        }, 0);
    };

    const getItemStyle = (style, isGrid) => {
        if (! style) return {};
        if (!isGrid) return style;

        const {top, left, position, ...rest } = style;
        return {
            ...rest,
            transform: style.transform,
        };
    };

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="tasklist" direction={viewMode === "grid" ? "horizontal" : "vertical"}>
                {(provided) => (
                    <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={
                            viewMode === "grid"
                                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                                : "space-y-2"
                        }


                    >

                        {tasks.map((task, index) => {
                            const isFocused = task._id === focusedTaskId;
                            const isDisabled = disabled && !isFocused

                            return (
                                <Draggable
                                    key={task._id}
                                    draggableId={String(task._id)}
                                    index={index}
                                    isDragDisabled={isDisabled}
                                >
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            className={`rounded p-1 transition ${
                                                snapshot.isDragging
                                                    ? "bg-gray-200"
                                                    : isFocused
                                                        ? "bg-yellow-100 border-2 border-yellow-500"
                                                        : ""
                                            } ${isDisabled ? "opacity-50 pointer-events-none" : ""}`}
                                            style={getItemStyle(provided.draggableProps.style, viewMode === "grid")}
                                        >
                                            <TaskItem
                                                task={task}
                                                onToggle={() => onToggle(task._id)}
                                                onDelete={() => onDelete(task._id)}
                                                onUpdateDeadline={onUpdateDeadline}
                                                disabled={disabled && task._id !== focusedTaskId}
                                                onFocusSelect={() => onFocusSelect(task._id)}
                                                isFocused={task._id === focusedTaskId}
                                            />
                                        </div>
                                    )}
                                </Draggable>
                            )
                        })}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
}