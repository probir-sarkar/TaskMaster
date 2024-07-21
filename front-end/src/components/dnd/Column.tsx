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
      <div ref={setNodeRef} className="w-96 h-full  p-2 space-y-4">
        <p
          style={{
            padding: "5px 20px",
            textAlign: "left",
            fontWeight: "500",
            color: "#575757",
          }}
        >
          {title}
        </p>
        {cards.map((card) => (
          <Card key={card.id} id={card.id} title={card.title}></Card>
        ))}
      </div>
    </SortableContext>
  );
};

export default Column;
