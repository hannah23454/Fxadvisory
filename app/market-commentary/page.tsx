"use client"

import { useState } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Disclaimer from "@/components/disclaimer"
import NewsletterSignup from "@/components/newsletter-signup"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown } from "lucide-react"
import { useI18n } from "@/components/i18n/i18n"

// Mock data - will be replaced with Airtable API call
const mockArticles = [
	{
		id: 1,
		title: "AUD/USD: Navigating Q4 Rate Signals",
		excerpt: "How RBA policy divergence could reshape your hedging strategy this quarter.",
		currency: "AUD/USD",
		date: "2025-01-15",
		trend: "down",
		featured: true,
	},
	{
		id: 2,
		title: "EUR Strength: Implications for Mid-Market Exporters",
		excerpt: "Euro resilience presents both challenges and opportunities for treasury teams.",
		currency: "AUD/EUR",
		date: "2025-01-12",
		trend: "up",
		featured: false,
	},
	{
		id: 3,
		title: "GBP Volatility & M&A Hedging Strategies",
		excerpt: "When volatility spikes, smart hedging becomes your competitive advantage.",
		currency: "AUD/GBP",
		date: "2025-01-10",
		trend: "up",
		featured: false,
	},
	{
		id: 4,
		title: "JPY Carry Trades: What Rising Rates Mean",
		excerpt: "Understanding the shifting JPY landscape for strategic payments planning.",
		currency: "AUD/JPY",
		date: "2025-01-08",
		trend: "down",
		featured: false,
	},
	{
		id: 5,
		title: "CHF Safe Haven Demand: Quarterly Outlook",
		excerpt: "Why geopolitical uncertainty is reshaping FX strategy.",
		currency: "AUD/CHF",
		date: "2025-01-05",
		trend: "up",
		featured: true,
	},
	{
		id: 6,
		title: "NZD/AUD Cross: Regional Divergence Play",
		excerpt: "Central bank policies create trading implications across the Tasman.",
		currency: "NZD/AUD",
		date: "2025-01-02",
		trend: "down",
		featured: false,
	},
]

const currencyPairs = ["All", "AUD/USD", "AUD/EUR", "AUD/GBP", "AUD/JPY", "AUD/CHF", "NZD/AUD"]

