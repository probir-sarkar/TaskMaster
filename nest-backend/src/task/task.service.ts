import { Injectable } from "@nestjs/common";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class TaskService {
  constructor(private readonly prisma: PrismaService) {}
  async create(userId: number, createTaskDto: CreateTaskDto) {
    const task = await this.prisma.$transaction(async (prisma) => {
      await prisma.task.updateMany({
        where: {
          userId: userId,
          status: "TODO",
          position: {
            gte: 0,
          },
        },
        data: {
          position: {
            increment: 1,
          },
        },
      });
      const newTask = await prisma.task.create({
        data: {
          ...createTaskDto,
          userId: userId,
        },
      });
      return newTask;
    });
    return { success: true, data: task };
  }

  async findAll(userId: number) {
    const tasks = await this.prisma.task.findMany({ where: { userId } });
    return { success: true, data: tasks };
  }

  findOne(id: number) {
    return `This action returns a #${id} task`;
  }

  update(id: number, updateTaskDto: UpdateTaskDto) {
    return `This action updates a #${id} task`;
  }

  remove(id: number) {
    return `This action removes a #${id} task`;
  }
}
