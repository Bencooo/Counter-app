import { http, createConfig } from 'wagmi'
import { mainnet, sepolia, polygonMumbai } from 'wagmi/chains'
import { coinbaseWallet, injected, walletConnect } from 'wagmi/connectors'


const amoyTestnet = {
  id: 80002,
  name: 'Polygon Amoy Testnet',
  network: 'amoy',
  nativeCurrency: {
    decimals: 18,
    name: 'MATIC',
    symbol: 'MATIC',
  },
  rpcUrls: {
    default: { http: ['https://rpc-amoy.polygon.technology/'] },
  },
  blockExplorers: {
    default: { name: 'Polygonscan', url: 'https://amoy.polygonscan.com/' },
  },
  testnet: true,
}


export const config = createConfig({
  chains: [amoyTestnet],
  connectors: [
    injected(),
    coinbaseWallet({ appName: 'Create Wagmi' }),
    walletConnect({ projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID || '' }),
  ],
  ssr: true,
  transports: {
    [amoyTestnet.id]: http(),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
