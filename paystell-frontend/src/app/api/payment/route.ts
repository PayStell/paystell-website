import { NextResponse, NextRequest } from "next/server";
import { Horizon, Networks, Transaction } from "@stellar/stellar-sdk";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { headers } from "next/headers";
import crypto from "crypto";
import { paymentRateLimit } from "@/middleware/rateLimit";

const server = new Horizon.Server("https://horizon-testnet.stellar.org");

// In-memory store for transaction hashes to prevent replay attacks
// In production, use Redis or a database
const processedTransactions = new Set<string>();

// Validate Stellar public key format
function isValidStellarPublicKey(address: string): boolean {
  return /^G[A-Z2-7]{55}$/.test(address);
}

// Validate amount is positive and reasonable
function isValidAmount(amount: number): boolean {
  return amount > 0 && amount <= 1000000; // Max 1M
}

// Validate product ID format
function isValidProductId(productId: string): boolean {
  return (
    typeof productId === "string" &&
    productId.length > 0 &&
    productId.length <= 100
  );
}

// Mock function to validate product against database
// In production, replace with actual database query
async function validateProduct(
  productId: string,
  amount: number
): Promise<boolean> {
  // TODO: Replace with actual database validation
  // const product = await db.product.findUnique({ where: { id: productId } });
  // return product && product.price === amount;

  // For now, return true in development mode
  if (process.env.NODE_ENV === "development") {
    return true;
  }

  // In production, this should always validate against the database
  return false;
}

// Mock function to validate merchant wallet address
// In production, replace with actual database query
async function validateMerchantWallet(
  merchantWalletAddress: string
): Promise<boolean> {
  // TODO: Replace with actual database validation
  // const merchant = await db.merchant.findFirst({
  //   where: { walletAddress: merchantWalletAddress, isActive: true }
  // });
  // return !!merchant;

  // For now, just validate the format
  return isValidStellarPublicKey(merchantWalletAddress);
}

export async function POST(request: Request) {
  try {
    // Apply rate limiting
    const rateLimitResponse = paymentRateLimit(request as NextRequest);
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

    const { signedTransaction, productId, amount, merchantWalletAddress } =
      await request.json();

    // 2. Input validation
    if (!signedTransaction || !productId || !amount || !merchantWalletAddress) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // 3. Validate product ID format
    if (!isValidProductId(productId)) {
      return NextResponse.json(
        { message: "Invalid product ID format" },
        { status: 400 }
      );
    }

    // 4. Validate amount
    if (!isValidAmount(amount)) {
      return NextResponse.json({ message: "Invalid amount" }, { status: 400 });
    }

    // 5. Validate merchant wallet address format
    if (!isValidStellarPublicKey(merchantWalletAddress)) {
      return NextResponse.json(
        { message: "Invalid merchant wallet address format" },
        { status: 400 }
      );
    }

    // 6. Validate product against database
    const isProductValid = await validateProduct(productId, amount);
    if (!isProductValid) {
      return NextResponse.json(
        { message: "Invalid product or amount mismatch" },
        { status: 400 }
      );
    }

    // 7. Validate merchant wallet address against database
    const isMerchantValid = await validateMerchantWallet(merchantWalletAddress);
    if (!isMerchantValid) {
      return NextResponse.json(
        { message: "Invalid merchant wallet address" },
        { status: 400 }
      );
    }

    // 8. Parse the transaction
    const transaction = new Transaction(signedTransaction, Networks.TESTNET);

    // 9. Validate the transaction
    if (transaction.operations.length === 0) {
      return NextResponse.json(
        { message: "Transaction has no operations" },
        { status: 400 }
      );
    }

    const paymentOp = transaction.operations[0];
    if (paymentOp.type !== "payment") {
      return NextResponse.json(
        { message: "Transaction is not a payment operation" },
        { status: 400 }
      );
    }

    // 10. Check for replay attacks
    const transactionHash = crypto
      .createHash("sha256")
      .update(signedTransaction)
      .digest("hex");
    if (processedTransactions.has(transactionHash)) {
      return NextResponse.json(
        { message: "Transaction already processed" },
        { status: 409 }
      );
    }

    // 11. Submit to the network
    const response = await server.submitTransaction(transaction);

    // 12. Mark transaction as processed to prevent replay
    processedTransactions.add(transactionHash);

    // 13. Here you would typically:
    // - Save the transaction to your database
    // - Update order status
    // - Send confirmation emails, etc.
    // TODO: Implement database operations

    return NextResponse.json({
      success: true,
      transactionId: response.hash,
      productId,
      amount,
      merchantWalletAddress,
    });
  } catch (error: unknown) {
    console.error("Payment processing error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Payment processing failed";
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
