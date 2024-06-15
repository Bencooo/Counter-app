import React from 'react'
import { useConnect } from 'wagmi'
import ConnectButton from './ConnectButton'

export default function WalletConnector() {
  const { connectors, connect, error: connectError } = useConnect()

  return (
    <div className="mb-4">
      {connectors.map((connector) => (
        <ConnectButton
          key={connector.id}
          name={connector.name}
          onClick={() => connect({ connector })}
        />
      ))}
      {connectError && <p className="text-red-500 mt-2">{connectError.message}</p>}
    </div>
  )
}
