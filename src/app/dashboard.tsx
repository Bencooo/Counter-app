'use client'

import { useAccount, useDisconnect, useReadContract, useWriteContract, useWatchContractEvent } from 'wagmi'
import { useState, useEffect, useCallback } from 'react'
import { abi } from './abi'

const contractAddress = '0x44Ed5B6e2fcD22635B5feeF8fde5552B91c8fA30'

export default function DashboardPage() {
  const { address, isConnected, status: accountStatus } = useAccount()
  const { disconnect } = useDisconnect()
  const [counter, setCounter] = useState<number | null>(null)
  const { writeContract, isSuccess: writeSuccess } = useWriteContract()

  // Lire la valeur actuelle du compteur
  const { data: countData, isError: readError, isLoading: readLoading, refetch } = useReadContract({
    address: contractAddress,
    abi: abi,
    functionName: 'count',
  })

  useEffect(() => {
    if (countData !== undefined) {
      setCounter(Number(countData))
    }
  }, [countData])

  // Force update function
  const forceUpdate = useCallback(() => {
    setCounter(prev => (prev === null ? prev : prev + 1))
  }, [])

  // Watch for the 'Incremented' event emitted by the contract
  useWatchContractEvent({
    address: contractAddress,
    abi: abi,
    eventName: 'Incremented',
    onLogs: (logs) => {
      console.log('New logs!', logs)
      if (logs && logs.length > 0) {
        console.log('Increment event detected:', logs)
        refetch()
        forceUpdate()
      }
    },
  })

  // Handle transaction success
  useEffect(() => {
    if (writeSuccess) {
      refetch()
      forceUpdate()
    }
  }, [writeSuccess, refetch, forceUpdate])

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-2">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Blockchain Counter</h1>
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Account</h2>
          <p>Status: {accountStatus}</p>
          <p>Address: {address}</p>
          {isConnected && (
            <button
              className="mt-2 px-4 py-2 bg-red-500 text-white rounded"
              onClick={() => disconnect()}
            >
              Disconnect
            </button>
          )}
        </div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Counter</h2>
          {readLoading ? (
            <p>Loading counter value...</p>
          ) : (
            <p>Counter Value: {counter}</p>
          )}
          {readError && <p className="text-red-500">Error loading counter value</p>}
        </div>
        <button
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded w-full"
          onClick={() =>
            writeContract({
              abi,
              address: contractAddress,
              functionName: 'increment'
            })
          }
        >
          Increment
        </button>
      </div>
    </div>
  )
}
