export interface NetworkConfig {
  key: string;
  name: string;
  rpcUrl: string;
  chainId: number;
  currency: string;
  blockExplorer?: string;
}

export const NETWORKS: NetworkConfig[] = [
  {
    key: 'hardhat',
    name: 'Hardhat Local',
    rpcUrl: '/hardhat-rpc',
    chainId: 31337,
    currency: 'ETH',
  },
  {
    key: 'sepolia',
    name: 'Sepolia',
    rpcUrl: 'https://ethereum-sepolia-rpc.publicnode.com',
    chainId: 11155111,
    currency: 'SepoliaETH',
    blockExplorer: 'https://sepolia.etherscan.io',
  },
  {
    key: 'holesky',
    name: 'Holesky',
    rpcUrl: 'https://holesky.drpc.org',
    chainId: 17000,
    currency: 'HoleskyETH',
    blockExplorer: 'https://holesky.etherscan.io',
  },
  {
    key: 'amoy',
    name: 'Polygon Amoy',
    rpcUrl: 'https://rpc-amoy.polygon.technology',
    chainId: 80002,
    currency: 'MATIC',
    blockExplorer: 'https://amoy.polygonscan.com',
  },
  {
    key: 'arbitrum-sepolia',
    name: 'Arbitrum Sepolia',
    rpcUrl: 'https://sepolia-rollup.arbitrum.io/rpc',
    chainId: 421614,
    currency: 'SepoliaETH',
    blockExplorer: 'https://sepolia.arbiscan.io',
  },
  {
    key: 'base-sepolia',
    name: 'Base Sepolia',
    rpcUrl: 'https://sepolia.base.org',
    chainId: 84532,
    currency: 'SepoliaETH',
    blockExplorer: 'https://sepolia.basescan.org',
  },
];

export const DEFAULT_NETWORK = NETWORKS[0];
