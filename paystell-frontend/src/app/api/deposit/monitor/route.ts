import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { DepositMonitoringConfig } from "@/lib/types/deposit";
import { isValidStellarAddress } from "@/lib/deposit/deposit-utils";

// In-memory store for monitoring configurations
// In production, use a database
const monitoringConfigs = new Map<string, DepositMonitoringConfig>();

export async function POST(request: NextRequest) {
  try {
    // 1. Authentication check
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

    const { address, asset, minAmount, maxAmount, memo } = await request.json();

    // 2. Input validation
    if (!address || !asset) {
      return NextResponse.json(
        { message: "Address and asset are required" },
        { status: 400 }
      );
    }

    // 3. Validate Stellar address
    if (!isValidStellarAddress(address)) {
      return NextResponse.json(
        { message: "Invalid Stellar address" },
        { status: 400 }
      );
    }

    // 4. Validate asset
    const supportedAssets = ["XLM", "USDC", "USDT"];
    if (!supportedAssets.includes(asset)) {
      return NextResponse.json(
        { message: "Unsupported asset" },
        { status: 400 }
      );
    }

    // 5. Validate amounts if provided
    if (minAmount && (isNaN(parseFloat(minAmount)) || parseFloat(minAmount) <= 0)) {
      return NextResponse.json(
        { message: "Invalid minimum amount" },
        { status: 400 }
      );
    }

    if (maxAmount && (isNaN(parseFloat(maxAmount)) || parseFloat(maxAmount) <= 0)) {
      return NextResponse.json(
        { message: "Invalid maximum amount" },
        { status: 400 }
      );
    }

    if (minAmount && maxAmount && parseFloat(minAmount) > parseFloat(maxAmount)) {
      return NextResponse.json(
        { message: "Minimum amount cannot be greater than maximum amount" },
        { status: 400 }
      );
    }

    // 6. Create monitoring configuration
    const config: DepositMonitoringConfig = {
      address,
      asset,
      minAmount: minAmount || undefined,
      maxAmount: maxAmount || undefined,
      memo: memo || undefined,
    };

    // 7. Store monitoring configuration
    const key = `${address}_${asset}`;
    monitoringConfigs.set(key, config);

    return NextResponse.json({
      success: true,
      config,
      message: "Monitoring started",
    });
  } catch (error: unknown) {
    console.error("Monitoring setup error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to setup monitoring";
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
    const address = searchParams.get("address");
    const asset = searchParams.get("asset");

    // 2. Get monitoring configurations
    let configs = Array.from(monitoringConfigs.values());

    // 3. Filter by address if provided
    if (address) {
      configs = configs.filter(config => config.address === address);
    }

    // 4. Filter by asset if provided
    if (asset) {
      configs = configs.filter(config => config.asset === asset);
    }

    return NextResponse.json({
      success: true,
      configs,
      total: configs.length,
    });
  } catch (error: unknown) {
    console.error("Monitoring retrieval error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to retrieve monitoring configs";
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
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
    const address = searchParams.get("address");
    const asset = searchParams.get("asset");

    // 2. Input validation
    if (!address || !asset) {
      return NextResponse.json(
        { message: "Address and asset are required" },
        { status: 400 }
      );
    }

    // 3. Remove monitoring configuration
    const key = `${address}_${asset}`;
    const deleted = monitoringConfigs.delete(key);

    if (!deleted) {
      return NextResponse.json(
        { message: "Monitoring configuration not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Monitoring stopped",
    });
  } catch (error: unknown) {
    console.error("Monitoring removal error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to remove monitoring";
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
