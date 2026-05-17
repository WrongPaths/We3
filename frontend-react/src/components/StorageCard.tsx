import { useState, useCallback, memo } from 'react';

interface StorageCardProps {
  storedValue: string;
  isLoading: boolean;
  error: string | null;
  isConnected: boolean;
  hasContract: boolean;
  isDeploying: boolean;
  deployError: string | null;
  deployTx: string | null;
  networkName: string;
  onGet: () => void;
  onSet: (value: string) => void;
  onDeploy: () => void;
}

const StorageCard = memo(function StorageCard({
  storedValue, isLoading, error, isConnected, hasContract,
  isDeploying, deployError, deployTx, networkName,
  onGet, onSet, onDeploy,
}: StorageCardProps) {
  const [inputValue, setInputValue] = useState('');

  const handleSet = useCallback(() => {
    if (inputValue && !isNaN(Number(inputValue))) {
      onSet(inputValue);
      setInputValue('');
    }
  }, [inputValue, onSet]);

  return (
    <div className="bg-white rounded-3xl shadow-md border border-[#F0E8DC] p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center gap-2">
        <svg className="w-5 h-5 text-[#7A9A7E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
        <h2 className="font-semibold text-[#3D3535]">Storage</h2>
      </div>

      {isConnected && !hasContract ? (
        <div className="bg-[#FDF8F0] rounded-2xl p-5 text-center border border-[#F0E8DC] space-y-4">
          <div>
            <div className="text-3xl mb-2">📦</div>
            <p className="text-sm text-[#8B8178]">No contract on {networkName}.</p>
            <p className="text-xs text-[#C4B8AD] mt-1">Deploy SimpleStorage to start interacting.</p>
          </div>

          {deployError && (
            <div className="bg-[#FFF0ED] text-[#C8544B] text-xs px-3 py-2 rounded-xl border border-[#FDD8D3] text-left break-all">
              {deployError}
            </div>
          )}

          {deployTx && !deployError && (
            <div className="bg-[#E8F0EA] text-[#7A9A7E] text-xs px-3 py-2 rounded-xl border border-[#C8DFCC] text-left">
              <span className="font-medium">Deployed!</span>{' '}
              <span className="break-all">tx: {deployTx.slice(0, 20)}...</span>
            </div>
          )}

          <button
            onClick={onDeploy}
            disabled={isDeploying}
            className="w-full py-3 bg-[#7A9A7E] text-white rounded-2xl font-medium text-sm
              hover:bg-[#6B8A6F] active:scale-[0.98] transition-all duration-200 shadow-sm
              disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isDeploying ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Deploying...
              </span>
            ) : (
              `Deploy to ${networkName}`
            )}
          </button>
        </div>
      ) : (
        <>
          {/* Stored Value Display */}
          <div className="bg-[#FAF7F2] rounded-2xl p-6 text-center border border-[#F0E8DC]">
            <div className="text-xs text-[#8B8178] mb-2 uppercase tracking-wide">Current Value</div>
            <div className="text-4xl font-bold text-[#C8956C] tabular-nums transition-all duration-300">
              {!isConnected ? '-' : storedValue}
            </div>
            <div className="text-xs text-[#8B8178] mt-1">uint256</div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-[#FFF0ED] text-[#C8544B] text-sm px-4 py-2 rounded-xl border border-[#FDD8D3]">
              {error}
            </div>
          )}

          {/* Set Input */}
          <div className="space-y-2">
            <label className="text-xs text-[#8B8178] uppercase tracking-wide">Set New Value</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSet()}
                placeholder="Enter a number..."
                disabled={!isConnected || isLoading}
                className="flex-1 px-4 py-2.5 bg-[#FDFBFA] border border-[#E8DFD5] rounded-2xl text-[#3D3535]
                  placeholder-[#C4B8AD] focus:outline-none focus:border-[#C8956C] focus:ring-2 focus:ring-[#C8956C]/10
                  transition-all duration-200 disabled:opacity-50"
              />
              <button
                onClick={handleSet}
                disabled={!isConnected || isLoading || !inputValue}
                className="px-5 py-2.5 bg-[#C8956C] text-white rounded-2xl font-medium text-sm
                  hover:bg-[#B8845E] active:scale-95 transition-all duration-200 shadow-sm
                  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? '...' : 'Set'}
              </button>
            </div>
          </div>

          {/* Get Button */}
          <button
            onClick={onGet}
            disabled={!isConnected || isLoading}
            className="w-full py-3 border-2 border-[#7A9A7E] text-[#7A9A7E] rounded-2xl font-medium
              hover:bg-[#7A9A7E]/5 active:scale-[0.98] transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Reading...' : 'Refresh Value'}
          </button>
        </>
      )}
    </div>
  );
});

export default StorageCard;
