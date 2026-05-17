import { useState, useEffect, useCallback, useMemo } from 'react';
import { ethers } from 'ethers';
import Header from './components/Header';
import StorageCard from './components/StorageCard';
import TxLog from './components/TxLog';
import StatsBar from './components/StatsBar';
import Toast from './components/Toast';
import { useContract } from './hooks/useContract';
import { useDeploy } from './hooks/useDeploy';
import { NETWORKS, DEFAULT_NETWORK, type NetworkConfig } from './config/networks';
import { CONTRACTS, DEFAULT_CONTRACT, type ContractDef } from './config/contracts';

declare global {
  interface Window {
    ethereum?: any;
  }
}

const DEMO_PRIVATE_KEY = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';

export default function App() {
  // Connection state
  const [provider, setProvider] = useState<ethers.Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [address, setAddress] = useState('');
  const [networkName, setNetworkName] = useState('Hardhat');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);

  const hasMetaMask = typeof window !== 'undefined' && !!window.ethereum;

  // Network stats
  const [blockNumber, setBlockNumber] = useState('-');
  const [gasPrice, setGasPrice] = useState('-');
  const [balance, setBalance] = useState('-');

  // Network & contract selection
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkConfig>(DEFAULT_NETWORK);
  const [selectedContract, setSelectedContract] = useState<ContractDef>(DEFAULT_CONTRACT);

  // Deployed contract address (session override)
  const [deployedAddress, setDeployedAddress] = useState<string | null>(null);

  // Effective contract address for selected contract on selected network
  const contractAddress = deployedAddress || selectedContract.addresses[selectedNetwork.key];

  // Toast
  const [toastMsg, setToastMsg] = useState('');
  const [toastVisible, setToastVisible] = useState(false);

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    setToastVisible(true);
  }, []);

  // Contract hook
  const { storedValue, logs, isLoading, error, getValue, setValue, addLog, hasContract } = useContract(signer, isConnected, selectedContract.abi, contractAddress);

  // Deploy hook
  const { deploy, isDeploying, deployTx, deployError } = useDeploy();

  // Handle deploy
  const handleDeploy = useCallback(async () => {
    if (!signer) return;
    if (isDemoMode && selectedNetwork.key !== 'hardhat') {
      showToast('Demo wallet has no testnet ETH. Connect with MetaMask or switch to Hardhat Local.');
      addLog('DEMO', 'Deploy blocked: demo wallet lacks testnet funds');
      return;
    }
    const addr = await deploy(signer, selectedContract.abi, selectedContract.bytecode);
    if (addr) {
      setDeployedAddress(addr);
      addLog('DEMO', `${selectedContract.name} deployed to ${addr}`);
      showToast('Contract deployed! 🎉');
    }
  }, [signer, isDemoMode, selectedNetwork, deploy, addLog, showToast, selectedContract]);

  // Connect demo wallet (Hardhat account #0, only works on localhost)
  const connectDemo = useCallback(async () => {
    setIsConnecting(true);
    try {
      let rpcUrl = selectedNetwork.rpcUrl;
      if (rpcUrl.startsWith('/')) {
        rpcUrl = window.location.origin + rpcUrl;
      }

      const p = new ethers.JsonRpcProvider(rpcUrl);
      const s = new ethers.Wallet(DEMO_PRIVATE_KEY, p);
      const addr = await s.getAddress();

      setProvider(p);
      setSigner(s);
      setAddress(addr);
      setNetworkName(selectedNetwork.name);
      setIsConnected(true);
      setIsDemoMode(true);
      addLog('DEMO', `Demo mode active | ${addr.slice(0, 10)}...`);
      showToast(`Connected to ${selectedNetwork.name}! ☕`);
    } catch (err: any) {
      showToast('Connection failed: ' + err.message);
    } finally {
      setIsConnecting(false);
    }
  }, [addLog, showToast, selectedNetwork]);

  // Connect browser wallet (MetaMask)
  const connectWallet = useCallback(async () => {
    if (!window.ethereum) return;
    setIsConnecting(true);
    try {
      const p = new ethers.BrowserProvider(window.ethereum);
      const s = await p.getSigner();
      const addr = await s.getAddress();
      const network = await p.getNetwork();

      setProvider(p);
      setSigner(s);
      setAddress(addr);
      setNetworkName(selectedNetwork.name);
      setIsConnected(true);
      setIsDemoMode(false);
      addLog('DEMO', `Wallet connected | ${addr.slice(0, 10)}... | chainId=${network.chainId}`);
      showToast(`Wallet connected! ☕`);
    } catch (err: any) {
      showToast('Connection failed: ' + err.message);
    } finally {
      setIsConnecting(false);
    }
  }, [addLog, showToast, selectedNetwork]);

  // Refresh network stats - optimized to only update when values change
  const refreshStats = useCallback(async () => {
    if (!provider || !address) return;
    try {
      const bn = await provider.getBlockNumber();
      const fee = await provider.getFeeData();
      const bal = await provider.getBalance(address);
      
      const newBlockNumber = bn.toString();
      const newGasPrice = ethers.formatUnits(fee.gasPrice || 0n, 'gwei').slice(0, 6) + ' GWEI';
      const newBalance = parseFloat(ethers.formatEther(bal)).toFixed(5);
      
      // Only update state if values actually changed
      setBlockNumber(prev => prev !== newBlockNumber ? newBlockNumber : prev);
      setGasPrice(prev => prev !== newGasPrice ? newGasPrice : prev);
      setBalance(prev => prev !== newBalance ? newBalance : prev);
    } catch {
      // silent
    }
  }, [provider, address]);

  // Auto-refresh stats - increased interval to reduce frequency
  useEffect(() => {
    if (!isConnected) return;
    refreshStats();
    const interval = setInterval(refreshStats, 10000); // Changed from 6s to 10s
    return () => clearInterval(interval);
  }, [isConnected, refreshStats]);

  // Load initial value (only on networks where contract is deployed)
  useEffect(() => {
    if (isConnected && signer && hasContract) {
      getValue();
    }
  }, [isConnected, signer, hasContract, getValue]);

  const handleNetworkChange = useCallback((network: NetworkConfig) => {
    if (isConnected) return;
    setSelectedNetwork(network);
    setDeployedAddress(null); // Reset session override when switching networks
  }, [isConnected]);

  const handleContractChange = useCallback((contract: ContractDef) => {
    if (isConnected) return;
    setSelectedContract(contract);
    setDeployedAddress(null);
  }, [isConnected]);

  // Disconnect
  const disconnect = useCallback(() => {
    setProvider(null);
    setSigner(null);
    setAddress('');
    setNetworkName('');
    setIsConnected(false);
    setBlockNumber('-');
    setGasPrice('-');
    setBalance('-');
    setDeployedAddress(null);
    setIsDemoMode(false);
    addLog('DEMO', 'Disconnected');
    showToast('Disconnected');
  }, [addLog, showToast]);

  // Memoize header props to prevent unnecessary re-renders
  const headerProps = useMemo(() => ({
    address,
    networkName,
    isConnected,
    isDemoMode,
    balance,
    hasMetaMask,
    onConnectDemo: connectDemo,
    onConnectWallet: connectWallet,
    onDisconnect: disconnect,
    isConnecting,
    selectedNetwork,
    networks: NETWORKS,
    onNetworkChange: handleNetworkChange,
    selectedContract,
    contracts: CONTRACTS,
    onContractChange: handleContractChange,
  }), [address, networkName, isConnected, isDemoMode, balance, hasMetaMask, connectDemo, connectWallet, disconnect, isConnecting, selectedNetwork, handleNetworkChange, selectedContract, handleContractChange]);

  // Memoize stats bar props
  const statsBarProps = useMemo(() => ({
    blockNumber,
    gasPrice,
    balance,
    networkName,
    isConnected,
  }), [blockNumber, gasPrice, balance, networkName, isConnected]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAF7F2' }}>
      {/* Subtle background pattern */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(circle, #C8956C 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <Header {...headerProps} />

      <main className="relative max-w-3xl mx-auto px-4 pb-16 space-y-5">
        {/* Hero */}
        {!isConnected && (
          <div className="text-center py-10 space-y-3">
            <div className="text-5xl mb-4">🍵</div>
            <h2 className="text-2xl font-bold text-[#3D3535]">Welcome to SimpleStorage</h2>
            <p className="text-[#8B8178] max-w-sm mx-auto leading-relaxed">
              A cozy little DApp for reading and writing values on the blockchain. No stress, just click and go.
            </p>
          </div>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
          <div className="md:col-span-3">
            <StorageCard
              storedValue={storedValue}
              isLoading={isLoading}
              error={error}
              isConnected={isConnected}
              hasContract={hasContract}
              isDeploying={isDeploying}
              deployError={deployError}
              deployTx={deployTx}
              networkName={selectedNetwork.name}
              onGet={getValue}
              onSet={setValue}
              onDeploy={handleDeploy}
            />
          </div>
          <div className="md:col-span-2">
            <TxLog logs={logs} />
          </div>
        </div>

        {/* Stats */}
        <StatsBar {...statsBarProps} />

        {/* Footer */}
        <footer className="text-center pt-4">
          <p className="text-xs text-[#C4B8AD]">
            Built with React + ethers.js · Hardhat Local Network · Enjoy ☕
          </p>
        </footer>
      </main>

      <Toast message={toastMsg} visible={toastVisible} onClose={() => setToastVisible(false)} />
    </div>
  );
}
