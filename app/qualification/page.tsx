import type { Metadata } from "next"
import Disclaimer from "@/components/layout/disclaimer"
import FXQualificationForm from "@/components/forms/fx-qualification-form"

export const metadata: Metadata = {
  title: "FX Qualification - SwitchYard",
  description: "Qualify for your personalized FX strategy insights.",
}

export default function QualificationPage() {
  return (
    <main className="min-h-screen bg-white">
      <FXQualificationForm />
      <Disclaimer />
    </main>
  )
}
