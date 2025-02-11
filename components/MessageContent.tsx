import { X } from 'lucide-react';

interface MessageContentProps {
  message: string;
  color: string;
  onClose: () => void;
}

export function MessageContent({ message, color, onClose }: MessageContentProps) {
  const colorClasses = {
    red: "text-red-500",
    green: "text-green-500",
    amber: "text-amber-400",
  };

  return (
    <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-50">
      <div className="md:ml-32 pointer-events-auto">
        <p className={`animaMini ${colorClasses[color as keyof typeof colorClasses]} border border-neutral-900 bg-black p-2 rounded-md font-semibold cursor-pointer transition flex flex-row gap-4 items-center`}>
          {message}
          <X onClick={onClose} className="border border-neutral-900 rounded-md cursor-pointer" />
        </p>
      </div>
    </div>
  );
} 