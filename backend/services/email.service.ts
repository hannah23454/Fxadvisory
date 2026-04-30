import { sendEmail, buildInsightsEmail, buildHedgePolicyEmail } from '@/lib/email'

export const emailService = {
  async sendInsightsDigest(to: string, name: string) {
    const html = buildInsightsEmail(name)
    return sendEmail({ to, subject: 'Your Weekly FX Insights — SwitchYard FX', html })
  },

  async sendHedgePolicy(to: string, name: string, downloadUrl: string) {
    const html = buildHedgePolicyEmail(name, downloadUrl)
    return sendEmail({ to, subject: 'Your Hedge Policy Document — SwitchYard FX', html })
  },

  async sendPasswordReset(to: string, resetUrl: string) {
    const html = `<p>Click <a href="${resetUrl}">here</a> to reset your password. Link expires in 1 hour.</p>`
    return sendEmail({ to, subject: 'Reset your SwitchYard FX password', html })
  },
}
