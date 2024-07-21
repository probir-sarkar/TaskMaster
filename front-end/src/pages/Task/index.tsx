import { closestCorners, DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import Column, { ColumnType } from "@/components/dnd/Column";
import { useState } from "react";
import SearchBar from "./SearchBar";
import useTaskStore from "@/store/task";

export default function App() {
  const { columns, handleDragEnd, handleDragOver } = useTaskStore();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  return (
    <main className="max-w-7xl w-11/12 mx-auto ">
      <SearchBar />
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
      >
        <div className="App" style={{ display: "flex", flexDirection: "row", padding: "20px" }}>
          {columns.map((column) => (
            <Column key={column.id} id={column.id} title={column.title} cards={column.cards}></Column>
          ))}
        </div>
      </DndContext>
    </main>
  );
}
