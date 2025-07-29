import { NextResponse } from 'next/server'
import { Horizon, Networks, Transaction } from '@stellar/stellar-sdk'

const server = new Horizon.Server('https://horizon-testnet.stellar.org')

export async function POST(request: Request) {
    try {
        const { signedTransaction, productId, amount } = await request.json()

        // 1. Parse the transaction
        const transaction = new Transaction(signedTransaction, Networks.TESTNET)

        // 2. Validate the transaction
        if (transaction.operations.length === 0) {
            return NextResponse.json(
                { message: 'Transaction has no operations' },
                { status: 400 }
            )
        }

        const paymentOp = transaction.operations[0]
        if (paymentOp.type !== 'payment') {
            return NextResponse.json(
                { message: 'Transaction is not a payment operation' },
                { status: 400 }
            )
        }

        // 3. Submit to the network
        const response = await server.submitTransaction(transaction)

        // 4. Here you would typically:
        // - Save the transaction to your database
        // - Update order status
        // - Send confirmation emails, etc.

        return NextResponse.json({
            success: true,
            transactionId: response.hash,
            productId,
            amount
        })

    } catch (error: any) {
        console.error('Payment processing error:', error)
        return NextResponse.json(
            { message: error.message || 'Payment processing failed' },
            { status: 500 }
        )
    }
}