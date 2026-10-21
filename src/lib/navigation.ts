import { BookOpenIcon, HouseIcon, MicIcon, SettingsIcon, type LucideIcon } from "lucide-react"

export interface NavItem {
  href: string
  label: string
  icon: LucideIcon
}

export const mainNav: NavItem[] = [
  { href: "/", label: "خانه", icon: HouseIcon },
  { href: "/speaking", label: "اسپیکینگ", icon: MicIcon },
  { href: "/dictionary", label: "واژه‌ها", icon: BookOpenIcon },
  { href: "/settings", label: "تنظیمات", icon: SettingsIcon },
]

export const speakingTabs = [
  { href: "/speaking/self-talk", label: "Self-talk", description: "حرف زدن با تایمر" },
  { href: "/speaking/self-dictionary", label: "Self-dictionary", description: "جمله‌سازی با لغات امروز" },
  { href: "/speaking/review", label: "Review", description: "مرور شبانه" },
] as const
