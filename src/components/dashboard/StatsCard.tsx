import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  colorClass?: string;
  subtext?: string;
}

export default function StatsCard({
  label,
  value,
  icon: Icon,
  colorClass = "text-green-600",
  subtext,
}: StatsCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 flex items-start gap-4">
      <div className={cn("p-2.5 rounded-xl bg-gray-50", colorClass)}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
        {subtext && <p className="text-xs text-green-600 font-medium mt-0.5">{subtext}</p>}
      </div>
    </div>
  );
}
