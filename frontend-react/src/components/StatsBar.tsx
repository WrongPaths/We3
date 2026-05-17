import { memo } from 'react';

interface StatsBarProps {
  blockNumber: string;
  gasPrice: string;
  balance: string;
  networkName: string;
  isConnected: boolean;
}

const StatsBar = memo(function StatsBar({ blockNumber, gasPrice, balance, networkName, isConnected }: StatsBarProps) {
  const stats = [
    { label: 'Block', value: blockNumber, icon: '⊞' },
    { label: 'Gas Price', value: gasPrice, icon: '⚡' },
    { label: 'Balance', value: balance + ' ETH', icon: '💰' },
    { label: 'Network', value: networkName, icon: '🌐' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {stats.map(s => (
        <div
          key={s.label}
          className="bg-white rounded-2xl shadow-sm border border-[#F0E8DC] p-4 text-center
            hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
        >
          <div className="text-lg mb-1">{s.icon}</div>
          <div className="text-xs text-[#8B8178] mb-1">{s.label}</div>
          <div className="text-sm font-semibold text-[#3D3535] tabular-nums">
            {isConnected ? s.value : '-'}
          </div>
        </div>
      ))}
    </div>
  );
});

export default StatsBar;
