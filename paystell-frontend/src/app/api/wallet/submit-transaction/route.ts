import { NextResponse } from "next/server"

const HORIZON_URL = "https://horizon-testnet.stellar.org"

export async function POST(request: Request) {
  let errorMessage = "Unknown error";
  try {
    const { signedXdr } = await request.json()

    if (!signedXdr) {
      return NextResponse.json({ error: "Missing signed transaction XDR" }, { status: 400 })
    }

    // console.log("Submitting transaction:", signedXdr)
    const response = await fetch(`${HORIZON_URL}/transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `tx=${encodeURIComponent(signedXdr)}`,
    })

    const result = await response.json()

    if (!response.ok) {
      console.error("Transaction submission failed:", result)
      let errorMessage = "Failed to submit transaction"
      let errorDetails = null
      let resultCodes = null

      if (result.extras?.result_codes) {
        resultCodes = result.extras.result_codes
        errorMessage = resultCodes.transaction || errorMessage
        errorDetails = resultCodes.operations || null
      }

      return NextResponse.json(
        {
          error: errorMessage,
          details: errorDetails,
          resultCodes: resultCodes,
          message: result.title || result.detail || "Unknown error",
        },
        { status: 400 },
      )
    }

    console.log("Transaction submitted successfully:", result)

    return NextResponse.json({
      success: true,
      hash: result.hash,
      ledger: result.ledger,
    })
  } catch (error) {
    if (error instanceof Error) {
      errorMessage = error.message;
      console.error("Error submitting transaction:", error.message);
    } else {
      console.error("Error submitting transaction:", error);
    }

    return NextResponse.json(
      {
        error: "Failed to submit transaction",
        message: errorMessage,
      },
      { status: 500 },
    );
  }
}
