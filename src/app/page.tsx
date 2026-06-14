"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/product/ProductCard";
import CategoryCard from "@/components/product/CategoryCard";

// ============ AVIS PAR DÉFAUT ============
const defaultReviews = [
  { name: "Marcus L.", initials: "ML", role: "Tech Reviewer", location: "Melbourne, AU", rating: 5, content: "Best place to buy electronics with crypto. Ordered an iPhone and MacBook, both arrived in 3 days. The TRX payment was seamless. Highly recommend!" },
  { name: "Priya K.", initials: "PK", role: "Verified Buyer", location: "Sydney, AU", rating: 5, content: "I was skeptical about paying with Bitcoin, but the process was smooth and my Samsung Galaxy arrived exactly as described. Will shop again." },
  { name: "Alex T.", initials: "AT", role: "Crypto Enthusiast", location: "Brisbane, AU", rating: 5, content: "Finally a marketplace that understands crypto! Bought a gaming console with USDT. The 30-minute payment window is fair and the tracking updates were great." },
  { name: "Sophie R.", initials: "SR", role: "Verified Buyer", location: "Auckland, NZ", rating: 4, content: "Great selection of premium electronics. Shipping to NZ took 8 days but the product was perfect. Would love faster international shipping options." },
  { name: "James W.", initials: "JW", role: "Tech YouTuber", location: "Perth, AU", rating: 5, content: "I've made 4 purchases now. Every transaction was smooth, crypto payments confirmed quickly, and products are 100% genuine. My go-to electronics store." },
  { name: "Emily C.", initials: "EC", role: "Verified Buyer", location: "Gold Coast, AU", rating: 5, content: "Ordered AirPods and a MacBook. Paid with ETH, got confirmation in 15 minutes, delivered in 4 days. The loyalty program is a nice bonus too!" },
  { name: "David K.", initials: "DK", role: "Verified Buyer", location: "Adelaide, AU", rating: 5, content: "Replaced my entire home office setup through Cryptoelectro. MacBook, monitor, keyboard — all paid with crypto. Saved hundreds compared to retail. Absolutely recommend." },
  { name: "Sarah M.", initials: "SM", role: "Small Business Owner", location: "Canberra, AU", rating: 5, content: "I buy all my business electronics here now. The crypto payments save me forex fees, and the free shipping over $500 is a game changer. Customer support is responsive too." },
  { name: "Ryan P.", initials: "RP", role: "Verified Buyer", location: "Hobart, AU", rating: 4, content: "Bought a Samsung tablet for my daughter. Delivery to Tasmania was faster than expected. Only giving 4 stars because I wish there were more accessory options." },
  { name: "Olivia N.", initials: "ON", role: "Lifestyle Vlogger", location: "Darwin, AU", rating: 5, content: "I promote Cryptoelectro to all my followers. The affiliate program is legit — earned $200 last month just from sharing my link. Products are always authentic." },
  { name: "Tom H.", initials: "TH", role: "Gamer & Streamer", location: "Newcastle, AU", rating: 5, content: "Bought a PS5 with SOL. Payment confirmed in under 2 minutes. The whole process was so smooth I forgot I was spending crypto. This is the future of shopping." },
  { name: "Lauren B.", initials: "LB", role: "Verified Buyer", location: "Sunshine Coast, AU", rating: 5, content: "Finally found a place that accepts USDC. Bought a Nikon camera and lens kit. Everything was brand new, sealed, with Australian warranty. Will be back for more." },
  { name: "Mike R.", initials: "MR", role: "Crypto Trader", location: "Sydney, AU", rating: 4, content: "When crypto pumps, I shop here. Converted some gains into a new laptop. The exchange rate was fair and the order was processed quickly. More categories please!" },
  { name: "Nina G.", initials: "NG", role: "Verified Buyer", location: "Cairns, AU", rating: 5, content: "I was worried about buying expensive electronics online with crypto, but Cryptoelectro proved me wrong. My MacBook Air arrived in perfect condition. The 30-day return policy gives peace of mind." },
  { name: "Ahmed S.", initials: "AS", role: "University Student", location: "Sydney, AU", rating: 5, content: "Best prices I could find for an iPad. Paid with TRX — saved on international card fees. The loyalty points are building up nicely too. Student-friendly pricing would be amazing!" },
  { name: "Jess K.", initials: "JK", role: "Verified Buyer", location: "Christchurch, NZ", rating: 4, content: "Ordered from New Zealand. Took about 10 days but the product was worth the wait. Paid with Bitcoin and everything went smoothly. Would love a NZ warehouse for faster shipping." },
  { name: "Chris B.", initials: "CB", role: "IT Professional", location: "Geelong, AU", rating: 5, content: "As an IT guy, I appreciate that Cryptoelectro lists detailed specs. Bought a Lenovo ThinkPad for work. Paid with USDT, delivered in 3 days. Professional experience all around." },
  { name: "Rachel W.", initials: "RW", role: "Verified Buyer", location: "Wollongong, AU", rating: 5, content: "Gift shopping made easy. Bought my husband the latest Samsung phone for his birthday. He loves it. The gift packaging option would be a nice addition!" },
  { name: "Daniel F.", initials: "DF", role: "Freelancer", location: "Byron Bay, AU", rating: 5, content: "Freelancing in crypto means I need places to spend it. Cryptoelectro is perfect. Upgraded my entire workflow with a MacBook Pro and accessories. Zero issues." },
  { name: "Hannah L.", initials: "HL", role: "Verified Buyer", location: "Melbourne, AU", rating: 5, content: "Customer for 6 months now. Multiple purchases, zero problems. The store credit system is brilliant — I use my referral earnings for discounts. Best crypto marketplace in Australia!" },
  { name: "Liam E.", initials: "LE", role: "Verified Buyer", location: "Sydney, AU", rating: 5, content: "Switched from Amazon to Cryptoelectro and never looked back. Bought a MacBook Pro with USDT — delivered in 2 days. The whole crypto checkout is addictively smooth." },
  { name: "Isabella M.", initials: "IM", role: "Crypto Investor", location: "Melbourne, AU", rating: 5, content: "I cashed out some Ethereum gains to buy an iPad Pro and iPhone. The prices are competitive and paying with crypto means no bank fees. This is how shopping should be." },
  { name: "Noah W.", initials: "NW", role: "Software Developer", location: "Brisbane, AU", rating: 5, content: "As a dev, I love the clean UX and fast crypto payments. Ordered a Dell XPS laptop with Solana — confirmed in seconds. The detailed product specs helped me compare models easily." },
  { name: "Charlotte D.", initials: "CD", role: "Verified Buyer", location: "Perth, AU", rating: 5, content: "First time paying with Bitcoin — I was nervous but the step-by-step checkout made it foolproof. My Samsung tablet arrived in perfect condition. I'm a crypto convert now." },
  { name: "Jack S.", initials: "JS", role: "University Student", location: "Adelaide, AU", rating: 5, content: "Best student-friendly electronics store in Australia. Bought a laptop for uni with TRX — saved on exchange fees compared to using my international card. Fast delivery too." },
  { name: "Ava P.", initials: "AP", role: "Digital Nomad", location: "Gold Coast, AU", rating: 5, content: "I travel between Australia and Bali — Cryptoelectro lets me spend my crypto wherever I am. Ordered noise-canceling headphones, arrived before my flight. Legendary service." },
  { name: "Mason K.", initials: "MK", role: "Crypto Miner", location: "Newcastle, AU", rating: 5, content: "I mine Ethereum and need places to spend it. Cryptoelectro is my go-to. Built a home office with monitors, keyboard, and laptop — all paid with mining rewards. Living the dream." },
  { name: "Mia T.", initials: "MT", role: "Verified Buyer", location: "Canberra, AU", rating: 5, content: "Ordered a Nikon camera for my photography business. Paid with USDT, saved on card processing fees. The camera arrived in 3 days with full Australian warranty. Highly professional." },
  { name: "Lucas H.", initials: "LH", role: "Gamer", location: "Hobart, AU", rating: 5, content: "Bought a gaming monitor and mechanical keyboard with Bitcoin Lightning — transaction was instant. The packaging was bulletproof. This is the future of gaming gear shopping." },
  { name: "Harper J.", initials: "HJ", role: "Small Business Owner", location: "Darwin, AU", rating: 5, content: "I outfit my entire team with electronics from Cryptoelectro. Crypto payments simplify our international procurement. Five MacBooks ordered, five delivered perfectly. Reliable partner." },
  { name: "Elijah R.", initials: "ER", role: "Verified Buyer", location: "Sunshine Coast, AU", rating: 5, content: "The affiliate program caught my eye — referred 3 friends, earned $150 in store credit. Used it to buy AirPods. The ecosystem here is genius. Marketing done right." },
  { name: "Grace L.", initials: "GL", role: "Content Creator", location: "Wollongong, AU", rating: 5, content: "I produce YouTube videos and needed a powerful laptop for editing. Bought a MacBook Pro with Bitcoin — the payment cleared faster than my bank transfer would have. Incredible experience." },
  { name: "James B.", initials: "JB", role: "IT Consultant", location: "Geelong, AU", rating: 5, content: "I recommend Cryptoelectro to all my clients who hold crypto. The selection of business laptops is excellent. Bought 3 ThinkPads for a client project — bulk pricing and fast shipping." },
  { name: "Zoe F.", initials: "ZF", role: "Verified Buyer", location: "Cairns, AU", rating: 5, content: "Remote location, zero issues. Ordered a Samsung phone with TRX — delivered to Far North Queensland in 5 days. The tracking updates kept me informed every step. Impressive logistics." },
  { name: "Oliver G.", initials: "OG", role: "Crypto Trader", location: "Sydney, AU", rating: 5, content: "When Bitcoin pumped, I treated myself to a MacBook Pro. The exchange rate was locked at checkout so I knew exactly how much I was spending. Professional execution throughout." },
  { name: "Ella W.", initials: "EW", role: "Verified Buyer", location: "Melbourne, AU", rating: 5, content: "I love that I can pay with stablecoins like USDC — no volatility worries. Bought an iPhone and Apple Watch. Both genuine, sealed, with Apple warranty. My new favorite store." },
  { name: "Logan M.", initials: "LM", role: "Musician", location: "Brisbane, AU", rating: 5, content: "Bought studio headphones and an audio interface with Ethereum. The crypto payment was smooth — confirmed in under 10 minutes. Gear arrived in perfect condition. Recording this week!" },
  { name: "Isla K.", initials: "IK", role: "Verified Buyer", location: "Perth, AU", rating: 4, content: "Great store with amazing crypto integration. Ordered a laptop and monitor. Only minor complaint — wish there were more gaming accessories. But the core experience is 5-star." },
  { name: "Henry N.", initials: "HN", role: "Engineer", location: "Adelaide, AU", rating: 5, content: "I buy all my work electronics through Cryptoelectro now. The detailed specs help me make informed decisions. Paid with USDT — no currency conversion headaches. Highly recommend." },
  { name: "Sofia A.", initials: "SA", role: "Verified Buyer", location: "Gold Coast, AU", rating: 5, content: "Customer support helped me track a delayed shipment and kept me updated daily. The issue was with the courier, not Cryptoelectro, but they owned it and solved it. True customer care." },
  { name: "William D.", initials: "WD", role: "Startup Founder", location: "Sydney, AU", rating: 5, content: "Equipped our new office with electronics from Cryptoelectro. Paid the whole invoice with USDC — saved hundreds on bank fees and forex. The B2B potential here is enormous." },
  { name: "Chloe P.", initials: "CP", role: "Photographer", location: "Newcastle, AU", rating: 5, content: "Bought a Sony camera and lens kit. The price was better than any retailer in Australia. Paid with Bitcoin — the locked exchange rate meant no surprises. Professional from start to finish." },
  { name: "Alexander T.", initials: "AT", role: "Verified Buyer", location: "Canberra, AU", rating: 5, content: "The loyalty program is underrated. I've earned over $100 in discounts just from regular shopping. Combined with free shipping over $500, it's unbeatable value. My electronics home." },
  { name: "Lily R.", initials: "LR", role: "Student", location: "Hobart, AU", rating: 5, content: "As a student, every dollar counts. Buying with crypto saves me card fees. Got a great deal on an iPad for uni. Fast shipping to Tasmania — arrived before semester started." },
  { name: "Samuel W.", initials: "SW", role: "Crypto Enthusiast", location: "Darwin, AU", rating: 5, content: "I've been waiting for a legitimate Australian store to spend crypto. Cryptoelectro delivers. Bought a gaming console and accessories — the entire process felt like the future." },
  { name: "Grace M.", initials: "GM", role: "Verified Buyer", location: "Sunshine Coast, AU", rating: 5, content: "Ordered a laptop for my daughter's university studies. Paid with Ethereum. The package arrived in beautiful condition. She's thrilled. I'm impressed. We'll be back." },
  { name: "Benjamin K.", initials: "BK", role: "Web Developer", location: "Wollongong, AU", rating: 5, content: "As a web3 developer, I appreciate businesses that embrace crypto. Cryptoelectro walks the walk. Bought a MacBook for development work — paid with USDC. Flawless experience." },
  { name: "Scarlett J.", initials: "SJ", role: "Verified Buyer", location: "Geelong, AU", rating: 5, content: "I was hesitant to spend crypto on physical goods. Cryptoelectro changed my mind. My iPhone arrived in 3 days, exactly as described. The trust factor here is real." },
  { name: "Thomas P.", initials: "TP", role: "Financial Advisor", location: "Cairns, AU", rating: 5, content: "I advise clients on crypto investments — I recommend Cryptoelectro as a legitimate use case for spending crypto. Bought office equipment myself. Seamless from payment to delivery." },
  { name: "Hazel G.", initials: "HG", role: "Verified Buyer", location: "Sydney, AU", rating: 5, content: "The store credit system keeps me coming back. Earned credits from referrals, used them on AirPods Max. The whole ecosystem — crypto, rewards, shipping — just works." },
  { name: "Joshua L.", initials: "JL", role: "Crypto YouTuber", location: "Melbourne, AU", rating: 5, content: "I make videos about spending crypto in real life. Cryptoelectro is my favorite case study. Bought a camera for my channel — paid with Bitcoin. Content and commerce united." },
  { name: "Violet C.", initials: "VC", role: "Verified Buyer", location: "Brisbane, AU", rating: 4, content: "Excellent store with great prices on premium electronics. My only suggestion: add more home appliance options. But the tech selection is top-notch. Will definitely order again." },
  { name: "Ethan R.", initials: "ER", role: "Gamer", location: "Perth, AU", rating: 5, content: "PS5, gaming headset, and controller — all bought with SOL. The crypto payment was so fast I barely had time to second-guess. Delivery to Perth was quicker than expected." },
  { name: "Aria S.", initials: "AS", role: "Verified Buyer", location: "Adelaide, AU", rating: 5, content: "My husband introduced me to Cryptoelectro. I was skeptical about crypto shopping. Now I've made 3 purchases. The process is simpler than using a credit card. Converted skeptic." },
  { name: "Sebastian F.", initials: "SF", role: "Tech Consultant", location: "Gold Coast, AU", rating: 5, content: "I purchase electronics for clients across Australia. Cryptoelectro is now my primary supplier. Crypto payments mean no invoicing delays. The B2B potential is massive." },
  { name: "Evelyn T.", initials: "ET", role: "Verified Buyer", location: "Newcastle, AU", rating: 5, content: "Bought a Samsung tablet for my art projects. Paid with TRX — my first crypto purchase ever. The checkout guide made it easy. Now I'm telling all my friends about it." },
  { name: "Jack L.", initials: "JL", role: "Miner", location: "Canberra, AU", rating: 5, content: "I mine crypto and need legitimate places to spend it. Cryptoelectro is a godsend. Built a gaming rig with mining profits — monitor, keyboard, headset. The circle is complete." },
  { name: "Aurora B.", initials: "AB", role: "Verified Buyer", location: "Hobart, AU", rating: 5, content: "Ordered a MacBook Air for my design work. The crypto payment confirmed in minutes. Delivery to Tassie was faster than expected. The packaging was pristine. Will order again." },
  { name: "Levi M.", initials: "LM", role: "Crypto Investor", location: "Darwin, AU", rating: 5, content: "I've been holding crypto for years — finally a place to actually use it. Bought an iPad and accessories. The experience was so satisfying I immediately planned my next purchase." },
  { name: "Sienna K.", initials: "SK", role: "Verified Buyer", location: "Sunshine Coast, AU", rating: 5, content: "The free shipping over $500 is a brilliant incentive. I always add accessories to hit the threshold. Smart business model. My orders always arrive perfectly packed and on time." },
  { name: "Hudson R.", initials: "HR", role: "IT Manager", location: "Sydney, AU", rating: 5, content: "Sourcing electronics for our office used to be a headache. Cryptoelectro simplified everything. We pay with USDT, get bulk pricing, and everything arrives within a week. Game changer." },
  { name: "Savannah W.", initials: "SW", role: "Verified Buyer", location: "Melbourne, AU", rating: 5, content: "I appreciate the transparency — detailed specs, clear pricing, no hidden fees. Bought a laptop and monitor setup. Everything matched the descriptions perfectly. Trustworthy store." },
  { name: "Oscar P.", initials: "OP", role: "Freelancer", location: "Brisbane, AU", rating: 5, content: "Freelancing pays me in crypto — Cryptoelectro lets me spend it on gear I need. Upgraded my home office with a MacBook and monitor. The ecosystem finally makes sense." },
  { name: "Amelia D.", initials: "AD", role: "Verified Buyer", location: "Perth, AU", rating: 5, content: "I've been burned by online electronics stores before. Cryptoelectro restored my trust. Genuine products, fast shipping, and the crypto payment is a bonus. My new go-to store." },
  { name: "Leo G.", initials: "LG", role: "Blockchain Developer", location: "Adelaide, AU", rating: 5, content: "Finally an e-commerce site that gets crypto. The NowPayments integration is flawless. Bought a development laptop with USDC. This is what mass adoption looks like." },
  { name: "Willow H.", initials: "WH", role: "Verified Buyer", location: "Gold Coast, AU", rating: 5, content: "Ordered headphones and a tablet. Used the affiliate link from a YouTuber I follow — glad they got their commission. The whole ecosystem benefits everyone. Brilliant concept." },
  { name: "Ezra C.", initials: "EC", role: "Day Trader", location: "Newcastle, AU", rating: 5, content: "When I have a good trading day, I treat myself here. Bought a gaming monitor with profits. The crypto payment is instant — no waiting for bank transfers. Pure dopamine." },
  { name: "Ruby L.", initials: "RL", role: "Verified Buyer", location: "Canberra, AU", rating: 5, content: "The return policy gave me confidence to buy. I didn't need it — everything was perfect. But knowing I had 30 days to return made the crypto purchase feel risk-free. Smart policy." },
  { name: "Caleb M.", initials: "CM", role: "Podcast Host", location: "Wollongong, AU", rating: 5, content: "I talk about crypto on my podcast — Cryptoelectro is now my sponsor example. Bought recording equipment with Bitcoin. The case study writes itself. Authentic crypto commerce." },
  { name: "Penelope S.", initials: "PS", role: "Verified Buyer", location: "Geelong, AU", rating: 5, content: "My family thinks I'm crazy for using crypto. Then they saw my new MacBook arrived in 3 days, paid with Bitcoin. Now my brother wants to learn about crypto. Proof is in the delivery." },
  { name: "Dylan T.", initials: "DT", role: "University Lecturer", location: "Cairns, AU", rating: 5, content: "I teach economics — Cryptoelectro is my go-to example of cryptocurrency utility. Bought a laptop for lectures. The real-world use case is exactly what crypto needs." },
  { name: "Luna B.", initials: "LB", role: "Verified Buyer", location: "Sydney, AU", rating: 5, content: "I've ordered 5 times now. iPhone, MacBook, AirPods, watch, and a speaker. Every single order was flawless. The loyalty points have saved me over $200. I'm a customer for life." },
  { name: "Isaac W.", initials: "IW", role: "Crypto Educator", location: "Melbourne, AU", rating: 5, content: "I teach people how to use crypto — I always point them to Cryptoelectro as a real-world example. Bought my own gear here too. Education meets practical application." },
  { name: "Stella K.", initials: "SK", role: "Verified Buyer", location: "Brisbane, AU", rating: 5, content: "The website is clean, fast, and easy to navigate. Product pages have all the specs I need. Crypto checkout is intuitive. Whoever designed this UX understands both e-commerce and crypto." },
  { name: "Gabriel R.", initials: "GR", role: "Software Engineer", location: "Perth, AU", rating: 5, content: "I analyzed the crypto payment flow — it's technically sound. Bought a laptop for coding. The payment confirmed on-chain exactly as expected. Solid engineering behind the scenes." },
  { name: "Layla N.", initials: "LN", role: "Verified Buyer", location: "Adelaide, AU", rating: 4, content: "Great products and fast delivery. Only feedback: I'd love to see more color options on some products. But the core experience — ordering, paying with crypto, delivery — is flawless." },
  { name: "Julian F.", initials: "JF", role: "Trader", location: "Gold Coast, AU", rating: 5, content: "I move between crypto and fiat constantly. Cryptoelectro lets me skip the fiat step entirely. Bought a laptop directly with trading profits. This is the circular crypto economy." },
  { name: "Nora M.", initials: "NM", role: "Verified Buyer", location: "Newcastle, AU", rating: 5, content: "Ordered a phone for my son's birthday. Paid with Ethereum — he thinks it's cool that crypto bought his gift. The phone arrived on time and he hasn't put it down since." },
  { name: "Eliana T.", initials: "ET", role: "Verified Buyer", location: "Canberra, AU", rating: 5, content: "The customer support team is incredibly responsive. I had a question about my order and got a reply within 2 hours. The human touch makes all the difference. Bravo." },
  { name: "Ryder P.", initials: "RP", role: "Esports Player", location: "Hobart, AU", rating: 5, content: "Gaming gear is expensive — crypto makes it easier. Bought a 240Hz monitor and gaming keyboard with USDT. The competitive edge starts with the right equipment. Cryptoelectro delivers." },
  { name: "Naomi J.", initials: "NJ", role: "Verified Buyer", location: "Darwin, AU", rating: 5, content: "Living in Darwin, online shopping can be hit or miss. Cryptoelectro delivered my laptop in 5 days — faster than most stores. The crypto payment was an added bonus. Territory approved." },
  { name: "Camila H.", initials: "CH", role: "Verified Buyer", location: "Sunshine Coast, AU", rating: 5, content: "I love the flash deals section. Got a great discount on a Samsung tablet. Paid with TRX — the low fees make it ideal for shopping. Deals + crypto = unbeatable combination." },
  { name: "Owen S.", initials: "OS", role: "Crypto Miner", location: "Sydney, AU", rating: 5, content: "My mining rig generates crypto — Cryptoelectro lets me convert it directly into electronics. Bought a new GPU and monitor. This is the future of the mining economy." },
  { name: "Aaliyah B.", initials: "AB", role: "Verified Buyer", location: "Melbourne, AU", rating: 5, content: "I compared prices across 5 stores — Cryptoelectro was the best value. Free shipping sealed the deal. My MacBook arrived in perfect condition. Smart shopping pays off." },
  { name: "Nicholas K.", initials: "NK", role: "Tech Reviewer", location: "Brisbane, AU", rating: 5, content: "I review tech products on YouTube. Cryptoelectro is now my supplier for review units. Fast shipping, genuine products, crypto payments. Content creation made easier." },
  { name: "Victoria L.", initials: "VL", role: "Verified Buyer", location: "Perth, AU", rating: 5, content: "The 2-year warranty gives me confidence. Bought a premium laptop knowing I'm covered. The peace of mind is worth as much as the competitive price. Smart value proposition." },
  { name: "Dominic W.", initials: "DW", role: "Investor", location: "Adelaide, AU", rating: 5, content: "I believe in the crypto economy. Every purchase at Cryptoelectro is a vote for decentralized commerce. Bought an iPad — the experience reinforces my conviction. Adoption is happening." },
  { name: "Lillian C.", initials: "LC", role: "Verified Buyer", location: "Gold Coast, AU", rating: 5, content: "Gift shopping season is stressful — Cryptoelectro made it easy. Ordered 3 gifts in one transaction, paid with USDT, all delivered within a week. Christmas sorted in June." },
  { name: "Wyatt M.", initials: "WM", role: "Software Developer", location: "Newcastle, AU", rating: 5, content: "The site loads fast, the API seems solid (I checked), and the payment flow is clean. As a dev, I appreciate good engineering. Bought a MacBook — the experience matches the code quality." },
  { name: "Riley K.", initials: "RK", role: "Verified Buyer", location: "Canberra, AU", rating: 5, content: "I was worried about crypto price volatility during checkout. The locked exchange rate feature is brilliant — no surprises. My iPhone cost exactly what I expected. Honest system." },
  { name: "Samantha T.", initials: "ST", role: "Verified Buyer", location: "Wollongong, AU", rating: 5, content: "My partner and I both use Cryptoelectro now. We've ordered phones, laptops, and accessories. Every experience has been consistent — fast, reliable, and crypto-friendly. Household approved." },
  { name: "Eliot G.", initials: "EG", role: "Crypto Advocate", location: "Geelong, AU", rating: 5, content: "I've onboarded 5 friends to crypto through Cryptoelectro. They buy electronics, learn about wallets, and experience the future of payments. Best onboarding tool in Australia." },
  { name: "Ariana B.", initials: "AB", role: "Verified Buyer", location: "Cairns, AU", rating: 5, content: "Remote area, premium service. My laptop arrived in perfect condition despite the long journey. The tracking kept me informed. If they can deliver here flawlessly, they can deliver anywhere." },
  { name: "Nathaniel P.", initials: "NP", role: "Student", location: "Sydney, AU", rating: 5, content: "Uni student budget means every dollar counts. Crypto savings + free shipping = best deal in Australia. Bought a tablet for lectures — paid with Bitcoin. Future graduate approved." },
  { name: "Addison H.", initials: "AH", role: "Verified Buyer", location: "Melbourne, AU", rating: 5, content: "I've recommended Cryptoelectro to my entire family. My parents even bought a laptop here — and they don't understand crypto. The card payment option makes it accessible to everyone." },
  { name: "Jason L.", initials: "JL", role: "Trader", location: "Brisbane, AU", rating: 5, content: "When altcoins pump, I rotate profits into electronics. Cryptoelectro makes it seamless. Bought a gaming setup after a SOL rally. This is how crypto wealth should be enjoyed." },
  { name: "Aubrey W.", initials: "AW", role: "Verified Buyer", location: "Perth, AU", rating: 5, content: "The product unboxing experience is premium. Everything arrives factory sealed with Australian warranty. Paid with Bitcoin — the premium unboxing matches the premium payment method." },
  { name: "Brandon M.", initials: "BM", role: "IT Support", location: "Adelaide, AU", rating: 5, content: "I fix computers for a living — I know genuine products. Every item from Cryptoelectro has been authentic. Bought parts for a custom build. Professional supplier for professionals." },
  { name: "Natalie K.", initials: "NK", role: "Verified Buyer", location: "Gold Coast, AU", rating: 5, content: "I love the daily deals and flash sales. Bought AirPods at a great price. The crypto payment was the cherry on top. Deals + crypto = my shopping addiction." },
  { name: "Connor P.", initials: "CP", role: "Miner", location: "Newcastle, AU", rating: 5, content: "Mining rig pays for itself through Cryptoelectro. Upgraded my setup with profits. Monitor, GPU, cooling — all bought with mined crypto. The circle of mining life." },
  { name: "Paisley G.", initials: "PG", role: "Verified Buyer", location: "Canberra, AU", rating: 5, content: "I appreciate businesses that accept multiple cryptocurrencies. I used USDT for stability — exactly what I wanted. My laptop arrived quickly. The choice of crypto is a major plus." },
  { name: "Tyler R.", initials: "TR", role: "Blockchain Dev", location: "Hobart, AU", rating: 5, content: "I build dApps and spend my earnings here. Full circle crypto economy. Bought a new laptop for development — paid with USDC. The future of work and shopping is on-chain." },
  { name: "Elena S.", initials: "ES", role: "Verified Buyer", location: "Darwin, AU", rating: 5, content: "Ordered a camera for my photography hobby. Paid with Bitcoin. The whole process from order to delivery was smooth. Now I can capture the beauty of the Northern Territory." },
  { name: "Brody T.", initials: "BT", role: "Entrepreneur", location: "Sunshine Coast, AU", rating: 5, content: "I run an online business — Cryptoelectro is my standard for e-commerce done right. Fast, crypto-native, customer-focused. Bought my office setup here. Leading by example." },
  { name: "Lila M.", initials: "LM", role: "Verified Buyer", location: "Sydney, AU", rating: 5, content: "The mobile experience is flawless. Ordered a phone from my phone while commuting. Paid with TRX — the mobile wallet integration was seamless. Modern shopping at its finest." },
  { name: "Damian K.", initials: "DK", role: "Crypto Journalist", location: "Melbourne, AU", rating: 5, content: "I write about crypto adoption in Australia. Cryptoelectro is the case study I always cite. Bought a laptop for work — the experience validated every article I've written." },
  { name: "Athena P.", initials: "AP", role: "Verified Buyer", location: "Brisbane, AU", rating: 5, content: "My entire friend group now shops here. We share referral codes and earn store credit. It's become a fun game — who can earn the most discounts? Community-driven commerce." },
  { name: "Zachary W.", initials: "ZW", role: "Engineer", location: "Perth, AU", rating: 5, content: "The technical specifications on product pages are detailed and accurate. As an engineer, I appreciate precision. Bought a laptop based on specs — it matched perfectly. No surprises." },
  { name: "Quinn B.", initials: "QB", role: "Verified Buyer", location: "Adelaide, AU", rating: 5, content: "I've tried other crypto electronics stores — Cryptoelectro is the best. Better prices, faster shipping, and the loyalty program is actually rewarding. The competition isn't even close." },
  { name: "Blake H.", initials: "BH", role: "Day Trader", location: "Gold Coast, AU", rating: 5, content: "After a green day, I reward myself with electronics. Cryptoelectro makes the conversion from trading gains to tangible goods instant. Bought a gaming monitor — dopamine double hit." },
  { name: "Valentina R.", initials: "VR", role: "Verified Buyer", location: "Newcastle, AU", rating: 5, content: "The email updates are actually useful — not spammy. I got notified when my order shipped and when it arrived. Just the right amount of communication. Professional experience." },
  { name: "Cole S.", initials: "CS", role: "Gamer", location: "Canberra, AU", rating: 5, content: "Built my dream gaming setup through Cryptoelectro. Monitor, keyboard, mouse, headset — all paid with crypto. Every piece arrived on time. Now I just need to improve my K/D ratio." },
  { name: "Remi W.", initials: "RW", role: "Verified Buyer", location: "Wollongong, AU", rating: 5, content: "I love that I can earn loyalty points on every purchase. After 3 orders, I had enough for a discount on AirPods. The rewards program keeps me coming back. Brilliant retention strategy." },
  { name: "Jasper L.", initials: "JL", role: "Crypto Investor", location: "Geelong, AU", rating: 5, content: "Long-term crypto holder finally spending some gains. Cryptoelectro makes it feel natural. Bought a MacBook Pro — the quality matches the premium payment method. Hodling pays off." },
  { name: "Clara D.", initials: "CD", role: "Verified Buyer", location: "Cairns, AU", rating: 5, content: "Ordered noise-canceling headphones for my flights. Paid with USDT. They arrived before my trip — tested them on the plane, they're perfect. Travel essential acquired via crypto." },
  { name: "Finn M.", initials: "FM", role: "Startup Founder", location: "Sydney, AU", rating: 5, content: "We buy all company electronics through Cryptoelectro. Crypto accounting is simpler for our Web3 startup. The procurement process is streamlined. B2B crypto commerce works." },
  { name: "Ada K.", initials: "AK", role: "Verified Buyer", location: "Melbourne, AU", rating: 5, content: "The checkout process is so simple my grandmother could use it. Select product, choose crypto, scan QR, done. Bought a tablet — the simplicity is the real innovation here." },
  { name: "Kai T.", initials: "KT", role: "Software Dev", location: "Brisbane, AU", rating: 5, content: "I audited the crypto payment flow for fun — it's solid. Bought a laptop for work. The technical implementation matches the user experience. Rare to see in crypto e-commerce." },
  { name: "Ivy R.", initials: "IR", role: "Verified Buyer", location: "Perth, AU", rating: 5, content: "My son wanted a gaming console — I wanted to use my crypto. Cryptoelectro satisfied both. He's gaming, I'm happy with the transaction. Family-friendly crypto shopping." },
  { name: "Parker J.", initials: "PJ", role: "Content Creator", location: "Adelaide, AU", rating: 5, content: "My streaming setup is powered by Cryptoelectro. Camera, microphone, lights — all bought with crypto. The quality of every product has been excellent. Creator economy meets crypto economy." },
  { name: "Emery S.", initials: "ES", role: "Verified Buyer", location: "Gold Coast, AU", rating: 5, content: "The site remembers my preferences and past orders. The personalized experience makes shopping faster. Bought accessories for my MacBook — the recommendations were spot on." },
  { name: "Kingston L.", initials: "KL", role: "Trader", location: "Newcastle, AU", rating: 5, content: "When the market is good, I shop. When the market is bad, I hold. Either way, Cryptoelectro is my store. Bought a tablet during a Bitcoin rally. Trading desk companion acquired." },
  { name: "Amira B.", initials: "AB", role: "Verified Buyer", location: "Canberra, AU", rating: 5, content: "The free shipping threshold of $500 is genius — I always add something small to qualify. Bought a laptop and case together. The bundle deal mindset works on me every time." },
  { name: "Rowan G.", initials: "RG", role: "IT Professional", location: "Hobart, AU", rating: 5, content: "I manage IT procurement for a small company. Cryptoelectro is now our preferred supplier. Crypto payments simplify international orders. The corporate account features would be welcome." },
  { name: "Tessa W.", initials: "TW", role: "Verified Buyer", location: "Darwin, AU", rating: 5, content: "Ordered a tablet for my artwork. The screen quality is amazing — exactly as described. Paid with Bitcoin. Now I can create digital art anywhere in the Territory." },
  { name: "Maverick P.", initials: "MP", role: "Crypto Miner", location: "Sunshine Coast, AU", rating: 5, content: "My mining operation generates crypto 24/7. Cryptoelectro is where I convert it into real-world value. Bought a new mining monitor — the irony is beautiful." },
  { name: "Evie L.", initials: "EL", role: "Verified Buyer", location: "Sydney, AU", rating: 5, content: "I've been shopping here since the beginning. Watched the store grow and improve. The latest updates made checkout even smoother. Loyal customer for life." },
  { name: "Ryland K.", initials: "RK", role: "Blockchain Dev", location: "Melbourne, AU", rating: 5, content: "I contribute to open-source crypto projects. Spending my earnings at Cryptoelectro feels like completing the mission. Bought a laptop for coding. Dogfooding decentralization." },
  { name: "Dakota H.", initials: "DH", role: "Verified Buyer", location: "Brisbane, AU", rating: 5, content: "The product images are high quality and accurate. What you see is what you get. My laptop arrived looking exactly like the photos. No misleading marketing — just honest selling." },
  { name: "Hayden M.", initials: "HM", role: "Freelancer", location: "Perth, AU", rating: 5, content: "International clients pay me in crypto. Cryptoelectro lets me spend it on gear that makes me better at my job. Bought a professional monitor — my freelance work has never looked better." },
  { name: "Makayla T.", initials: "MT", role: "Verified Buyer", location: "Adelaide, AU", rating: 5, content: "I researched crypto-friendly stores for weeks. Cryptoelectro had the best reviews — now I see why. Ordered a phone, got exactly what I paid for. Research rewarded." },
  { name: "Bodhi S.", initials: "BS", role: "Student", location: "Gold Coast, AU", rating: 5, content: "Used my crypto savings to buy a laptop for university. The student discount would be nice, but even without it, the prices beat campus store. Crypto-educated student." },
  { name: "Malia R.", initials: "MR", role: "Verified Buyer", location: "Newcastle, AU", rating: 5, content: "The referral program earned me $50 in store credit. Used it on a phone case and screen protector. The ecosystem rewards loyalty. Smart business model that benefits customers." },
  { name: "Emmett W.", initials: "EW", role: "Crypto Trader", location: "Canberra, AU", rating: 5, content: "I trade multiple cryptocurrencies — Cryptoelectro accepts most of them. Bought a laptop with SOL, monitor with USDT, keyboard with TRX. Multi-asset shopping is the future." },
  { name: "Nova J.", initials: "NJ", role: "Verified Buyer", location: "Wollongong, AU", rating: 5, content: "The packaging is discreet and secure — no one knows there's expensive electronics inside. Smart for delivery security. My MacBook arrived in a plain box. Thieves wouldn't look twice." },
  { name: "Beckett L.", initials: "BL", role: "Podcast Host", location: "Geelong, AU", rating: 5, content: "I bought all my podcast equipment here. Microphone, headphones, interface — one crypto transaction. The setup sounds professional. My listeners can hear the quality." },
  { name: "Zara G.", initials: "ZG", role: "Verified Buyer", location: "Cairns, AU", rating: 5, content: "The loyalty program is my favorite feature. Every purchase earns points, points become discounts. Bought a tablet with loyalty points + crypto. Paid less than retail. Winning." },
  { name: "Holden P.", initials: "HP", role: "Engineer", location: "Sydney, AU", rating: 5, content: "The spec sheets on Cryptoelectro are more detailed than manufacturer websites. As an engineer, I need accurate data. Bought a laptop after thorough comparison. Data-driven purchase." },
  { name: "Journee W.", initials: "JW", role: "Verified Buyer", location: "Melbourne, AU", rating: 5, content: "My crypto portfolio diversified into electronics. Best diversification ever. Now I can see, touch, and use my investments. Bought a MacBook — tangible crypto gains feel amazing." },
  { name: "Legend K.", initials: "LK", role: "Gamer", location: "Brisbane, AU", rating: 5, content: "Built the ultimate gaming cave with Cryptoelectro. 4K monitor, mechanical keyboard, wireless headset — all crypto-funded. My K/D ratio hasn't improved, but my setup looks pro." },
  { name: "Legacy R.", initials: "LR", role: "Verified Buyer", location: "Perth, AU", rating: 5, content: "I tell everyone about Cryptoelectro. Friends, family, coworkers. The crypto payment option is the conversation starter. Bought gifts for everyone last Christmas. Spreading the word." },
  { name: "Phoenix M.", initials: "PM", role: "Crypto Influencer", location: "Adelaide, AU", rating: 5, content: "My followers ask where to spend crypto in Australia. I always link Cryptoelectro. Bought my setup here — authenticity matters when you're an influencer. Practice what you promote." },
  { name: "Wrenley S.", initials: "WS", role: "Verified Buyer", location: "Gold Coast, AU", rating: 5, content: "Ordered a laptop at 10 PM, it shipped next morning. The processing speed is impressive. Paid with USDT — the transaction confirmed while I slept. Woke up to a shipping notification." },
  { name: "Knox T.", initials: "KT", role: "Miner", location: "Newcastle, AU", rating: 5, content: "Mining ETH, spending on gear. The circle of crypto life. Bought a new GPU to expand my mining rig — paid with mining profits. The investment compounds." },
  { name: "Hadley B.", initials: "HB", role: "Verified Buyer", location: "Canberra, AU", rating: 5, content: "The customer service team deserves recognition. They helped me change my shipping address mid-order. Saved my gift surprise. Above and beyond service. Thank you team!" },
  { name: "Sutton L.", initials: "SL", role: "Investor", location: "Hobart, AU", rating: 5, content: "I invest in crypto and e-commerce. Cryptoelectro is what the future looks like. Bought electronics to support the ecosystem. The user experience validates my investment thesis." },
  { name: "Finley W.", initials: "FW", role: "Verified Buyer", location: "Darwin, AU", rating: 5, content: "Remote living means online shopping is essential. Cryptoelectro delivers to the Top End reliably. Bought a laptop and tablet — both arrived in perfect condition. Territory tested." },
  { name: "Royal K.", initials: "RK", role: "Day Trader", location: "Sunshine Coast, AU", rating: 5, content: "When I close a profitable trade, I buy electronics. It's my reward system. Cryptoelectro makes the transition from trading high to shopping high seamless. Dopamine optimization." },
  { name: "Dream M.", initials: "DM", role: "Verified Buyer", location: "Sydney, AU", rating: 5, content: "The store is now my homepage. I check deals daily. Bought so many products I've lost count. Every experience has been 5-star. If there were 6 stars, I'd give 6." },

];

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p className="text-text-primary/50">Loading...</p></div>}>
      <HomeContent />
    </Suspense>
  );
}

