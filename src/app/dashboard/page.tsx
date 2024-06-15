'use client'

import { useAccount, useDisconnect, useReadContract, useWriteContract, useWatchContractEvent } from 'wagmi'
import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { abi } from '../abi' 
import Header from '../../components/Header'
import Status from '../../components/Status'
import CounterControl from '../../components/CounterControl'

const contractAddress = '0x44Ed5B6e2fcD22635B5feeF8fde5552B91c8fA30'

export default function DashboardPage() {
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
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center py-2">
      <Header />
      <Status onDisconnect={handleDisconnect} />
      <CounterControl
        counter={counter}
        readLoading={readLoading}
        readError={!!readError}
        onIncrement={() => {
          lastOperation.current = 'increment'
          writeContract({
            address: contractAddress,
            abi: abi,
            functionName: 'increment',
          })
        }}
        onDecrement={() => {
          lastOperation.current = 'decrement'
          writeContract({
            address: contractAddress,
            abi: abi,
            functionName: 'decrement',
          })
        }}
      />
    </div>
  )
}
