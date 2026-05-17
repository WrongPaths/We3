import { memo } from 'react';

interface ToastProps {
  message: string;
  visible: boolean;
  onClose: () => void;
}

const Toast = memo(function Toast({ message, visible, onClose }: ToastProps) {
  if (!visible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-[#3D3535] text-white px-6 py-3 rounded-2xl shadow-lg flex items-center gap-3 animate-fade-in">
        <span className="text-sm">{message}</span>
        <button
          onClick={onClose}
          className="text-white/60 hover:text-white transition-colors"
        >
          ✕
        </button>
      </div>
    </div>
  );
});

export default Toast;
