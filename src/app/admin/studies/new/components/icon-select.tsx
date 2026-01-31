"use client";

import {
  Download,
  Watch,
  Gift,
  MessageSquare,
  RefreshCw,
  ClipboardList,
  Sparkles,
  Package,
  Heart,
  BarChart3,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";

// Available icons for What You'll Do
export const WHAT_YOULL_DO_ICON_OPTIONS = [
  { value: "download", label: "Download", icon: Download, color: "text-[#00D1C1]" },
  { value: "watch", label: "Watch", icon: Watch, color: "text-gray-400" },
  { value: "gift", label: "Gift", icon: Gift, color: "text-amber-400" },
  { value: "message", label: "Message", icon: MessageSquare, color: "text-blue-400" },
  { value: "refresh", label: "Refresh", icon: RefreshCw, color: "text-gray-400" },
  { value: "clipboard", label: "Clipboard", icon: ClipboardList, color: "text-purple-400" },
  { value: "sparkles", label: "Sparkles", icon: Sparkles, color: "text-yellow-400" },
  { value: "package", label: "Package", icon: Package, color: "text-amber-400" },
];

// Available icons for What You'll Get
export const WHAT_YOULL_GET_ICON_OPTIONS = [
  { value: "package", label: "Package/Gift", icon: Gift, color: "text-amber-400" },
  { value: "heart", label: "Heart", icon: Heart, color: "text-red-400" },
  { value: "chart", label: "Chart", icon: BarChart3, color: "text-blue-400" },
];

interface IconSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: typeof WHAT_YOULL_DO_ICON_OPTIONS;
}

export function IconSelect({ value, onChange, options }: IconSelectProps) {
  const selected = options.find((o) => o.value === value) || options[0];
  const IconComponent = selected.icon;

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[100px]">
        <div className="flex items-center gap-2">
          <IconComponent className={`h-4 w-4 ${selected.color}`} />
        </div>
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => {
          const Icon = option.icon;
          return (
            <SelectItem key={option.value} value={option.value}>
              <div className="flex items-center gap-2">
                <Icon className={`h-4 w-4 ${option.color}`} />
                <span>{option.label}</span>
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
