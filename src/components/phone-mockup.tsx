import { cn } from "@/lib/utils";

interface PhoneMockupProps {
  children: React.ReactNode;
  className?: string;
}

export function PhoneMockup({ children, className }: PhoneMockupProps) {
  return (
    <div
      className={cn(
        "relative bg-gray-900 rounded-[40px] p-2 shadow-xl border border-gray-700 w-[375px] max-w-full",
        className
      )}
    >
      {/* Phone frame inner border */}
      <div className="relative bg-[#111827] rounded-[32px] overflow-hidden">
        {/* Notch / Dynamic Island */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10">
          <div className="bg-black w-24 h-6 rounded-b-2xl flex items-center justify-center">
            <div className="w-12 h-3 bg-gray-900 rounded-full" />
          </div>
        </div>

        {/* Screen content */}
        <div className="min-h-[580px] pt-8">{children}</div>

        {/* Home indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
          <div className="w-32 h-1 bg-gray-600 rounded-full" />
        </div>
      </div>
    </div>
  );
}
