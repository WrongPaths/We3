import type { TxLogEntry } from '../hooks/useContract';
import { memo, useState } from 'react';

interface TxLogProps {
  logs: TxLogEntry[];
}

const typeStyles: Record<TxLogEntry['type'], string> = {
  SET: 'bg-[#FDF0E4] text-[#C8956C]',
  GET: 'bg-[#E8F0EA] text-[#7A9A7E]',
  DEMO: 'bg-[#F0EEF8] text-[#8B7EB3]',
  CONNECT: 'bg-[#E8EFF4] text-[#7B9EB3]',
};

const TxLog = memo(function TxLog({ logs }: TxLogProps) {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  return (
    <div className="bg-white rounded-3xl shadow-md border border-[#F0E8DC] p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-[#8B8178]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h2 className="font-semibold text-[#3D3535]">Activity</h2>
        </div>
        <span className="text-xs text-[#8B8178]">{logs.length} entries</span>
      </div>

      {/* Log List */}
      <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
        {logs.length === 0 ? (
          <div className="text-center py-8 text-sm text-[#C4B8AD]">
            <div className="text-3xl mb-2">☕</div>
            <p>No activity yet</p>
            <p className="text-xs mt-1">Connect to get started</p>
          </div>
        ) : (
          logs.map((entry, i) => {
            const isExpanded = expandedIdx === i;
            const dataLong = entry.data.length > 50;
            const hashLong = entry.hash && entry.hash.length > 16;
            const hasMore = dataLong || hashLong;

            return (
              <div
                key={`${entry.time}-${i}`}
                onClick={() => setExpandedIdx(isExpanded ? null : i)}
                className={`flex items-start gap-3 p-3 rounded-2xl transition-all duration-200
                  border border-transparent cursor-pointer
                  ${isExpanded
                    ? 'bg-[#FAF7F2] border-[#F0E8DC] shadow-sm'
                    : 'hover:bg-[#FAF7F2] hover:border-[#F0E8DC]'
                  }`}
              >
                <span className={`text-xs px-2 py-0.5 rounded-lg font-medium shrink-0 mt-0.5 ${typeStyles[entry.type]}`}>
                  {entry.type}
                </span>
                <div className="flex-1 min-w-0">
                  <div className={`text-sm text-[#3D3535] ${isExpanded ? 'break-all' : 'truncate'}`}>
                    {entry.data}
                  </div>
                  {entry.hash && (
                    <div className={`text-xs text-[#C4B8AD] mt-0.5 ${isExpanded ? 'break-all' : 'truncate'}`}>
                      tx: {isExpanded ? entry.hash : entry.hash.slice(0, 16) + '...'}
                    </div>
                  )}
                  {isExpanded && hasMore && (
                    <div className="text-xs text-[#C4B8AD] mt-1 italic">
                      Click again to collapse
                    </div>
                  )}
                </div>
                <span className="text-xs text-[#C4B8AD] whitespace-nowrap shrink-0 mt-0.5">{entry.time}</span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
});

export default TxLog;
