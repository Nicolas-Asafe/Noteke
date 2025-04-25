import * as TooltipPrimitive from '@radix-ui/react-tooltip';

interface TooltipProps {
  children: React.ReactNode;
  content: string;
}

export function Tooltip({ children, content }: TooltipProps) {
  return (
    <TooltipPrimitive.Root>
      <TooltipPrimitive.Trigger asChild>
        {children}
      </TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          className="bg-neutral-950 text-neutral-400 px-3 py-2 rounded-md text-sm border border-neutral-800"
          sideOffset={5}
        >
          {content}
          <TooltipPrimitive.Arrow className="fill-neutral-950" />
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  );
} 