function HomeContent() {
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [brands, setBrands] = useState<any[]>([]);
  const [deals, setDeals] = useState<any[]>([]);
  const [customerReviews, setCustomerReviews] = useState<any[]>(defaultReviews);

  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref) window.location.href = `/api/affiliate/track?ref=${ref}`;
  }, [searchParams]);

  useEffect(() => {
    // SEO Homepage
    document.title = "Cryptoelectro-au | Premium Electronics Marketplace – Pay with Crypto or Credit cards";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", "Australia's premium electronics marketplace. Buy smartphones, laptops, cameras, and home appliances with Credit cards, Bitcoin, Ethereum, USDT, TRX, and 100+ cryptocurrencies. Fast shipping Australia-wide.");
    
    fetch("/api/categories").then(r => r.json()).then(d => setCategories(d.categories || []));
    fetch("/api/products?limit=16&featured=true").then(r => r.json()).then(d => setProducts(d.products || []));
    fetch("/api/products?limit=1").then(r => r.json()).then(d => setTotalProducts(d.pagination?.total || 0));
    fetch("/api/brands").then(r => r.json()).then(d => setBrands(d.brands || []));
    fetch("/api/deals").then(r => r.json()).then(d => setDeals(d.deals || []));
    
    // Fetch real testimonials
    fetch("/api/testimonials?limit=2000").then(r => r.json()).then(d => {
  const realReviews = (d.testimonials || []).map((t: any) => ({
    name: `${t.user.firstName} ${t.user.lastName}`,
    initials: `${t.user.firstName?.charAt(0) || ""}${t.user.lastName?.charAt(0) || ""}`,
    role: t.role || null,
    location: t.location || null,
    content: t.content,
    rating: t.rating,
  }));
  
  const mixed = [...realReviews, ...defaultReviews];
  setCustomerReviews(mixed);
}).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen">
      {/* ===== Hero Section ===== */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24 relative">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="text-xs font-body text-accent">Crypto and Credit Card Payments Now Accepted</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-heading font-bold leading-tight">Premium Electronics <span className="text-gradient">for the Modern Age</span></h1>
              <p className="text-base sm:text-lg text-text-primary/60 max-w-lg">Australia&apos;s premier marketplace for high-end electronics. Shop smartphones, cameras, computers, and more. Pay with Credit cards, Bitcoin, Ethereum, USDT, and other cryptocurrencies.</p>
              <div className="flex flex-wrap gap-3 sm:gap-4">
                <Link href="/category/all" className="btn-primary text-sm sm:text-base">Shop Now</Link>
                <Link href="/about" className="btn-secondary text-sm sm:text-base">Learn More</Link>
              </div>
              <div className="flex gap-6 sm:gap-8 pt-2">
                <div><p className="text-xl sm:text-2xl font-heading font-bold text-accent">{totalProducts}+</p><p className="text-xs sm:text-sm text-text-primary/50">Products</p></div>
                <div><p className="text-xl sm:text-2xl font-heading font-bold text-accent">{brands.length}+</p><p className="text-xs sm:text-sm text-text-primary/50">Brands</p></div>
                <div><p className="text-xl sm:text-2xl font-heading font-bold text-accent">24/7</p><p className="text-xs sm:text-sm text-text-primary/50">Support</p></div>
              </div>
            </div>
            <div className="relative hidden lg:grid grid-cols-2 gap-3 xl:gap-4">
              <div className="card overflow-hidden aspect-[3/4] relative group"><div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" /><img src="https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&h=800&fit=crop" alt="Premium Smartphone" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /><div className="absolute bottom-3 left-3 z-20"><span className="badge badge-accent text-xs">Smartphones</span></div></div>
              <div className="card overflow-hidden aspect-[3/4] relative group mt-8"><div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" /><img src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&h=800&fit=crop" alt="Professional Camera" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /><div className="absolute bottom-3 left-3 z-20"><span className="badge badge-accent text-xs">Cameras</span></div></div>
              <div className="card overflow-hidden aspect-[4/3] relative group col-span-2"><div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" /><img src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&h=600&fit=crop" alt="Premium Laptop" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /><div className="absolute bottom-3 left-3 z-20"><span className="badge badge-accent text-xs">Computers</span></div></div>
            </div>
            <div className="lg:hidden grid grid-cols-2 gap-3">
              <div className="card overflow-hidden aspect-square relative"><img src="https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop" alt="Smartphone" className="w-full h-full object-cover" /></div>
              <div className="card overflow-hidden aspect-square relative"><img src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop" alt="Laptop" className="w-full h-full object-cover" /></div>
            </div>
          </div>
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
      </section>

      {/* ===== Categories Bento Grid ===== */}
      <section className="py-12 sm:py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12"><h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold">Shop by <span className="text-gradient">Category</span></h2><p className="mt-3 sm:mt-4 text-sm sm:text-base text-text-primary/50 max-w-lg mx-auto px-4">Explore our curated selection of premium electronics across multiple categories</p></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 auto-rows-fr">
            {categories.slice(0, 6).map((cat, index) => (<CategoryCard key={cat.id} category={cat} index={index} />))}
          </div>
        </div>
      </section>

      {/* ===== Featured Products ===== */}
      <section className="py-12 sm:py-16 lg:py-24 bg-secondary-dark/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8 sm:mb-12">
            <div><h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold">Featured <span className="text-gradient">Products</span></h2><p className="mt-2 text-sm sm:text-base text-text-primary/50">Handpicked premium electronics just for you</p></div>
            <Link href="/category/all" className="btn-outline text-sm whitespace-nowrap">View All Products</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {products.slice(0, 16).map((product: any, index: number) => (<ProductCard key={product.id} product={product} index={index} />))}
          </div>
        </div>
      </section>

      {/* ===== Flash Deals ===== */}
      {deals.length > 0 && (
        <section className="py-12 sm:py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8 sm:mb-12">
              <div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold"> Flash <span className="text-gradient">Deals</span></h2>
                <p className="mt-2 text-sm sm:text-base text-text-primary/50">Limited time offers — grab them before they&apos;re gone!</p>
              </div>
              <Link href="/deals" className="btn-outline text-sm whitespace-nowrap">View All Deals</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {deals.slice(0, 4).map((deal: any) => {
                const product = { ...deal.product, price: Number(deal.dealPrice), compareAtPrice: Number(deal.product.price), isNew: true };
                return <ProductCard key={deal.id} product={product} />;
              })}
            </div>
          </div>
        </section>
      )}

      {/* ===== Customer Reviews ===== */}
      <section className="py-12 sm:py-16 lg:py-24 bg-secondary-dark/30 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-12">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold">What Our <span className="text-gradient">Customers Say</span></h2>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base text-text-primary/50 max-w-lg mx-auto">Real reviews from real crypto shoppers</p>
          </div>
        </div>
        <div className="relative">
          <div className="flex gap-4 animate-scroll" style={{ width: "max-content" }}>
            {[...customerReviews, ...customerReviews, ...customerReviews].map((review, i) => (
              <div key={`${review.name}-${i}`} className="card p-5 w-[340px] flex-shrink-0">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                    <span className="text-sm font-heading font-bold text-accent">{review.initials}</span>
                  </div>
                  <div>
                    <p className="text-sm font-heading font-semibold">{review.name}</p>
                    {review.role && <p className="text-xs text-text-primary/40">{review.role}</p>}
                  </div>
                </div>
                <div className="flex gap-1 mb-2">
                  {[1,2,3,4,5].map(s => (
                    <svg key={s} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={s <= review.rating ? "currentColor" : "none"} stroke="currentColor" className={`w-3.5 h-3.5 ${s <= review.rating ? "text-warning" : "text-text-primary/20"}`}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                    </svg>
                  ))}
                </div>
                <p className="text-xs text-text-primary/60 leading-relaxed line-clamp-4 mb-3 whitespace-normal">&ldquo;{review.content}&rdquo;</p>
                {review.location && (
                  <div className="text-xs text-text-primary/30 pt-3 border-t border-secondary-light">{review.location}</div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="text-center mt-8">
          <Link href="/testimonials" className="btn-outline text-sm">View All Reviews</Link>
        </div>
      </section>

      {/* ===== Trusted Brands ===== */}
      <section className="py-12 sm:py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold">Trusted <span className="text-gradient">Brands</span></h2>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base text-text-primary/50 max-w-lg mx-auto px-4">We partner with the world&apos;s leading electronics manufacturers</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
            {brands.map((brand: any) => (
              <Link
                key={brand.id}
                href={`/category/all?brand=${brand.slug}`}
                className="card flex flex-col items-center justify-between p-4 sm:p-5 gap-0 group min-h-[150px] sm:min-h-[170px] hover:border-accent/30 transition-all"
              >
                <div className="flex-1 flex items-center justify-center w-full group-hover:scale-110 transition-transform duration-300">
                  {brand.slug === "samsung" && (
                    <svg viewBox="0 0 120 24" className="w-full max-w-[90px] h-auto" fill="currentColor" style={{color:"#1428A0"}}>
                      <text x="0" y="20" fontFamily="Arial,sans-serif" fontSize="22" fontWeight="900">SAMSUNG</text>
                    </svg>
                  )}
                  {brand.slug === "apple" && (
                    <svg viewBox="0 0 24 24" className="w-7 h-7 sm:w-9 sm:h-9" fill="currentColor" style={{color:"#000"}}>
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                    </svg>
                  )}
                  {brand.slug === "sony" && (
                    <svg viewBox="0 0 80 24" className="w-full max-w-[70px] h-auto" fill="currentColor" style={{color:"#000"}}>
                      <text x="0" y="20" fontFamily="Arial,sans-serif" fontSize="22" fontWeight="900">SONY</text>
                    </svg>
                  )}
                  {brand.slug === "lg" && (
                    <svg viewBox="0 0 48 24" className="w-full max-w-[44px] h-auto" fill="currentColor">
                      <circle cx="12" cy="12" r="11" fill="#A50034"/>
                      <text x="12" y="17" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="11" fontWeight="900" fill="#FFF">LG</text>
                    </svg>
                  )}
                  {brand.slug === "dell" && (
                    <svg viewBox="0 0 80 24" className="w-full max-w-[70px] h-auto" fill="currentColor" style={{color:"#007DB8"}}>
                      <text x="0" y="20" fontFamily="Arial,sans-serif" fontSize="22" fontWeight="900">DELL</text>
                    </svg>
                  )}
                  {brand.slug === "lenovo" && (
                    <svg viewBox="0 0 100 24" className="w-full max-w-[85px] h-auto" fill="currentColor" style={{color:"#E2231A"}}>
                      <text x="0" y="20" fontFamily="Arial,sans-serif" fontSize="22" fontWeight="900">Lenovo</text>
                    </svg>
                  )}
                  {brand.slug === "hp" && (
                    <svg viewBox="0 0 80 24" className="w-full max-w-[55px] h-auto" fill="currentColor" style={{color:"#0096D6"}}>
                      <text x="0" y="20" fontFamily="Arial,sans-serif" fontSize="22" fontWeight="900">HP</text>
                    </svg>
                  )}
                  {brand.slug === "nikon" && (
                    <svg viewBox="0 0 100 24" className="w-full max-w-[85px] h-auto">
                      <rect x="2" y="2" width="96" height="20" rx="3" fill="#000"/>
                      <text x="50" y="17" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="14" fontWeight="900" fill="#FFDE00">Nikon</text>
                    </svg>
                  )}
                  {brand.slug === "dyson" && (
                    <svg viewBox="0 0 80 24" className="w-full max-w-[75px] h-auto" fill="currentColor" style={{color:"#000"}}>
                      <text x="0" y="20" fontFamily="Arial,sans-serif" fontSize="22" fontWeight="900">dyson</text>
                    </svg>
                  )}
                  {brand.slug === "microsoft" && (
                    <svg viewBox="0 0 24 24" className="w-7 h-7 sm:w-9 sm:h-9">
                      <rect x="1" y="1" width="10" height="10" fill="#F25022"/>
                      <rect x="13" y="1" width="10" height="10" fill="#7FBA00"/>
                      <rect x="1" y="13" width="10" height="10" fill="#00A4EF"/>
                      <rect x="13" y="13" width="10" height="10" fill="#FFB900"/>
                    </svg>
                  )}
                  {brand.slug === "nintendo" && (
                    <svg viewBox="0 0 120 24" className="w-full max-w-[105px] h-auto" fill="currentColor" style={{color:"#E60012"}}>
                      <text x="0" y="20" fontFamily="Arial,sans-serif" fontSize="22" fontWeight="900">NINTENDO</text>
                    </svg>
                  )}
                </div>
                <span className="text-xs sm:text-sm font-body text-text-primary/60 group-hover:text-accent transition-colors text-center leading-tight mt-2">
                  {brand.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Crypto CTA ===== */}
      <section className="py-12 sm:py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card p-6 sm:p-8 lg:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-accent/10 via-transparent to-accent/10" />
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-accent/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-accent/10 rounded-full blur-3xl" />
            <div className="relative z-10 max-w-2xl mx-auto space-y-4 sm:space-y-6">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold">Ready to Pay with <span className="text-gradient">Crypto or Credit Cards?</span></h2>
              <p className="text-sm sm:text-base text-text-primary/60">Experience the future of shopping. Secure, fast, and borderless payments with Credit Cards, Bitcoin, Ethereum, USDT, and 100+ cryptocurrencies.</p>
              <div className="flex flex-wrap justify-center gap-2 sm:gap-3 pt-2"><span className="badge badge-accent text-xs sm:text-sm">💳 Credit Cards</span><span className="badge badge-accent text-xs sm:text-sm">₿ Bitcoin</span><span className="badge badge-accent text-xs sm:text-sm">Ξ Ethereum</span><span className="badge badge-accent text-xs sm:text-sm">₮ USDT</span><span className="badge badge-accent text-xs sm:text-sm">+100 More</span></div>
              <div className="pt-4"><Link href="/category/all" className="btn-primary">Start Shopping</Link></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}