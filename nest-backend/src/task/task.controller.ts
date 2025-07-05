import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from "@nestjs/common";
import { TaskService } from "./task.service";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { CookieAuthGuard, RequestWithUser } from "src/auth/auth.guard";

@Controller("task")
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @UseGuards(CookieAuthGuard)
  create(@Req() req: RequestWithUser, @Body() createTaskDto: CreateTaskDto) {
    return this.taskService.create(req.user.id, createTaskDto);
  }

  @Get()
  @UseGuards(CookieAuthGuard)
  findAll(@Req() req: RequestWithUser) {
    return this.taskService.findAll(req.user.id);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.taskService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.taskService.update(+id, updateTaskDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.taskService.remove(+id);
  }
}
