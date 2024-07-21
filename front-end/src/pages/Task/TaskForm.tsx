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
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import useTaskStore from "@/store/task";
import { useMutation } from "@tanstack/react-query";
import instance from "@/configs/axios";

const formSchema = z.object({
  title: z
    .string()
    .min(3, "Task name should be at least 3 characters long")
    .max(100, "Task name should not exceed 100 characters"),
  description: z.string().max(500, "Description should not exceed 500 characters").optional(),
});

type FormValues = z.infer<typeof formSchema>;

const TaskForm = () => {
  const { addTask } = useTaskStore();
  const [open, setOpen] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const addForm = useMutation({
    mutationFn: (data: FormValues) => instance.post("/task", data),
    onSuccess: (res) => {
      const { data } = res;
      console.log(data);
      addTask(data.data.id, data.data.title);
      form.reset();
      setOpen(false);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  function onSubmit(values: FormValues) {
    console.log(values);

    addForm.mutate(values);
  }
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>Add Task</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
            <DialogDescription>Fill in the form below to add a new task to your board.</DialogDescription>
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
                  name="description"
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
