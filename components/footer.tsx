"use client"

import Link from "next/link"
import { Mail, Phone, MapPin } from "lucide-react"
import { useI18n } from "@/components/i18n/i18n"

export default function Footer() {
  const { t } = useI18n()

  return (
    <footer className="bg-[#12261F] text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="mb-4">
              <div className="text-2xl font-bold">SwitchYard</div>
              <div className="text-xs text-[#BD6908] font-medium">FX ADVISORY</div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              {t('footer_tagline')}
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">{t('footer_products')}</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/services" className="text-gray-400 hover:text-[#BD6908] transition text-sm">
                  {t('footer_forward')}
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-400 hover:text-[#BD6908] transition text-sm">
                  {t('footer_options')}
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-400 hover:text-[#BD6908] transition text-sm">
                  {t('footer_payment')}
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-400 hover:text-[#BD6908] transition text-sm">
                  {t('footer_treasury')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">{t('footer_company')}</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-[#BD6908] transition text-sm">
                  {t('footer_about')}
                </Link>
              </li>
              <li>
                <Link href="/market" className="text-gray-400 hover:text-[#BD6908] transition text-sm">
                  {t('footer_market')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-[#BD6908] transition text-sm">
                  {t('footer_contact')}
                </Link>
              </li>
              <li>
                <Link href="/" className="text-gray-400 hover:text-[#BD6908] transition text-sm">
                  {t('footer_login')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4">{t('footer_get_touch')}</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Phone size={18} className="text-[#BD6908] flex-shrink-0 mt-0.5" />
                <span className="text-gray-400 text-sm">+61 2 XXXX XXXX</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={18} className="text-[#BD6908] flex-shrink-0 mt-0.5" />
                <span className="text-gray-400 text-sm">hello@switchyardfx.com</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-[#BD6908] flex-shrink-0 mt-0.5" />
                <span className="text-gray-400 text-sm">{t('footer_sydney')}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 py-8"></div>

        {/* AFSL Compliance Footer */}
        <div className="bg-[#1a3a2f] rounded-lg p-6 mb-6">
          <p className="text-xs text-gray-300 leading-relaxed text-center">
            <strong>{t('footer_afsl')}</strong> | {t('footer_afsl_detail')}
            <br />
            <span className="text-gray-400">{t('footer_switchyard')}</span>
          </p>
        </div>

        {/* Bottom Links */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-400">
          <div className="flex gap-6">
            <Link href="/" className="hover:text-[#BD6908] transition">
              {t('footer_privacy')}
            </Link>
            <Link href="/" className="hover:text-[#BD6908] transition">
              {t('footer_terms')}
            </Link>
            <Link href="/" className="hover:text-[#BD6908] transition">
              {t('footer_compliance')}
            </Link>
          </div>
          <p>{t('footer_copyright')}</p>
        </div>
      </div>
    </footer>
  )
}
