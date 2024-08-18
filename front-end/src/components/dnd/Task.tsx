import { FC } from "react";
import { Button } from "@/components/ui/button";
import { CardType } from "./Card";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import instance from "@/configs/axios";
import { Loader2 } from "lucide-react";
import { useFormStore } from "@/store/form";
import { toast } from "sonner";
const Task: FC<CardType> = ({ id, title, content = "", createdAt, deadline }) => {
  const queryClient = useQueryClient();
  const { setOpen, setEditItem } = useFormStore();
  const deleteTask = useMutation({
    mutationFn: () => instance.delete(`/task/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks"]
      });
      toast.success("Task deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete task");
    }
  });
  return (
    <div id={id} className="space-y-4 bg-[#d6e7fe] border  rounded p-2  ">
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
        <Button
          className="px-4 py-1 h-auto"
          onClick={() => {
            setEditItem({ id, title, content, createdAt, deadline });
            setOpen(true);
          }}
        >
          <small>Edit</small>
        </Button>
      </div>
    </div>
  );
};

export default Task;
