'use client'

import { useAccount } from 'wagmi'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import HeaderLogo from '../components/HeaderLogo'
import WalletConnector from '../components/WalletConnector'

export default function HomePage() {
  const { isConnected } = useAccount()
  const [isMounted, setIsMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (isMounted && isConnected) {
      router.push('/dashboard')
    }
  }, [isMounted, isConnected, router])

  if (!isMounted) return null

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center py-2">
      <HeaderLogo />
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md border-4" style={{ backgroundColor: '#4C4E4E', borderColor: '#30C8DD' }}>
      <h2 className="text-2xl font-semibold mb-6 text-center text-white">Connect your Wallet <br/>to START</h2>
        <WalletConnector />
      </div>
    </div>
  )
}
