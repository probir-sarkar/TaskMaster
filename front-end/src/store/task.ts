import { DragEndEvent, DragOverEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { create } from "zustand";
export type CardType = {
  id: string;
  title: string;
};
export type ColumnType = {
  id: string;
  title: string;
  cards: CardType[];
};

const data: ColumnType[] = [
  {
    id: "Column1",
    title: "TODO",
    cards: [
      {
        id: "Card1",
        title: "Card1",
      },
      {
        id: "Card2",
        title: "Card2",
      },
    ],
  },
  {
    id: "Column2",
    title: "IN PROGRESS",
    cards: [
      {
        id: "Card3",
        title: "Card3",
      },
      {
        id: "Card4",
        title: "Card4",
      },
    ],
  },
  {
    id: "Column3",
    title: "DONE",
    cards: [
      {
        id: "Card5",
        title: "Card5",
      },
      {
        id: "Card6",
        title: "Card6",
      },
    ],
  },
];

interface TaskState {
  columns: ColumnType[];
  handleDragOver: (event: DragOverEvent) => void;
  handleDragEnd: (event: DragEndEvent) => void;
  addTask: (title: string) => void;
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

export const useTaskStore = create<TaskState>((set, get) => ({
  columns: data,
  addTask: (title) => {
    set((prevState) => {
      const newTask = { id: randomId(), title };
      return {
        columns: prevState.columns.map((column) => {
          if (column.id === "Column1") {
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
      return null;
    }
    const activeIndex = activeColumn.cards.findIndex((i) => i.id === activeId);
    const overIndex = overColumn.cards.findIndex((i) => i.id === overId);
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

function randomId() {
  return Math.random().toString(36).substr(2, 9);
}
export default useTaskStore;
