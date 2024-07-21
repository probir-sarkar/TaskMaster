import { FC } from "react";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
export type CardType = {
  id: string;
  title: string;
};

const Card: FC<CardType> = ({ id, title }) => {
  // useSortableに指定するidは一意になるよう設定する必要があります。s
  const { attributes, listeners, setNodeRef, transform } = useSortable({
    id: id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
  };

  return (
    // attributes、listenersはDOMイベントを検知するために利用します。
    // listenersを任意の領域に付与することで、ドラッグするためのハンドルを作ることもできます。
    <div
      className="bg-white border border-black rounded px-2 py-4"
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
    >
      <div id={id}>
        <p>{id}</p>
      </div>
    </div>
  );
};

export default Card;
