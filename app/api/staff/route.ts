import connect from "@/lib/db";
import { Staff } from "@/lib/model/TaskAndStaff";
import { NextRequest, NextResponse } from "next/server";

// GET Staff
export const GET = async (req: NextRequest | Request) => {
  try {
    await connect();
    const { searchParams } = new URL(req.url);
    const staffId = searchParams.get("userId");

    if (staffId) {
      const staff = await Staff.findById(staffId);
      if (!staff) {
        return NextResponse.json(
          { message: "Can't find Staff of this id" },
          { status: 404 }
        );
      }

      return NextResponse.json(staff, { status: 200 });
    } else {
      const staff = await Staff.find();

      if (!staff) {
        return NextResponse.json(
          { message: "no staff found" },
          { status: 404 }
        );
      }

      return NextResponse.json(staff, { status: 200 });
    }
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { message: "Can't fetch the data", error: (error as Error).message },
      { status: 500 }
    );
  }
};

// CREATE Staff
export const POST = async (req: NextRequest | Request) => {
  try {
    await connect();
    const body = await req.json();
    const { name, color, tasks } = body;
    if (!name || !color) {
      return NextResponse.json(
        { message: "Name and color are required" },
        { status: 400 }
      );
    }
    const staff = await Staff.create({ name, color, tasks: tasks || [] });
    return NextResponse.json(staff, { status: 201 });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { message: "Can't create staff", error: (error as Error).message },
      { status: 500 }
    );
  }
};

// UPDATE Staff
export const PUT = async (req: NextRequest | Request) => {
  try {
    await connect();
    const { searchParams } = new URL(req.url);
    const staffId = searchParams.get("userId");
    if (!staffId) {
      return NextResponse.json(
        { message: "Staff ID is required" },
        { status: 400 }
      );
    }
    const body = await req.json();
    const staff = await Staff.findByIdAndUpdate(staffId, body, { new: true });
    if (!staff) {
      return NextResponse.json(
        { message: "Can't find Staff of this id" },
        { status: 404 }
      );
    }
    return NextResponse.json(staff, { status: 200 });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { message: "Can't update staff", error: (error as Error).message },
      { status: 500 }
    );
  }
};

// DELETE Staff
export const DELETE = async (req: NextRequest | Request) => {
  try {
    await connect();
    const { searchParams } = new URL(req.url);
    const staffId = searchParams.get("userId");
    if (!staffId) {
      return NextResponse.json(
        { message: "Staff ID is required" },
        { status: 400 }
      );
    }
    const staff = await Staff.findByIdAndDelete(staffId);
    if (!staff) {
      return NextResponse.json(
        { message: "Can't find Staff of this id" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "Staff deleted successfully" },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { message: "Can't delete staff", error: (error as Error).message },
      { status: 500 }
    );
  }
};
