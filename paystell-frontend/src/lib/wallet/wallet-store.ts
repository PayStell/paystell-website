"use client"

import { create } from "zustand"
import { StellarWalletsKit, FREIGHTER_ID, WalletNetwork, allowAllModules } from "@creit.tech/stellar-wallets-kit"

// Initialize StellarWalletsKit
const SELECTED_WALLET_ID = "selectedWalletId"

function getSelectedWalletId() {
  if (typeof window === "undefined") return null
  return localStorage.getItem(SELECTED_WALLET_ID) || FREIGHTER_ID
}

let kit: StellarWalletsKit | null = null

// Initialize kit on client side only
if (typeof window !== "undefined") {
  kit = new StellarWalletsKit({
    modules: allowAllModules(),
    network: WalletNetwork.TESTNET,
    selectedWalletId: getSelectedWalletId() || FREIGHTER_ID,
  })
}

interface WalletState {
  isConnected: boolean
  publicKey: string | null
  networkType: "TESTNET" | "PUBLIC"
  error: string | null
  connecting: boolean
  connectWallet: () => Promise<void>
  disconnectWallet: () => Promise<void>
  signTransaction: (transactionXDR: string, opts?: { networkPassphrase?: string }) => Promise<string>
}

export const useWalletStore = create<WalletState>((set, get) => ({
  isConnected: false,
  publicKey: null,
  networkType: "TESTNET",
  error: null,
  connecting: false,

  connectWallet: async () => {
    if (!kit) return

    set({ connecting: true })

    try {
      await kit.openModal({
        onWalletSelected: async (option) => {
          try {
            // Set the selected wallet in localStorage
            localStorage.setItem(SELECTED_WALLET_ID, option.id)
            kit?.setWallet(option.id)

            // Get the public key from the wallet
            const { address } = await kit.getAddress()

            if (address) {
              set({
                isConnected: true,
                publicKey: address,
                error: null,
                connecting: false,
              })

              // Store connection in localStorage for persistence
              localStorage.setItem("stellar_wallet_connected", "true")
              localStorage.setItem("stellar_wallet_public_key", address)
            }
          } catch (error: unknown) {
            console.error("Wallet connection error:", error)
                      if (error instanceof Error) {
              set({
                isConnected: false,
                publicKey: null,
                error: error.message || "Failed to connect wallet",
                connecting: false,
              })
            } else {
              set({
                isConnected: false,
                publicKey: null,
                error: "An unknown error occurred while connecting the wallet",
                connecting: false,
              })
            }
          }
          return option.id
        },
      }).finally(() => set({ connecting: false }))
    } catch (error: unknown) {
      console.error("Wallet connection error:", error)
      set({
        isConnected: false,
        publicKey: null,
        error: error instanceof Error ? error.message : "Failed to connect wallet",
        connecting: false,
      })
    }
  },

  disconnectWallet: async () => {
    if (!kit) return

    try {
      kit.disconnect()

      // Clear localStorage
      localStorage.removeItem(SELECTED_WALLET_ID)
      localStorage.removeItem("stellar_wallet_connected")
      localStorage.removeItem("stellar_wallet_public_key")

      set({
        isConnected: false,
        publicKey: null,
        error: null,
        connecting: false,
      })
    } catch (error: unknown) {
      console.error("Wallet disconnection error:", error)
      set({
        error: error instanceof Error ? error.message : "Failed to disconnect wallet",
        connecting: false,
      })
    }
  },

  signTransaction: async (transactionXDR: string, opts = {}) => {
    if (!kit) throw new Error("Wallet kit not initialized")
    if (!get().isConnected || !get().publicKey) throw new Error("Wallet not connected")

    try {
      const { signedTxXdr } = await kit.signTransaction(transactionXDR, {
        address: get().publicKey!,
        networkPassphrase: opts.networkPassphrase || "Test SDF Network ; September 2015",
      })

      return signedTxXdr
    } catch (error: unknown) {
      console.error("Transaction signing error:", error)
      throw new Error(error instanceof Error ? error.message : "Failed to sign transaction")
    }
  },
}))

// Initialize wallet state from localStorage on client side
if (typeof window !== "undefined") {
  const isConnected = localStorage.getItem("stellar_wallet_connected") === "true"
  const publicKey = localStorage.getItem("stellar_wallet_public_key")

  if (isConnected && publicKey) {
    useWalletStore.setState({
      isConnected: true,
      publicKey,
    })
  }
}
