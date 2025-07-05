import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from "@nestjs/common";
import { TaskService } from "./task.service";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { CookieAuthGuard, RequestWithUser } from "src/auth/auth.guard";
import { ChangePositionDto } from "./dto/change-dto";

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
  @UseGuards(CookieAuthGuard)
  update(@Param("id") id: string, @Req() req: RequestWithUser, @Body() updateTaskDto: UpdateTaskDto) {
    return this.taskService.update(id, req.user.id, updateTaskDto);
  }

  @Delete(":id")
  @UseGuards(CookieAuthGuard)
  remove(@Param("id") id: string, @Req() req: RequestWithUser) {
    return this.taskService.remove(id, req.user.id);
  }

  @Post("change-position")
  @UseGuards(CookieAuthGuard)
  changePosition(@Body() payload: ChangePositionDto, @Req() req: RequestWithUser) {
    return this.taskService.changePosition(req.user.id, payload);
  }
}
