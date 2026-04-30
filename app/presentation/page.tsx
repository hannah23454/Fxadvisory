import type { Metadata } from "next"
import PortfolioIntelligencePresentation from "@/components/features/portfolio-intelligence-presentation"

export const metadata: Metadata = {
  title: "Strategic Portfolio Intelligence - SwitchYard",
  description: "10-slide presentation on institutional FX solutions.",
}

export default function PresentationPage() {
  return <PortfolioIntelligencePresentation />
}
