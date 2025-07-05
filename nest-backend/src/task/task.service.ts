import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { ChangePositionDto } from "./dto/change-dto";

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

  async update(id: string, userId: number, updateTaskDto: UpdateTaskDto) {
    const result = await this.prisma.task.update({
      where: {
        id: id,
        userId: userId,
      },
      data: updateTaskDto,
    });
    return { success: true, data: result };
  }

  async remove(id: string, userId: number) {
    const task = await this.prisma.task.findUnique({
      where: {
        id,
      },
    });
    if (!task) {
      return { success: false, message: "Task not found" };
    }
    await this.prisma.$transaction(async (prisma) => {
      await prisma.task.updateMany({
        where: {
          userId,
          status: task.status,
          position: {
            gt: task.position,
          },
        },
        data: {
          position: {
            decrement: 1,
          },
        },
      });
      await prisma.task.delete({
        where: {
          id,
        },
      });
    });
    return { success: true };
  }
  async changePosition(userId: number, { id, status, index }: ChangePositionDto) {
    const task = await this.prisma.task.findUnique({
      where: {
        id,
      },
    });
    if (!task) {
      throw new HttpException("Task not found", HttpStatus.NOT_FOUND);
    }
    if (task.userId !== userId) {
      throw new HttpException("Forbidden", HttpStatus.FORBIDDEN);
    }
    const oldIndex = task.position;
    await this.prisma.$transaction(async (prisma) => {
      if (task.status !== status) {
        // Decrement positions in the old status group
        await prisma.task.updateMany({
          where: {
            userId,
            status: task.status,
            position: {
              gt: oldIndex,
            },
          },
          data: {
            position: {
              decrement: 1,
            },
          },
        });
        // Increment positions in the new status group
        await prisma.task.updateMany({
          where: {
            userId,
            status,
            position: {
              gte: index,
            },
          },
          data: {
            position: {
              increment: 1,
            },
          },
        });
      } else {
        if (oldIndex > index) {
          await prisma.task.updateMany({
            where: {
              userId,
              status,
              position: { gte: index, lt: oldIndex },
            },
            data: { position: { increment: 1 } },
          });
        }
        if (oldIndex < index) {
          await prisma.task.updateMany({
            where: {
              userId,
              status,
              position: { gt: oldIndex, lte: index },
            },
            data: { position: { decrement: 1 } },
          });
        }
      }
      await prisma.task.update({
        where: {
          id,
        },
        data: {
          position: index,
          status,
        },
      });
    });
    return { success: true };
  }
}
