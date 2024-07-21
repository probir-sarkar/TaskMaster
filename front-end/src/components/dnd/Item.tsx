import { FC } from "react";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { Button } from "@/components/ui/button";

export type CardType = {
  id: string;
  title: string;
  content?: string;
  createdAt: Date;
};

const Item: FC<CardType> = ({ id, title, content = "", createdAt }) => {
  const { attributes, listeners, setNodeRef, transform } = useSortable({
    id: id
  });

  const style = {
    transform: CSS.Transform.toString(transform)
  };

  return (
    <div className="z-10" ref={setNodeRef} {...attributes} {...listeners} style={style}>
      <div id={id} className="space-y-4 bg-[#d6e7fe] border  rounded p-2  ">
        <p>{title}</p>
        <p>{content}</p>
        <p className="text-sm text-gray-600">
          Created At: <time dateTime={createdAt.toISOString()}>{createdAt.toLocaleString()}</time>
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="destructive" className="px-4 py-1 h-auto">
            <small>Delete</small>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Item;
