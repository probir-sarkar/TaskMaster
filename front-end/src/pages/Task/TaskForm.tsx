import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import instance from "@/configs/axios";
import { useFormStore } from "@/store/form";
import { useEffect } from "react";
import { dateExtractor } from "@/lib/utils";

const formSchema = z.object({
  title: z
    .string()
    .min(3, "Task name should be at least 3 characters long")
    .max(100, "Task name should not exceed 100 characters"),
  content: z.string().max(500, "Description should not exceed 500 characters").optional(),
  deadline: z.string().date().optional()
});

type FormValues = z.infer<typeof formSchema>;

const TaskForm = () => {
  const queryClient = useQueryClient();
  const { open, setOpen, editItem } = useFormStore();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      deadline: ""
    }
  });

  useEffect(() => {
    if (editItem) {
      form.reset({ ...editItem });
    }
  }, [editItem]);

  const addForm = useMutation({
    mutationFn: (data: FormValues) => {
      if (editItem) {
        return instance.put(`/task/${editItem.id}`, data);
      }
      return instance.post("/task", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks"]
      });
      form.reset();
      setOpen(false);
    },
    onError: (error) => {
      console.log(error);
    }
  });

  function onSubmit(values: FormValues) {
    addForm.mutate(values);
  }
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <Button
          onClick={() => {
            setOpen(true);
            form.reset();
          }}
        >
          Add Task
        </Button>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editItem ? "Edit Task" : "Add Task"}</DialogTitle>
            <DialogDescription>Fill in the form below to add or edit a task to your board.</DialogDescription>
          </DialogHeader>
          <div className="">
            <Form {...form}>
              <form id="task-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Task Name <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="shadcn" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="deadline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Deadline</FormLabel>
                      <FormControl>
                        <Input type="date" min={new Date().toISOString().split("T")[0]} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </div>
          <DialogFooter>
            <Button type="submit" form="task-form">
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TaskForm;
