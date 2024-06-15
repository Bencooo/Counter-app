'use client'

import { useAccount, useDisconnect, useReadContract, useWriteContract, useWatchContractEvent } from 'wagmi'
import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { abi } from '../abi' // Ajustez le chemin d'importation si nécessaire
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons'

const contractAddress = '0x44Ed5B6e2fcD22635B5feeF8fde5552B91c8fA30'

export default function DashboardPage() {
  const { address, isConnected, status: accountStatus } = useAccount()
  const { disconnect } = useDisconnect()
  const [counter, setCounter] = useState<number | null>(null)
  const { writeContract, isSuccess: writeSuccess } = useWriteContract()
  const lastOperation = useRef<string | null>(null)
  const router = useRouter()

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

  const forceUpdate = useCallback((operation: 'increment' | 'decrement') => {
    setCounter(prev => {
      if (prev === null) return prev
      return operation === 'increment' ? prev + 1 : Math.max(prev - 1, 0)
    })
  }, [])

  useWatchContractEvent({
    address: contractAddress,
    abi: abi,
    eventName: 'Incremented',
    onLogs: (logs) => {
      console.log('New logs!', logs)
      if (logs && logs.length > 0) {
        console.log('Increment event detected:', logs)
        refetch()
        forceUpdate('increment')
      }
    },
  })

  useWatchContractEvent({
    address: contractAddress,
    abi: abi,
    eventName: 'Decremented',
    onLogs: (logs) => {
      console.log('Decrement event detected:', logs)
      refetch()
      forceUpdate('decrement')
    },
  })

  useEffect(() => {
    if (writeSuccess) {
      refetch()
      if (lastOperation.current === 'increment') {
        forceUpdate('increment')
      } else if (lastOperation.current === 'decrement') {
        forceUpdate('decrement')
      }
      lastOperation.current = null
    }
  }, [writeSuccess, refetch, forceUpdate])

  const handleDisconnect = () => {
    disconnect()
    router.push('/') // Redirection vers la page d'accueil après la déconnexion
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center py-2">
      <h1 className="text-3xl font-bold mt-6 mb-12 text-center text-white">Blockchain Counter</h1>
      <div className="flex justify-between w-full px-8">
        <div className="text-white">
          <p className="font-semibold text-lg">
            Status: <span className={`font-bold ${isConnected ? 'text-green-500' : ''}`}>{accountStatus}</span>
          </p>
          <p className="font-semibold text-lg">
            Address: <span className="font-bold">{address}</span>
          </p>
        </div>
        {isConnected && (
          <button
            className="mt-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
            onClick={handleDisconnect}
          >
            Disconnect
          </button>
        )}
      </div>
      <div className="bg-[#4C4E4E] p-8 rounded-lg shadow-lg w-full max-w-md text-white mt-6">
        <div className="flex justify-between items-center">
          <button
            className="p-4 bg-[#30C8DD] text-white font-semibold rounded-full transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center"
            onClick={() => {
              lastOperation.current = 'increment'
              writeContract({
                address: contractAddress,
                abi: abi,
                functionName: 'increment',
              })
            }}
          >
            <FontAwesomeIcon icon={faPlus} className="text-white" />
          </button>
          {readLoading ? (
            <p className="text-4xl">Loading...</p>
          ) : (
            <p className="text-4xl mx-4">{counter}</p>
          )}
          {readError && <p className="text-red-500">Error</p>}
          <button
            className="p-4 bg-[#30C8DD] text-white font-semibold rounded-full transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center"
            onClick={() => {
              lastOperation.current = 'decrement'
              writeContract({
                address: contractAddress,
                abi: abi,
                functionName: 'decrement',
              })
            }}
          >
            <FontAwesomeIcon icon={faMinus} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  )
}
