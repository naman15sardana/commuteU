import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { driverId, departTime, fromLabel, toCampus, seats, notes } = body;

    if (!driverId || !departTime || !fromLabel || !toCampus || !seats) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const ride = await prisma.ride.create({
      data: {
        driverId,
        departTime: new Date(departTime),
        fromLabel,
        toCampus,
        seats,
        notes,
      },
    });

    return NextResponse.json({ success: true, ride }, { status: 201 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET() {
  const rides = await prisma.ride.findMany({
    orderBy: { departTime: "asc" },
    include: { driver: true },
  });
  return NextResponse.json(rides);
}
