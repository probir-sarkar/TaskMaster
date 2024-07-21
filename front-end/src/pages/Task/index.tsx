import {
  closestCorners,
  DndContext,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import Column from "@/components/dnd/Column";
import SearchBar from "./SearchBar";
import useTaskStore, { formatTasks } from "@/store/task";
import { useQuery } from "@tanstack/react-query";
import instance from "@/configs/axios";
import { useEffect } from "react";
import { apiTaskListSchema } from "@/lib/schema";

export default function App() {
  const { columns, handleDragEnd, handleDragOver, setColumns } = useTaskStore();
  const { data } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const { data } = await instance.get("/task");
      return data;
    },
    initialData: [],
  });
  useEffect(() => {
    const validatedData = apiTaskListSchema.safeParse(data.data);

    if (validatedData.data) {
      setColumns(formatTasks(validatedData.data));
    }
  }, [data]);

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
        <div className="flex flex-row p-5">
          {columns.map((column) => (
            <Column key={column.id} id={column.id} title={column.title} cards={column.cards}></Column>
          ))}
        </div>
      </DndContext>
    </main>
  );
}