export default function MarketCommentary() {
	const [selectedCurrency, setSelectedCurrency] = useState("All")
  const { t } = useI18n()

	const filteredArticles =
		selectedCurrency === "All" ? mockArticles : mockArticles.filter((a) => a.currency === selectedCurrency)

	const featuredArticle = filteredArticles.find((a) => a.featured)

	return (
		<main className="min-h-screen bg-white">
			<Header />

			{/* Hero */}
			<section className="bg-[#12261f] text-white py-20 px-6">
				<div className="max-w-4xl mx-auto">
					<h1 className="text-5xl font-bold mb-6 text-balance">{t('market_commentary')}</h1>
					<p className="text-xl text-[#dce5e1]">
						Expert insights on FX trends, policy shifts, and strategic implications for your treasury. Curated by our
					team of FX specialists.
					</p>
				</div>
			</section>

			{/* Featured Article */}
			{featuredArticle && (
				<section className="bg-linear-to-r from-[#12261f] to-[#1a3a2f] text-white py-16 px-6">
					<div className="max-w-6xl mx-auto">
						<span className="inline-block px-3 py-1 rounded-full bg-[#bd6908] text-white text-xs font-bold mb-4">
							{t('featured')}
						</span>
						<h2 className="text-4xl font-bold mb-4 text-balance">{featuredArticle.title}</h2>
						<p className="text-lg text-[#dce5e1] mb-6 leading-relaxed">{featuredArticle.excerpt}</p>
						<div className="flex items-center gap-4">
							<span className="text-sm text-[#dce5e1]">
								{new Date(featuredArticle.date).toISOString().slice(0, 10)}
							</span>
							<span className="px-3 py-1 bg-[#12261f] rounded text-xs font-bold">
								{featuredArticle.currency}
							</span>
							<Button className="bg-[#bd6908] hover:bg-[#a35a07] text-white font-bold">
								{t('read_more')} →
							</Button>
						</div>
					</div>
				</section>
			)}

			{/* Filter & Newsletter */}
			<section className="bg-[#f5f7f6] py-12 px-6">
				<div className="max-w-6xl mx-auto">
					<div className="grid md:grid-cols-3 gap-8">
						{/* Filters */}
						<div className="md:col-span-2">
							<h3 className="font-bold text-[#12261f] mb-4 text-sm">Filter by Currency Pair</h3>
							<div className="flex gap-2 flex-wrap">
								{currencyPairs.map((pair) => (
									<button
										key={pair}
										onClick={() => setSelectedCurrency(pair)}
										className={`px-4 py-2 rounded-full text-sm font-medium transition ${
											selectedCurrency === pair
												? "bg-[#bd6908] text-white"
												: "border border-[#bd6908] text-[#bd6908] hover:bg-[#bd6908] hover:text-white"
										}`}
									>
										{pair}
									</button>
								))}
							</div>
						</div>

						{/* Newsletter CTA */}
						<div className="text-center md:text-right">
							<p className="text-sm text-[#4a5a55] mb-3 font-medium">Get daily insights</p>
							<Button className="bg-[#bd6908] hover:bg-[#a35a07] text-white font-bold w-full md:w-auto">
								Subscribe to Newsletter
							</Button>
						</div>
					</div>
				</div>
			</section>

			{/* Articles Grid */}
			<section className="py-20 px-6">
				<div className="max-w-6xl mx-auto">
					{filteredArticles.length > 0 ? (
						<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
							{filteredArticles.map((article) => (
								<Card
									key={article.id}
									className="bg-white border-[#dce5e1] hover:shadow-lg transition overflow-hidden cursor-pointer group"
								>
									<div className="p-6">
										<div className="flex items-center gap-2 mb-4">
											<span className="text-xs font-bold bg-[#dce5e1] text-[#12261f] px-3 py-1 rounded">
												{article.currency}
											</span>
											{article.trend === "up" ? (
												<span className="text-xs font-bold text-green-600 flex items-center gap-1">
													<TrendingUp size={14} /> Up
												</span>
											) : (
												<span className="text-xs font-bold text-red-600 flex items-center gap-1">
													<TrendingDown size={14} /> Down
												</span>
											)}
										</div>
										<h3 className="text-lg font-bold text-[#12261f] mb-2 leading-tight group-hover:text-[#bd6908] transition">
											{article.title}
										</h3>
										<p className="text-sm text-[#4a5a55] mb-4 leading-relaxed">{article.excerpt}</p>
										<div className="flex items-center justify-between pt-4 border-t border-[#dce5e1]">
											<span className="text-xs text-[#4a5a55]">
												{new Date(article.date).toISOString().slice(0, 10)}
											</span>
											<span className="text-[#bd6908] text-sm font-bold group-hover:gap-2 transition">
												{t('read_more')} →
											</span>
										</div>
									</div>
								</Card>
							))}
						</div>
					) : (
						<div className="text-center py-12">
							<p className="text-[#4a5a55]">No articles found for this currency pair.</p>
						</div>
					)}
				</div>
			</section>

			{/* Newsletter Deep Section */}
			<section className="bg-[#12261f] text-white py-16 px-6">
				<div className="max-w-2xl mx-auto text-center">
					<h2 className="text-3xl font-bold mb-4">{t('newsletter_cta_title')}</h2>
					<p className="text-[#dce5e1] mb-8">
						{t('newsletter_cta_desc')}
					</p>
					<NewsletterSignup />
				</div>
			</section>

			{/* Integration Note */}
			<section className="py-12 px-6 bg-[#f5f7f6]">
				<div className="max-w-4xl mx-auto p-6 bg-white rounded border border-[#dce5e1]">
					<p className="text-xs text-[#4a5a55] text-center mb-2">
						<strong>Airtable Integration:</strong> This page is ready to connect to your Airtable base. Update the API
						endpoint in the component to fetch live market commentary posts with full filtering and search capabilities.
					</p>
				</div>
			</section>

			<Disclaimer />
			<Footer />
		</main>
	)
}
