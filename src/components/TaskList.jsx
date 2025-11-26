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
    const active = tasks
        .map((t, i) => ({ ...t, __idx: i }))
        .filter(t => !t.completed);

    const completed = tasks
        .map((t, i) => ({ ...t, __idx: i }))
        .filter(t => t.completed);

    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const { source, destination } = result;

        const reorder = (list, from, to) => {
            const copy = Array.from(list);
            const [moved] = copy.splice(from, 1);
            copy.splice(to, 0, moved);
            return copy;
        };


        if (source.droppableId === "active" && destination.droppableId === "active") {
            const newActive = reorder(active, source.index, destination.index);
            const newTasks = [...tasks];

            const newOrdered = [
                ...newActive.map(i => tasks[i.__idx]),
                ...completed.map(i => tasks[i.__idx])
            ];
            onReorder(newOrdered);
            return;
        }

        if (source.droppableId === "completed" && destination.droppableId === "completed") {
            const newCompleted = reorder(completed, source.index, destination.index);
            const newOrdered = [
                ...active.map(i => tasks[i.__idx]),
                ...newCompleted.map(i => tasks[i.__idx])
            ];
            onReorder(newOrdered);
            return;
        }


        if (source.droppableId !== destination.droppableId) {
            let sourceList = source.droppableId === "active" ? active : completed;
            let destList = destination.droppableId === "active" ? active : completed;

            const movedItem = sourceList[source.index];
            if (!movedItem) return;

            const newSource = Array.from(sourceList);
            newSource.splice(source.index, 1);

            const newDest = Array.from(destList);

            const toggled = { ...movedItem };
            toggled.completed = destination.droppableId === "completed";

            newDest.splice(destination.index, 0, toggled);

            let newActiveOrder, newCompletedOrder;

            if (source.droppableId === "active" && destination.droppableId === "completed") {
                newActiveOrder = newSource.map(i => tasks[i.__idx]);
                const before = completed.slice(0, destination.index).map(i => tasks[i.__idx]);
                const after = completed.slice(destination.index).map(i => tasks[i.__idx]);
                const toggledTaskObj = { ...tasks[movedItem.__idx], completed: true };
                newCompletedOrder = [...before, toggledTaskObj, ...after];
            } else {
                const before = active.slice(0, destination.index).map(i => tasks[i.__idx]);
                const after = active.slice(destination.index).map(i => tasks[i.__idx]);
                const toggledTaskObj = { ...tasks[movedItem.__idx], completed: false };
                newActiveOrder = [...before, toggledTaskObj, ...after];
                newCompletedOrder = newSource.map(i => tasks[i.__idx]);
            }

            const newOrdered = [...newActiveOrder, ...newCompletedOrder];
            onReorder(newOrdered);
            return;
        }
    };

    const getItemStyle = (style, isGrid) => {
        if (!style) return {};
        if (!isGrid) return style;
        const { top, left, position, ...rest } = style;
        return {
            ...rest,
            transform: style.transform,
        };
    };

    const renderList = (listArray, droppableId) => {
        return (
            <Droppable droppableId={droppableId} direction={viewMode === "grid" ? "horizontal" : "vertical"}>
                {(provided) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={droppableId === "active" ? "space-y-2" : "space-y-2"}
                    >
                        {listArray.map((item, index) => {
                            const taskObj = tasks[item.__idx] || item; // safety
                            const isFocused = taskObj._id === focusedTaskId;
                            const isDisabled = disabled && !isFocused;
                            return (
                                <Draggable key={taskObj._id} draggableId={String(taskObj._id)} index={index} isDragDisabled={isDisabled}>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            className={`rounded p-1 transition ${snapshot.isDragging ? "bg-gray-200" : isFocused ? "bg-yellow-100 border-2 border-yellow-500" : ""} ${isDisabled ? "opacity-50 pointer-events-none" : ""}`}
                                            style={getItemStyle(provided.draggableProps.style, viewMode === "grid")}
                                        >
                                            <TaskItem
                                                task={taskObj}
                                                onToggle={() => onToggle(taskObj._id)}
                                                onDelete={() => onDelete(taskObj._id)}
                                                onUpdateDeadline={onUpdateDeadline}
                                                disabled={disabled && taskObj._id !== focusedTaskId}
                                                onFocusSelect={() => onFocusSelect(taskObj._id)}
                                                isFocused={isFocused}
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
        );
    };

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <div className={viewMode === "grid" ? "grid grid-cols-1 gap-6 lg:grid-cols-2" : "space-y-6"}>
                <div>
                    <h4 className="text-sm font-semibold mb-2">Активні</h4>
                    <div className="p-2 bg-transparent rounded">{renderList(active, "active")}</div>
                </div>

                <div>
                    <h4 className="text-sm font-semibold mb-2">Виконані</h4>
                    <div className="p-2 bg-transparent rounded">{renderList(completed, "completed")}</div>
                </div>
            </div>
        </DragDropContext>
    );
}
