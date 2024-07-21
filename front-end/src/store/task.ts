import { ApiTaskType } from "@/lib/schema";
import { DragEndEvent, DragOverEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { create } from "zustand";
import instance from "@/configs/axios";
export type CardType = {
  id: string;
  title: string;
};
export type ColumnType = {
  id: string;
  title: string;
  cards: CardType[];
};

interface TaskState {
  columns: ColumnType[];
  setColumns: (columns: ColumnType[]) => void;
  handleDragOver: (event: DragOverEvent) => void;
  handleDragEnd: (event: DragEndEvent) => void;
  addTask: (id: string, title: string) => void;
}
const findColumn = (columns: ColumnType[], unique: string | null) => {
  if (!unique) {
    return null;
  }
  if (columns.some((c) => c.id === unique)) {
    return columns.find((c) => c.id === unique) ?? null;
  }
  const id = String(unique);
  const itemWithColumnId = columns.flatMap((c) => {
    const columnId = c.id;
    return c.cards.map((i) => ({ itemId: i.id, columnId: columnId }));
  });
  const columnId = itemWithColumnId.find((i) => i.itemId === id)?.columnId;
  return columns.find((c) => c.id === columnId) ?? null;
};

export function formatTasks(tasks: ApiTaskType[]): ColumnType[] {
  const columns: ColumnType[] = [
    { id: "TODO", title: "TODO", cards: [] },
    { id: "IN_PROGRESS", title: "IN PROGRESS", cards: [] },
    { id: "DONE", title: "DONE", cards: [] },
  ];

  tasks.forEach((task) => {
    if (task.status === "TODO") {
      columns[0].cards.push({ id: task.id, title: task.title });
    } else if (task.status === "IN_PROGRESS") {
      columns[1].cards.push({ id: task.id, title: task.title });
    } else if (task.status === "DONE") {
      columns[2].cards.push({ id: task.id, title: task.title });
    }
  });
  // Sort the cards by position
  columns.forEach((column) => {
    column.cards.sort((a, b) => {
      const taskA = tasks.find((task) => task.id === a.id);
      const taskB = tasks.find((task) => task.id === b.id);
      return taskA!.position - taskB!.position;
    });
  });

  return columns;
}
const data: ColumnType[] = [
  {
    id: "TODO",
    title: "TODO",
    cards: [],
  },
  {
    id: "IN_PROGRESS",
    title: "IN PROGRESS",
    cards: [],
  },
  {
    id: "DONE",
    title: "DONE",
    cards: [],
  },
];

export const useTaskStore = create<TaskState>((set, get) => ({
  columns: data,
  setColumns: (columns) => set({ columns }),
  addTask: (id, title) => {
    set((prevState) => {
      const newTask = { id, title };
      return {
        columns: prevState.columns.map((column) => {
          if (column.id === "TODO") {
            column.cards.unshift(newTask);
          }
          return column;
        }),
      };
    });
  },
  handleDragOver: (event) => {
    const columns = get().columns;
    const { active, over, delta } = event;
    const activeId = String(active.id);
    const overId = over ? String(over.id) : null;
    const activeColumn = findColumn(columns, activeId);
    const overColumn = findColumn(columns, overId);
    if (!activeColumn || !overColumn || activeColumn === overColumn) {
      return null;
    }
    set((prevState) => {
      const activeItems = activeColumn.cards;
      const overItems = overColumn.cards;
      const activeIndex = activeItems.findIndex((i) => i.id === activeId);
      const overIndex = overItems.findIndex((i) => i.id === overId);
      const newIndex = () => {
        const putOnBelowLastItem = overIndex === overItems.length - 1 && delta.y > 0;
        const modifier = putOnBelowLastItem ? 1 : 0;
        return overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
      };
      return {
        columns: prevState.columns.map((c) => {
          if (c.id === activeColumn.id) {
            c.cards = activeItems.filter((i) => i.id !== activeId);
            return c;
          } else if (c.id === overColumn.id) {
            c.cards = [
              ...overItems.slice(0, newIndex()),
              activeItems[activeIndex],
              ...overItems.slice(newIndex(), overItems.length),
            ];
            return c;
          } else {
            return c;
          }
        }),
      };
    });
  },
  handleDragEnd: (event) => {
    const columns = get().columns;
    const { active, over } = event;
    const activeId = String(active.id);
    const overId = over ? String(over.id) : null;
    const activeColumn = findColumn(columns, activeId);
    const overColumn = findColumn(columns, overId);
    if (!activeColumn || !overColumn || activeColumn !== overColumn) {
      console.log("Invalid columns");

      return null;
    }
    const activeIndex = activeColumn.cards.findIndex((i) => i.id === activeId);
    const overIndex = overColumn.cards.findIndex((i) => i.id === overId);
    rearrageInDB(overColumn, overIndex, activeId);

    if (activeIndex !== overIndex) {
      set((prevState) => {
        return {
          columns: prevState.columns.map((column) => {
            if (column.id === activeColumn.id) {
              column.cards = arrayMove(overColumn.cards, activeIndex, overIndex);
              return column;
            } else {
              return column;
            }
          }),
        };
      });
    }
  },
}));

export default useTaskStore;

async function rearrageInDB(overColumn: ColumnType, overIndex: number, overId: string) {
  const payload = {
    id: overId,
    status: overColumn.id,
    index: overIndex,
  };
  await instance.post("/task/change-position", payload);
}
