import { FC } from "react";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { CardProps } from "./Card";
import Task from "./Task";

const DragItem: FC<CardProps> = ({ card }) => {
  const { id } = card;
  const { attributes, listeners, setNodeRef, transform } = useSortable({
    id: id
  });

  const style = {
    transform: CSS.Transform.toString(transform)
  };

  return (
    <div className="z-10" ref={setNodeRef} {...attributes} {...listeners} style={style}>
      <Task {...card}></Task>
    </div>
  );
};

export default DragItem;
