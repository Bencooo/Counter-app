'use client'

import { useAccount, useDisconnect, useReadContract, useWriteContract, useWatchContractEvent } from 'wagmi'
import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { abi } from '../ABI_COUNTER'
import Header from '../../components/Header'
import Status from '../../components/Status'
import CounterControl from '../../components/CounterControl'

const contractAddress = '0x44Ed5B6e2fcD22635B5feeF8fde5552B91c8fA30'

interface Log {
  data: string;
  topics: string[];
  address: string;
}

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

  const forceUpdate = useCallback((operation: 'increment' | 'decrement' | 'incrementBy' | 'decrementBy', value?: number) => {
    setCounter(prev => {
      if (prev === null) return prev
      if (operation === 'incrementBy' && value !== undefined) {
        return prev + value
      }
      if (operation === 'decrementBy' && value !== undefined) {
        return Math.max(prev - value, 0)
      }
      return operation === 'increment' ? prev + 1 : Math.max(prev - 1, 0)
    })
  }, [])

  useWatchContractEvent({
    address: contractAddress,
    abi: abi,
    eventName: 'Incremented',
    onLogs: (logs: Log[]) => {
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
    onLogs: (logs: Log[]) => {
      console.log('Decrement event detected:', logs)
      refetch()
      forceUpdate('decrement')
    },
  })

  useWatchContractEvent({
    address: contractAddress,
    abi: abi,
    eventName: 'IncrementedBy',
    onLogs: (logs: Log[]) => {
      console.log('Increment by value event detected:', logs)
      if (logs && logs.length > 0) {
        const log = logs[0]
        const value = parseInt(log.data, 16)
        refetch()
        forceUpdate('incrementBy', value)
      }
    },
  })

  useWatchContractEvent({
    address: contractAddress,
    abi: abi,
    eventName: 'DecrementedBy',
    onLogs: (logs: Log[]) => {
      console.log('Decrement by value event detected:', logs)
      if (logs && logs.length > 0) {
        const log = logs[0]
        const value = parseInt(log.data, 16)
        refetch()
        forceUpdate('decrementBy', value)
      }
    },
  })

  useEffect(() => {
    if (writeSuccess) {
      refetch()
      if (lastOperation.current === 'increment') {
        forceUpdate('increment')
      } else if (lastOperation.current === 'decrement') {
        forceUpdate('decrement')
      } else if (lastOperation.current?.startsWith('incrementBy')) {
        const value = parseInt(lastOperation.current.split(':')[1])
        forceUpdate('incrementBy', value)
      } else if (lastOperation.current?.startsWith('decrementBy')) {
        const value = parseInt(lastOperation.current.split(':')[1])
        forceUpdate('decrementBy', value)
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
        onIncrementBy={(value: number) => {
          lastOperation.current = `incrementBy:${value}`
          writeContract({
            address: contractAddress,
            abi: abi,
            functionName: 'incrementBy',
            args: [BigInt(value)], 
          })
        }}
        onDecrementBy={(value: number) => {
          lastOperation.current = `decrementBy:${value}`
          writeContract({
            address: contractAddress,
            abi: abi,
            functionName: 'decrementBy',
            args: [BigInt(value)], 
          })
        }}
      />
    </div>
  )
}
