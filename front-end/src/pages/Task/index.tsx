import {
  closestCorners,
  DndContext,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import Column from "@/components/dnd/Column";
import SearchBar from "./SearchBar";
import useTaskStore, { formatTasks } from "@/store/task";
import { useQuery } from "@tanstack/react-query";
import instance from "@/configs/axios";
import { useEffect } from "react";
import { apiTaskListSchema } from "@/lib/schema";
import Item, { Draggable } from "@/components/dnd/Item";

export default function App() {
  const { columns, handleDragEnd, handleDragOver, setColumns, activeId, handleDragStart } = useTaskStore();
  const { data } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const { data } = await instance.get("/task");
      return data;
    },
    initialData: []
  });
  useEffect(() => {
    const validatedData = apiTaskListSchema.safeParse(data.data);
    if (validatedData.data) {
      setColumns(formatTasks(validatedData.data));
    }
  }, [data]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5
      }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
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
        onDragStart={handleDragStart}
      >
        <div className="flex md:flex-row flex-col gap-4  ">
          {columns.map((column) => (
            <Column key={column.id} id={column.id} title={column.title} cards={column.cards}></Column>
          ))}
        </div>
        <DragOverlay>{activeId ? <Item id={activeId} title="Title" createdAt={new Date()} /> : null}</DragOverlay>
      </DndContext>
    </main>
  );
}
