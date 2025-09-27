import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { DepositRequest } from "@/lib/types/deposit";
import { generateDepositId, calculateDepositExpiration, isValidStellarAddress } from "@/lib/deposit/deposit-utils";
import { paymentRateLimit } from "@/middleware/rateLimit";

import { depositStore } from "./deposit-store";

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResponse = paymentRateLimit(request);
    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    // 1. Authentication check
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

    const { amount, asset, memo, customAddress } = await request.json();

    // 2. Input validation
    if (!asset) {
      return NextResponse.json(
        { message: "Asset is required" },
        { status: 400 }
      );
    }

    // 3. Validate asset
    const supportedAssets = ["XLM", "USDC", "USDT"];
    if (!supportedAssets.includes(asset)) {
      return NextResponse.json(
        { message: "Unsupported asset" },
        { status: 400 }
      );
    }

    // 4. Validate amount if provided
    if (amount && (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0)) {
      return NextResponse.json(
        { message: "Invalid amount" },
        { status: 400 }
      );
    }

    // 5. Validate custom address if provided
    if (customAddress && !isValidStellarAddress(customAddress)) {
      return NextResponse.json(
        { message: "Invalid Stellar address" },
        { status: 400 }
      );
    }

    // 6. Create deposit request
    const depositRequest: DepositRequest = {
      id: generateDepositId(),
      address: customAddress || session.user.id, // Use user ID as fallback
      amount: amount || undefined,
      asset,
      memo: memo || undefined,
      status: "pending",
      createdAt: new Date().toISOString(),
      expiresAt: calculateDepositExpiration(),
    };

    // 7. Store deposit request
    depositStore.create(depositRequest.id, depositRequest);

    return NextResponse.json({
      success: true,
      deposit: depositRequest,
    });
  } catch (error: unknown) {
    console.error("Deposit creation error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to create deposit request";
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    // 1. Authentication check
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const requestedUserId = searchParams.get("userId");
    const status = searchParams.get("status");

    // 2. Security check - prevent access to other users' deposits
    if (requestedUserId && requestedUserId !== session.user.id) {
      return NextResponse.json(
        { message: "Access denied" },
        { status: 403 }
      );
    }

    const targetAddress = requestedUserId ?? session.user.id;

    // 3. Get deposits for user
    let userDeposits = depositStore.getByUser(targetAddress);

    // 4. Filter by status if provided
    if (status) {
      userDeposits = userDeposits.filter(deposit => deposit.status === status);
    }

    // 5. Sort by creation date (newest first)
    userDeposits.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({
      success: true,
      deposits: userDeposits,
      total: userDeposits.length,
    });
  } catch (error: unknown) {
    console.error("Deposit retrieval error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to retrieve deposits";
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
