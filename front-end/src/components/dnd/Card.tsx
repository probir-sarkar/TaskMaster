import { FC } from "react";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import useTaskStore from "@/store/task";
import Task from "./Task";

export type CardType = {
  id: string;
  title: string;
  content?: string;
  createdAt: Date;
  deadline?: string;
};

export type CardProps = {
  card: CardType;
};

const Card: FC<CardProps> = ({ card }) => {
  const { id } = card;
  const { activeItem } = useTaskStore();
  const { attributes, listeners, setNodeRef, transform } = useSortable({
    id: id
  });

  const style = {
    transform: CSS.Transform.toString(transform)
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className={`${id == activeItem?.id ? "opacity-50" : ""}`}
    >
      <Task {...card}></Task>
    </div>
  );
};

export default Card;
