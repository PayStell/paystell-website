import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { DepositRequest } from "@/lib/types/deposit";

// In-memory store for deposit requests
// In production, use a database
const depositRequests = new Map<string, DepositRequest>();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 1. Authentication check
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

    const { id } = params;

    // 2. Get deposit request
    const deposit = depositRequests.get(id);
    if (!deposit) {
      return NextResponse.json(
        { message: "Deposit request not found" },
        { status: 404 }
      );
    }

    // 3. Check if user has access to this deposit
    if (deposit.address !== session.user.id) {
      return NextResponse.json(
        { message: "Access denied" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      deposit,
    });
  } catch (error: unknown) {
    console.error("Deposit retrieval error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to retrieve deposit";
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 1. Authentication check
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

    const { id } = params;
    const updates = await request.json();

    // 2. Get existing deposit request
    const existingDeposit = depositRequests.get(id);
    if (!existingDeposit) {
      return NextResponse.json(
        { message: "Deposit request not found" },
        { status: 404 }
      );
    }

    // 3. Check if user has access to this deposit
    if (existingDeposit.address !== session.user.id) {
      return NextResponse.json(
        { message: "Access denied" },
        { status: 403 }
      );
    }

    // 4. Validate updates
    const allowedUpdates = ["status", "transactionHash", "confirmedAt"];
    const validUpdates: Partial<DepositRequest> = {};

    for (const [key, value] of Object.entries(updates)) {
      if (allowedUpdates.includes(key)) {
        (validUpdates as Record<string, unknown>)[key] = value;
      }
    }

    // 5. Update deposit request
    const updatedDeposit: DepositRequest = {
      ...existingDeposit,
      ...validUpdates,
    };

    depositRequests.set(id, updatedDeposit);

    return NextResponse.json({
      success: true,
      deposit: updatedDeposit,
    });
  } catch (error: unknown) {
    console.error("Deposit update error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to update deposit";
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 1. Authentication check
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

    const { id } = params;

    // 2. Get existing deposit request
    const existingDeposit = depositRequests.get(id);
    if (!existingDeposit) {
      return NextResponse.json(
        { message: "Deposit request not found" },
        { status: 404 }
      );
    }

    // 3. Check if user has access to this deposit
    if (existingDeposit.address !== session.user.id) {
      return NextResponse.json(
        { message: "Access denied" },
        { status: 403 }
      );
    }

    // 4. Delete deposit request
    depositRequests.delete(id);

    return NextResponse.json({
      success: true,
      message: "Deposit request deleted",
    });
  } catch (error: unknown) {
    console.error("Deposit deletion error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to delete deposit";
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
