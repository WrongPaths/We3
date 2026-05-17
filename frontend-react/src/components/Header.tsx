import { memo, useState, useRef, useEffect } from 'react';
import type { NetworkConfig } from '../config/networks';
import type { ContractDef } from '../config/contracts';

interface HeaderProps {
  address: string;
  networkName: string;
  isConnected: boolean;
  isDemoMode: boolean;
  balance: string;
  hasMetaMask: boolean;
  onConnectDemo: () => void;
  onConnectWallet: () => void;
  onDisconnect: () => void;
  isConnecting: boolean;
  selectedNetwork: NetworkConfig;
  networks: NetworkConfig[];
  onNetworkChange: (network: NetworkConfig) => void;
  selectedContract: ContractDef;
  contracts: ContractDef[];
  onContractChange: (contract: ContractDef) => void;
}

const networkIcons: Record<string, string> = {
  hardhat: '🏠',
  sepolia: '🔷',
  holesky: '🕳️',
  amoy: '🔶',
  'arbitrum-sepolia': '🔹',
  'base-sepolia': '🔘',
};

const contractIcons: Record<string, string> = {
  'simple-storage': '📦',
};

function Dropdown({ trigger, children }: { trigger: React.ReactNode; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-2xl border border-[#F0E8DC]
          text-sm text-[#3D3535] font-medium cursor-pointer shadow-sm
          hover:border-[#C8956C] transition-colors duration-200
          focus:outline-none focus:border-[#C8956C]"
      >
        {trigger}
        <svg className="w-3.5 h-3.5 text-[#8B8178] ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full mt-2 right-0 min-w-full bg-white rounded-2xl shadow-lg border border-[#F0E8DC]
          overflow-hidden z-50 animate-fade-in whitespace-nowrap">
          {children}
        </div>
      )}
    </div>
  );
}

const Header = memo(function Header({
  address, networkName, isConnected, isDemoMode, balance, hasMetaMask,
  onConnectDemo, onConnectWallet, onDisconnect, isConnecting,
  selectedNetwork, networks, onNetworkChange,
  selectedContract, contracts, onContractChange,
}: HeaderProps) {

  return (
    <header className="w-full max-w-3xl mx-auto px-4 py-5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-[#C8956C] rounded-xl flex items-center justify-center text-white text-sm font-semibold shadow-sm">
          SS
        </div>
        <div>
          <h1 className="text-lg font-semibold text-[#3D3535] leading-tight">SimpleStorage</h1>
          <p className="text-xs text-[#8B8178]">local dapp playground</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {isConnected ? (
          <>
            <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-2xl shadow-sm border border-[#E8DFD5]">
              <div className="w-2 h-2 rounded-full bg-[#7A9A7E] animate-pulse" />
              <div className="text-right">
                <div className="text-xs text-[#8B8178] flex items-center gap-1">
                  {isDemoMode ? <span>🏠</span> : <span>🦊</span>}
                  {networkName}
                </div>
                <div className="text-sm font-medium text-[#3D3535]">
                  {address.slice(0, 6)}...{address.slice(-4)}
                </div>
              </div>
              <div className="text-xs text-[#7A9A7E] font-medium ml-2">
                {balance} ETH
              </div>
            </div>

            <button
              onClick={onDisconnect}
              className="px-3 py-2 bg-white border border-[#F0E8DC] rounded-2xl text-sm text-[#8B8178]
                hover:text-[#C8956C] hover:border-[#C8956C] transition-colors duration-200 shadow-sm"
              title="Disconnect"
            >
              ✕
            </button>
          </>
        ) : (
          <>
            {/* Network dropdown */}
            <Dropdown trigger={<><span>{networkIcons[selectedNetwork.key] || '🌐'}</span><span>{selectedNetwork.name}</span></>}>
              {networks.map(n => (
                <button
                  key={n.key}
                  onClick={() => onNetworkChange(n)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm text-left
                    transition-colors duration-150
                    ${n.key === selectedNetwork.key
                      ? 'bg-[#FAF7F2] text-[#C8956C] font-medium'
                      : 'text-[#3D3535] hover:bg-[#FAF7F2]'
                    }`}
                >
                  <span className="text-base">{networkIcons[n.key] || '🌐'}</span>
                  <div className="flex-1">
                    <div>{n.name}</div>
                    <div className="text-xs text-[#C4B8AD]">{n.currency}</div>
                  </div>
                  {n.key === selectedNetwork.key && (
                    <svg className="w-4 h-4 text-[#C8956C]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                    </svg>
                  )}
                </button>
              ))}
            </Dropdown>

            {/* Contract dropdown */}
            {contracts.length > 1 && (
              <Dropdown trigger={<><span>{contractIcons[selectedContract.key] || '📜'}</span><span>{selectedContract.name}</span></>}>
                {contracts.map(c => (
                  <button
                    key={c.key}
                    onClick={() => onContractChange(c)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm text-left
                      transition-colors duration-150
                      ${c.key === selectedContract.key
                        ? 'bg-[#FAF7F2] text-[#C8956C] font-medium'
                        : 'text-[#3D3535] hover:bg-[#FAF7F2]'
                      }`}
                  >
                    <span className="text-base">{contractIcons[c.key] || '📜'}</span>
                    <div className="flex-1">
                      <div>{c.name}</div>
                      <div className="text-xs text-[#C4B8AD]">{Object.keys(c.addresses).length} network(s) deployed</div>
                    </div>
                    {c.key === selectedContract.key && (
                      <svg className="w-4 h-4 text-[#C8956C]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                      </svg>
                    )}
                  </button>
                ))}
              </Dropdown>
            )}

            {/* Connect buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={onConnectDemo}
                disabled={isConnecting}
                className="px-4 py-2.5 bg-[#7A9A7E] text-white rounded-2xl font-medium text-sm
                  hover:bg-[#6B8A6F] active:scale-95 transition-all duration-200 shadow-sm
                  disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {isConnecting ? '...' : 'Start Demo'}
              </button>

              {hasMetaMask && (
                <button
                  onClick={onConnectWallet}
                  disabled={isConnecting}
                  className="px-4 py-2.5 bg-white border-2 border-[#F0E8DC] text-[#3D3535] rounded-2xl font-medium text-sm
                    hover:border-[#C8956C] active:scale-95 transition-all duration-200 shadow-sm
                    disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap flex items-center gap-1.5"
                >
                  <span>🦊</span>
                  {isConnecting ? '...' : 'Wallet'}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </header>
  );
});

export default Header;
