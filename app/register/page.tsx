"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useI18n } from "@/components/i18n/i18n";

export default function RegisterComponent() {
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [organization, setOrganization] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [rateLimitWait, setRateLimitWait] = useState(0);

  const [expandedSections, setExpandedSections] = useState({
    currencies: false,
    hedging: false,
    marketAnalysis: false,
    treasury: false,
  });

  const [selectedCurrencies, setSelectedCurrencies] = useState<string[]>([]);
  const [selectedHedging, setSelectedHedging] = useState<string[]>([]);
  const [selectedMarketAnalysis, setSelectedMarketAnalysis] = useState<string[]>([]);
  const [selectedTreasury, setSelectedTreasury] = useState<string[]>([]);

  const router = useRouter();

  const currencyOptions = {
    major: ["USD", "EUR", "GBP", "JPY", "CHF", "AUD", "CAD", "NZD"],
    emerging: ["MXN", "BRL", "ZAR", "TRY", "RUB", "INR", "CNY"],
    asian: ["SGD", "HKD", "THB", "MYR", "KRW", "TWD", "PHP"],
    exotic: ["NOK", "SEK", "DKK", "PLN", "CZK", "HUF", "ILS"],
  };

  const hedgingOptions = [
    t('register_opt_forward_contracts'),
    t('register_opt_options_strategies'),
    t('register_opt_natural_hedging'),
    t('register_opt_dynamic_hedging'),
    t('register_opt_cross_currency_swaps'),
    t('register_opt_currency_collars'),
  ];

  const marketAnalysisOptions = [
    t('register_opt_technical_analysis'),
    t('register_opt_fundamental_analysis'),
    t('register_opt_central_bank_policy'),
    t('register_opt_economic_indicators'),
    t('register_opt_market_sentiment'),
    t('register_opt_geopolitical_events'),
  ];

  const treasuryOptions = [
    t('register_opt_cash_flow_management'),
    t('register_opt_risk_assessment_tools'),
    t('register_opt_exposure_monitoring'),
    t('register_opt_compliance_reporting'),
    t('register_opt_budget_rate_setting'),
    t('register_opt_multi_currency_forecasting'),
  ];

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            company_name: organization,
            currencies: selectedCurrencies,
            hedging_interests: selectedHedging,
            market_analysis_interests: selectedMarketAnalysis,
            treasury_interests: selectedTreasury,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (authError) {
        if (
          authError.message.includes("rate limit") ||
          authError.message.toLowerCase().includes("email rate limit exceeded")
        ) {
          throw new Error(
            "Too many registration attempts. Please wait 5-10 minutes and try again."
          );
        }
        if (
          authError.message.includes("already registered") ||
          authError.message.includes("User already registered")
        ) {
          throw new Error(
            "This email is already registered. Please try logging in instead."
          );
        }
        throw authError;
      }

      if (authData.user && !authData.session) {
        setSuccess(t('register_success_check_email'));
        setTimeout(() => router.push("/login"), 3000);
      } else if (authData.session) {
        setSuccess(t('register_success_redirecting'));
        setTimeout(() => router.push("/dashboard/user"), 2000);
      }
    } catch (err: any) {
      const errorMessage = err.message || "Registration failed. Please try again.";

      if (
        errorMessage.toLowerCase().includes("rate limit") ||
        errorMessage.toLowerCase().includes("too many")
      ) {
        setRateLimitWait(300);
        const interval = setInterval(() => {
          setRateLimitWait((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <div className="max-w-2xl mx-auto py-12 px-6">
          <Card className="p-8 border border-[#DCE5E1]">
            <div className="mb-6 text-center">
              <h1 className="text-3xl font-bold text-[#12261F] mb-2">{t('register_title')}</h1>
              <p className="text-[#4A5A55]">{t('register_subtitle')}</p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm">
                {error}
                {rateLimitWait > 0 && (
                  <div className="mt-2 text-xs">
                    Please wait: {Math.floor(rateLimitWait / 60)}:{(rateLimitWait % 60).toString().padStart(2, "0")} minutes
                  </div>
                )}
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded text-sm">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Required Fields */}
              <div className="space-y-4 pb-4 border-b border-[#DCE5E1]">
                <h3 className="text-sm font-semibold text-[#12261F] uppercase tracking-wide">
                  {t('register_required_info')}
                </h3>
                <input
                  type="text"
                  placeholder={t('register_full_name_placeholder')}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 rounded border border-[#DCE5E1] focus:outline-none focus:ring-2 focus:ring-[#BD6908] disabled:opacity-50"
                />
                <input
                  type="text"
                  placeholder={t('register_company_placeholder')}
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 rounded border border-[#DCE5E1] focus:outline-none focus:ring-2 focus:ring-[#BD6908] disabled:opacity-50"
                />
                <input
                  type="email"
                  placeholder={t('register_email_placeholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 rounded border border-[#DCE5E1] focus:outline-none focus:ring-2 focus:ring-[#BD6908] disabled:opacity-50"
                />
                <input
                  type="password"
                  placeholder={t('register_password_placeholder')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  disabled={loading}
                  className="w-full px-4 py-3 rounded border border-[#DCE5E1] focus:outline-none focus:ring-2 focus:ring-[#BD6908] disabled:opacity-50"
                />
              </div>

              {/* Optional Sections */}
              <div className="space-y-3 pt-4">
                <h3 className="text-sm font-semibold text-[#12261F] uppercase tracking-wide">
                  {t('register_personalize_title')}
                </h3>
                <p className="text-xs text-[#4A5A55] mb-4">
                  {t('register_personalize_desc')}
                </p>

                {/* Currencies Section */}
                <div className="border border-[#DCE5E1] rounded-lg">
                  <button
                    type="button"
                    onClick={() => toggleSection("currencies")}
                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                    disabled={loading}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-[#12261F]">
                        {t('register_currencies_traded')}
                      </span>
                      {selectedCurrencies.length > 0 && (
                        <span className="text-xs bg-[#BD6908] text-white px-2 py-0.5 rounded-full">
                          {selectedCurrencies.length}
                        </span>
                      )}
                    </div>
                    {expandedSections.currencies ? (
                      <ChevronUp className="w-5 h-5 text-[#4A5A55]" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-[#4A5A55]" />
                    )}
                  </button>

                  {expandedSections.currencies && (
                    <div className="px-4 pb-4 space-y-4">
                      {Object.entries(currencyOptions).map(([category, currencies]) => (
                        <div key={category}>
                          <h4 className="text-xs font-semibold text-[#4A5A55] uppercase mb-2">
                            {category}
                          </h4>
                          <div className="grid grid-cols-4 gap-2">
                            {currencies.map((currency) => (
                              <label
                                key={currency}
                                className="flex items-center space-x-2 cursor-pointer"
                              >
                                <input
                                  type="checkbox"
                                  checked={selectedCurrencies.includes(currency)}
                                  onChange={() => setSelectedCurrencies(prev => prev.includes(currency) ? prev.filter(c => c !== currency) : [...prev, currency])}
                                  className="accent-[#BD6908] cursor-pointer"
                                  disabled={loading}
                                />
                                <span className="text-sm text-[#12261F]">
                                  {currency}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Hedging Interests */}
                <div className="border border-[#DCE5E1] rounded-lg">
                  <button
                    type="button"
                    onClick={() => toggleSection("hedging")}
                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                    disabled={loading}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-[#12261F]">
                        {t('register_hedging_strategies')}
                      </span>
                      {selectedHedging.length > 0 && (
                        <span className="text-xs bg-[#BD6908] text-white px-2 py-0.5 rounded-full">
                          {selectedHedging.length}
                        </span>
                      )}
                    </div>
                    {expandedSections.hedging ? (
                      <ChevronUp className="w-5 h-5 text-[#4A5A55]" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-[#4A5A55]" />
                    )}
                  </button>

                  {expandedSections.hedging && (
                    <div className="px-4 pb-4 space-y-2">
                      {hedgingOptions.map((option) => (
                        <label
                          key={option}
                          className="flex items-center space-x-2 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedHedging.includes(option)}
                            onChange={() => setSelectedHedging(prev => prev.includes(option) ? prev.filter(o => o !== option) : [...prev, option])}
                            className="accent-[#BD6908] cursor-pointer"
                            disabled={loading}
                          />
                          <span className="text-sm text-[#12261F]">{option}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Market Analysis */}
                <div className="border border-[#DCE5E1] rounded-lg">
                  <button
                    type="button"
                    onClick={() => toggleSection("marketAnalysis")}
                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                    disabled={loading}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-[#12261F]">
                        {t('register_market_analysis')}
                      </span>
                      {selectedMarketAnalysis.length > 0 && (
                        <span className="text-xs bg-[#BD6908] text-white px-2 py-0.5 rounded-full">
                          {selectedMarketAnalysis.length}
                        </span>
                      )}
                    </div>
                    {expandedSections.marketAnalysis ? (
                      <ChevronUp className="w-5 h-5 text-[#4A5A55]" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-[#4A5A55]" />
                    )}
                  </button>

                  {expandedSections.marketAnalysis && (
                    <div className="px-4 pb-4 space-y-2">
                      {marketAnalysisOptions.map((option) => (
                        <label
                          key={option}
                          className="flex items-center space-x-2 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedMarketAnalysis.includes(option)}
                            onChange={() => setSelectedMarketAnalysis(prev => prev.includes(option) ? prev.filter(o => o !== option) : [...prev, option])}
                            className="accent-[#BD6908] cursor-pointer"
                            disabled={loading}
                          />
                          <span className="text-sm text-[#12261F]">{option}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Treasury Management */}
                <div className="border border-[#DCE5E1] rounded-lg">
                  <button
                    type="button"
                    onClick={() => toggleSection("treasury")}
                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                    disabled={loading}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-[#12261F]">
                        {t('register_treasury_tools')}
                      </span>
                      {selectedTreasury.length > 0 && (
                        <span className="text-xs bg-[#BD6908] text-white px-2 py-0.5 rounded-full">
                          {selectedTreasury.length}
                        </span>
                      )}
                    </div>
                    {expandedSections.treasury ? (
                      <ChevronUp className="w-5 h-5 text-[#4A5A55]" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-[#4A5A55]" />
                    )}
                  </button>

                  {expandedSections.treasury && (
                    <div className="px-4 pb-4 space-y-2">
                      {treasuryOptions.map((option) => (
                        <label
                          key={option}
                          className="flex items-center space-x-2 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedTreasury.includes(option)}
                            onChange={() => setSelectedTreasury(prev => prev.includes(option) ? prev.filter(o => o !== option) : [...prev, option])}
                            className="accent-[#BD6908] cursor-pointer"
                            disabled={loading}
                          />
                          <span className="text-sm text-[#12261F]">{option}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading || rateLimitWait > 0}
                className="w-full bg-[#BD6908] hover:bg-[#a35a07] text-white py-3 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
              >
                {loading
                  ? t('register_creating_account')
                  : rateLimitWait > 0
                  ? `Wait ${Math.floor(rateLimitWait / 60)}:${(rateLimitWait % 60)
                      .toString()
                      .padStart(2, "0")}`
                  : t('register_create_account')}
              </Button>
            </form>

            <div className="text-center mt-4 text-sm text-[#4A5A55]">
              {t('register_already_have')}{" "}
              <a
                href="/login"
                className="text-[#BD6908] hover:underline font-medium"
              >
                {t('register_login_here')}
              </a>
            </div>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}