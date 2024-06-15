import React from 'react'

interface ConnectButtonProps {
  name: string
  onClick: () => void
  isLoading?: boolean
  logoSrc?: string
}

export default function ConnectButton({ name, onClick, logoSrc }: ConnectButtonProps) {
  return (
    <button
      className="mt-2 px-4 py-2 bg-[#30C8DD] hover:bg-[#28b4c7] text-black font-semibold rounded-lg w-full flex items-center justify-center transition duration-300 ease-in-out transform hover:scale-105"
      onClick={onClick}
    >
      {name}
    </button>
  )
}
