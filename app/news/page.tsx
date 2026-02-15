import Header from "@/components/header"
import Footer from "@/components/footer"
import Disclaimer from "@/components/disclaimer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

// Mock news data
const newsItems = [
	{
		id: 1,
		title: "SwitchYard Launches Treasury Dashboard for Mid-Market CFOs",
		excerpt: "Real-time hedge monitoring and compliance reporting now available to all clients.",
		date: "2025-01-16",
		category: "Product",
	},
	{
		id: 2,
		title: "RBA Rate Decision: What It Means for Your FX Strategy",
		excerpt: "Latest policy shift and our recommendations for corporate hedging adjustments.",
		date: "2025-01-14",
		category: "Policy",
	},
	{
		id: 3,
		title: "New Zero-Cost Collar Strategies Now Available",
		excerpt: "Protect downside while maintaining upside participation in volatile markets.",
		date: "2025-01-12",
		category: "Product",
	},
]

export default function News() {
	return (
		<main className="min-h-screen bg-white">
			<Header />

			<section className="bg-[#12261f] text-white py-20 px-6">
				<div className="max-w-4xl mx-auto">
					<h1 className="text-5xl font-bold mb-6 text-balance">Latest News & Updates</h1>
					<p className="text-xl text-[#dce5e1]">
						Stay informed on market developments, regulatory changes, and SwitchYard updates.
					</p>
				</div>
			</section>

			<section className="py-20 px-6">
				<div className="max-w-4xl mx-auto">
					<div className="space-y-6">
						{newsItems.map((item) => (
							<Card key={item.id} className="bg-white border-[#dce5e1] hover:shadow-lg transition p-6">
								<div className="flex items-start justify-between mb-4">
									<span className="px-3 py-1 bg-[#dce5e1] text-[#12261f] text-xs font-bold rounded">
										{item.category}
									</span>
									<span className="text-sm text-[#4a5a55]">
										{new Date(item.date).toISOString().slice(0, 10)}
									</span>
								</div>
								<h3 className="text-2xl font-bold text-[#12261f] mb-3">{item.title}</h3>
								<p className="text-[#4a5a55] mb-4 leading-relaxed">{item.excerpt}</p>
								<Button variant="link" className="text-[#2D6A4F] p-0 h-auto font-bold">
									Read More →
								</Button>
							</Card>
						))}
					</div>
				</div>
			</section>

			<Disclaimer />
			<Footer />
		</main>
	)
}
