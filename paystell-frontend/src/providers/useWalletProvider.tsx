"use client"

import type React from "react"

import { createContext, useContext } from "react"
import { useWalletStore } from "@/lib/wallet/wallet-store"

type WalletContextState = {
  state: {
    isConnected: boolean
    publicKey: string | null
    connecting: boolean
  }
  connectWallet: () => Promise<void>
  disconnectWallet: () => Promise<void>
  signTransaction: (transactionXDR: string, opts?: { networkPassphrase?: string }) => Promise<string>
}

const WalletContext = createContext<WalletContextState | null>(null)

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const walletStore = useWalletStore()

  // Map the zustand store to the context state
  const contextValue: WalletContextState = {
    state: {
      isConnected: walletStore.isConnected,
      publicKey: walletStore.publicKey,
      connecting: walletStore.connecting,
    },
    connectWallet: walletStore.connectWallet,
    disconnectWallet: walletStore.disconnectWallet,
    signTransaction: walletStore.signTransaction,
  }

  return <WalletContext.Provider value={contextValue}>{children}</WalletContext.Provider>
}

export const useWallet = () => {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider")
  }
  return context
}
