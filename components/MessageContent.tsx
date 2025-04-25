import { X } from 'lucide-react';

interface MessageContentProps {
  message: string;
  color: string;
  onClose?: () => void;
}

export default function MessageContent({ message, color, onClose }: MessageContentProps) {
  const colorClasses = {
    red: "bg-red-500",
    green: "bg-green-500",
    amber: "bg-amber-500",
  };

  return (
    <div className="fixed inset-x-4 top-4 md:inset-auto md:top-4 md:right-4 md:left-auto z-50 pointer-events-auto">
      <div className={`${colorClasses[color as keyof typeof colorClasses]} rounded-lg shadow-lg`}>
        <div className="flex items-center justify-between p-4">
          <p className="text-white font-medium">{message}</p>
          {onClose && (
            <button
              onClick={onClose}
              className="ml-4 text-white hover:text-neutral-200 transition"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 