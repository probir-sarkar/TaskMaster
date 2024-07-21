import { RequestHandler } from "express";
import { changePositionSchema, TaskSchema } from "@/schemas/task.schema";
import prisma from "@/configs/prisma";
import { jwtPayloadSchema } from "@/schemas/auth.schema";
export const task: RequestHandler = (req, res) => {
  res.json({ message: "Hello from task route", user: req.user });
};

export const addTask: RequestHandler = async (req, res) => {
  const task = TaskSchema.parse(req.body);
  const user = jwtPayloadSchema.parse(req.user);

  const result = await prisma.$transaction(async (prisma) => {
    await prisma.task.updateMany({
      where: {
        userId: user.id,
        status: "TODO",
        position: {
          gte: 0
        }
      },
      data: {
        position: {
          increment: 1
        }
      }
    });
    const newTask = await prisma.task.create({
      data: {
        ...task,
        userId: user.id
      }
    });
    return newTask;
  });
  res.status(201).json({ success: true, data: result });
};

export const deleteTask: RequestHandler = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ success: false, message: "Task ID is required" });
  const user = jwtPayloadSchema.parse(req.user);

  const task = await prisma.task.findUnique({
    where: {
      id
    }
  });
  if (!task) {
    return res.status(404).json({ success: false, message: "Task not found" });
  }
  if (task.userId !== user.id) {
    return res.status(403).json({ success: false, message: "Forbidden" });
  }
  await prisma.$transaction(async (prisma) => {
    await prisma.task.updateMany({
      where: {
        userId: user.id,
        status: task.status,
        position: {
          gt: task.position
        }
      },
      data: {
        position: {
          decrement: 1
        }
      }
    });
    await prisma.task.delete({
      where: {
        id
      }
    });
  });
  res.json({ success: true });
};

export const getTasks: RequestHandler = async (req, res) => {
  const user = jwtPayloadSchema.parse(req.user);
  const tasks = await prisma.task.findMany({
    where: {
      userId: user.id
    }
  });
  res.json({ success: true, data: tasks });
};

export const changePosition: RequestHandler = async (req, res) => {
  const { id, status, index } = changePositionSchema.parse(req.body);
  const user = jwtPayloadSchema.parse(req.user);

  const task = await prisma.task.findUnique({
    where: {
      id
    }
  });
  if (!task) {
    return res.status(404).json({ success: false, message: "Task not found" });
  }
  if (task.userId !== user.id) {
    return res.status(403).json({ success: false, message: "Forbidden" });
  }
  const oldIndex = task.position;
  await prisma.$transaction(async (prisma) => {
    if (task.status !== status) {
      // Decrement positions in the old status group
      await prisma.task.updateMany({
        where: {
          userId: user.id,
          status: task.status,
          position: {
            gt: oldIndex
          }
        },
        data: {
          position: {
            decrement: 1
          }
        }
      });
      // Increment positions in the new status group
      await prisma.task.updateMany({
        where: {
          userId: user.id,
          status,
          position: {
            gte: index
          }
        },
        data: {
          position: {
            increment: 1
          }
        }
      });
    } else {
      if (oldIndex > index) {
        await prisma.task.updateMany({
          where: {
            userId: user.id,
            status,
            position: { gte: index, lt: oldIndex }
          },
          data: { position: { increment: 1 } }
        });
      }
      if (oldIndex < index) {
        await prisma.task.updateMany({
          where: {
            userId: user.id,
            status,
            position: { gt: oldIndex, lte: index }
          },
          data: { position: { decrement: 1 } }
        });
      }
    }
    await prisma.task.update({
      where: {
        id
      },
      data: {
        position: index,
        status
      }
    });
  });
  res.json({ success: true });
};
