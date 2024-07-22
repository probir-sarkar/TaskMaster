import {
  closestCorners,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import Column from "@/components/dnd/Column";
import SearchBar from "./SearchBar";
import useTaskStore, { formatTasks } from "@/store/task";
import { useQuery } from "@tanstack/react-query";
import instance from "@/configs/axios";
import { useEffect } from "react";
import { apiTaskListSchema } from "@/lib/schema";
import DragItem from "@/components/dnd/DragItem";

export default function App() {
  const { columns, handleDragEnd, handleDragOver, setColumns, activeItem, handleDragStart } = useTaskStore();
  const { data } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const { data } = await instance.get("/task");
      return data;
    },
    initialData: []
  });
  const validatedData = apiTaskListSchema.safeParse(data.data);
  useEffect(() => {
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
        <DragOverlay>{activeItem ? <DragItem card={activeItem} /> : null}</DragOverlay>
      </DndContext>
    </main>
  );
}
