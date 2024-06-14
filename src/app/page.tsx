'use client'

import { useAccount, useConnect, useDisconnect, useReadContract, useWriteContract, useWatchContractEvent } from 'wagmi'
import { useState, useEffect, useCallback } from 'react'
import { abi } from './abi'

const contractAddress = '0x44Ed5B6e2fcD22635B5feeF8fde5552B91c8fA30'

function App() {
  const { address, isConnected, status: accountStatus } = useAccount()
  const { connectors, connect, error: connectError } = useConnect()
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
    <>
      <div>
        <h2>Account</h2>
        <div>
          status: {accountStatus}
          <br />
          address: {address}
        </div>
        {isConnected && (
          <button type="button" onClick={() => disconnect()}>
            Disconnect
          </button>
        )}
      </div>

      <div>
        <h2>Connect</h2>
        {connectors.map((connector) => (
          <button
            key={connector.id}
            onClick={() => connect({ connector })}
            type="button"
          >
            {connector.name}
          </button>
        ))}
        <div>{connectError?.message}</div>
      </div>

      <div>
        <h2>Counter</h2>
        {readLoading ? (
          <p>Loading counter value...</p>
        ) : (
          <p>Counter Value: {counter}</p>
        )}
        {readError && <p>Error loading counter value</p>}
      </div>

      <button 
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
    </>
  )
}

export default App
