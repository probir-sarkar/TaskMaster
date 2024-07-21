import { FC } from "react";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import instance from "@/configs/axios";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import useTaskStore from "@/store/task";

export type CardType = {
  id: string;
  title: string;
  content?: string;
  createdAt: Date;
};

const Card: FC<CardType> = ({ id, title, content = "", createdAt }) => {
  const { activeId } = useTaskStore();
  const queryClient = useQueryClient();
  const { attributes, listeners, setNodeRef, transform } = useSortable({
    id: id
  });

  const style = {
    transform: CSS.Transform.toString(transform)
  };

  const deleteTask = useMutation({
    mutationFn: () => instance.delete(`/task/${id}`),
    onSuccess: () => {
      console.log("Task deleted");
      queryClient.invalidateQueries({
        queryKey: ["tasks"]
      });
    },
    onError: (error) => {
      console.log(error);
    }
  });

  return (
    <div ref={setNodeRef} {...attributes} {...listeners} style={style}>
      <div id={id} className={`space-y-4 bg-[#d6e7fe] border rounded p-2 ${id == activeId ? "opacity-50" : ""}`}>
        <p>{title}</p>
        <p>{content}</p>
        <p className="text-sm text-gray-600">
          Created At: <time dateTime={createdAt.toISOString()}>{createdAt.toLocaleString()}</time>
        </p>
        <div className="flex justify-end gap-2">
          <Button
            variant="destructive"
            className="px-4 py-1 h-auto"
            disabled={deleteTask.isPending}
            onClick={() => deleteTask.mutate()}
          >
            {deleteTask.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <small>Delete</small>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Card;
