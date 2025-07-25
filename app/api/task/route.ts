import connect from "@/lib/db";
import { Task } from "@/lib/model/TaskAndStaff";
import { NextRequest, NextResponse } from "next/server";

// GET: Fetch all tasks or by id
export const GET = async (req: NextRequest | Request) => {
  try {
    await connect();
    const { searchParams } = new URL(req.url);
    const taskId = searchParams.get("taskId");
    if (taskId) {
      const task = await Task.findById(taskId);
      if (!task) {
        return NextResponse.json(
          { message: "Can't find Task of this id" },
          { status: 404 }
        );
      }
      return NextResponse.json(task, { status: 200 });
    } else {
      const tasks = await Task.find();
      return NextResponse.json(tasks, { status: 200 });
    }
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { message: "Can't fetch the data", error: (error as Error).message },
      { status: 500 }
    );
  }
};

// POST: Create a new task
export const POST = async (req: NextRequest | Request) => {
  try {
    await connect();
    const body = await req.json();
    const { title } = body;
    if (!title) {
      return NextResponse.json(
        { message: "Title is required" },
        { status: 400 }
      );
    }
    const task = await Task.create({ title });
    return NextResponse.json(task, { status: 201 });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { message: "Can't create task", error: (error as Error).message },
      { status: 500 }
    );
  }
};

// PUT: Update a task by id
export const PUT = async (req: NextRequest | Request) => {
  try {
    await connect();
    const { searchParams } = new URL(req.url);
    const taskId = searchParams.get("taskId");
    if (!taskId) {
      return NextResponse.json(
        { message: "Task ID is required" },
        { status: 400 }
      );
    }
    const body = await req.json();
    const task = await Task.findByIdAndUpdate(taskId, body, { new: true });
    if (!task) {
      return NextResponse.json(
        { message: "Can't find Task of this id" },
        { status: 404 }
      );
    }
    return NextResponse.json(task, { status: 200 });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { message: "Can't update task", error: (error as Error).message },
      { status: 500 }
    );
  }
};

// DELETE: Delete a task by id
export const DELETE = async (req: NextRequest | Request) => {
  try {
    await connect();
    const { searchParams } = new URL(req.url);
    const taskId = searchParams.get("taskId");
    if (!taskId) {
      return NextResponse.json(
        { message: "Task ID is required" },
        { status: 400 }
      );
    }
    const task = await Task.findByIdAndDelete(taskId);
    if (!task) {
      return NextResponse.json(
        { message: "Can't find Task of this id" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "Task deleted successfully" },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { message: "Can't delete task", error: (error as Error).message },
      { status: 500 }
    );
  }
};
