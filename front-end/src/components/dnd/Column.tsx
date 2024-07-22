import { FC } from "react";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import Card, { CardType } from "./Card";
import { ScrollArea } from "@/components/ui/scroll-area";

export type ColumnType = {
  id: string;
  title: string;
  cards: CardType[];
};

const Column: FC<ColumnType> = ({ id, title, cards }) => {
  const { setNodeRef } = useDroppable({ id: id });
  return (
    <SortableContext id={id} items={cards} strategy={rectSortingStrategy}>
      <div ref={setNodeRef} className="w-full border border-gray-400 shadow-md rounded-lg p-4 pr-1 space-y-2">
        <p className="bg-[#559af9] p-2 text-white rounded-sm font-semibold mr-3">{title}</p>

        <ScrollArea className="h-[25rem] space-y-2 pr-3">
          <div className="space-y-2 mb-4">
            {cards.map((card) => (
              <Card key={card.id} {...{ card }}></Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    </SortableContext>
  );
};

export default Column;
