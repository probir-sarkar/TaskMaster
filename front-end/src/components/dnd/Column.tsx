import { FC } from "react";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import Card, { CardType } from "./Card";

export type ColumnType = {
  id: string;
  title: string;
  cards: CardType[];
};

const Column: FC<ColumnType> = ({ id, title, cards }) => {
  const { setNodeRef } = useDroppable({ id: id });
  return (
    <SortableContext id={id} items={cards} strategy={rectSortingStrategy}>
      <div ref={setNodeRef} className="w-full border border-gray-400 shadow-md rounded-lg p-4 space-y-2">
        <p className="bg-[#559af9] p-2 text-white rounded-sm font-semibold">{title}</p>

        <div className="h-[25rem] overflow-y-auto space-y-2">
          {cards.map((card) => (
            <Card key={card.id} {...card}></Card>
          ))}
        </div>
      </div>
    </SortableContext>
  );
};

export default Column;
