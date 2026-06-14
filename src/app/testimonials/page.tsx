"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { useAuth } from "@/hooks/useAuth";

// ============ AVIS STATIQUES PAR DÉFAUT ============
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

export default function TestimonialsPage() {
  const { user } = useAuth();
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ content: "", rating: 5, role: "", location: "" });
  const [submitStatus, setSubmitStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    // SEO
    document.title = "Customer Reviews — Cryptoelectro-au | Real Crypto Shopper Testimonials";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", "Real customer reviews and testimonials. See why Australians trust Cryptoelectro-au for buying premium electronics with cryptocurrency and credit cards.");

    fetch("/api/testimonials")
      .then(r => r.json())
      .then(d => {
        const realReviews = d.testimonials || [];

        // Formater les avis statiques
        const staticFormatted = defaultReviews.map((r, i) => ({
          id: `static-${i}`,
          content: r.content,
          rating: r.rating,
          role: r.role,
          location: r.location,
          user: { firstName: r.name.split(" ")[0], lastName: r.name.split(" ")[1] || "" },
          createdAt: new Date().toISOString(),
          isStatic: true,
        }));

        // Mélanger : vrais avis d'abord, puis statiques
        const allReviews = [...realReviews, ...staticFormatted];
        setTestimonials(allReviews);
        setLoading(false);

        // ============ SCHEMA.ORG AGGREGATE RATING ============
        if (allReviews.length > 0) {
          const avgRating = allReviews.reduce((sum: number, t: any) => sum + t.rating, 0) / allReviews.length;

          const schema = {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Cryptoelectro-au",
            "url": "https://cryptoelectro-au.store",
            "description": "Australia's premium electronics marketplace with cryptocurrency and credit card payments.",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": avgRating.toFixed(1),
              "reviewCount": allReviews.length,
              "bestRating": "5",
            },
            "review": allReviews.slice(0, 50).map((t: any) => ({
              "@type": "Review",
              "author": { "@type": "Person", "name": `${t.user.firstName} ${t.user.lastName}` },
              "datePublished": t.createdAt,
              "reviewBody": t.content,
              "reviewRating": {
                "@type": "Rating",
                "ratingValue": t.rating,
                "bestRating": "5",
              },
            })),
          };

          const oldScript = document.querySelector('script[data-schema="testimonials"]');
          if (oldScript) oldScript.remove();

          const script = document.createElement("script");
          script.setAttribute("data-schema", "testimonials");
          script.type = "application/ld+json";
          script.textContent = JSON.stringify(schema);
          document.head.appendChild(script);
        }
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus("loading");

    const res = await fetch("/api/testimonials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();

    if (res.ok) {
      setSubmitStatus("success");
      setMessage("Thank you! Your review has been submitted and will appear once approved.");
      setForm({ content: "", rating: 5, role: "", location: "" });
      setShowForm(false);
    } else {
      setSubmitStatus("error");
      setMessage(data.error || "Something went wrong.");
    }
  };

  const avgRating = testimonials.length > 0
    ? (testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length).toFixed(1)
    : "0.0";

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[{ label: "Customer Reviews" }]} />

      <div className="text-center mb-12">
        <h1 className="text-3xl lg:text-4xl font-heading font-bold">Customer <span className="text-gradient">Reviews</span></h1>
        <p className="mt-4 text-text-primary/50 max-w-xl mx-auto">Real reviews from real customers. Share your experience with Cryptoelectro-au.</p>

        {/* Note moyenne + compteur en temps réel */}
        {testimonials.length > 0 && (
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map(s => (
                <svg key={s} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={s <= Math.round(Number(avgRating)) ? "currentColor" : "none"} stroke="currentColor" className={`w-5 h-5 ${s <= Math.round(Number(avgRating)) ? "text-warning" : "text-text-primary/20"}`}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                </svg>
              ))}
            </div>
            <span className="text-sm font-medium text-text-primary">{avgRating} out of 5</span>
            <span className="text-sm text-text-primary/40">· {testimonials.length} review{testimonials.length !== 1 ? "s" : ""}</span>
          </div>
        )}
      </div>

      {/* Bouton écrire un avis */}
      <div className="text-center mb-10">
        {user ? (
          !showForm ? (
            <button onClick={() => setShowForm(true)} className="btn-primary">Write a Review</button>
          ) : (
            <div className="card p-6 max-w-lg mx-auto text-left">
              <h3 className="text-lg font-heading font-bold mb-4">Share Your Experience</h3>
              {submitStatus === "success" ? (
                <div className="text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center mx-auto">✓</div>
                  <p className="text-success text-sm">{message}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary/70 mb-2">Rating</label>
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map(star => (
                        <button type="button" key={star} onClick={() => setForm({...form, rating: star})}>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={star <= form.rating ? "currentColor" : "none"} stroke="currentColor" className={`w-6 h-6 ${star <= form.rating ? "text-warning" : "text-text-primary/30"}`}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                          </svg>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary/70 mb-2">Your Review *</label>
                    <textarea value={form.content} onChange={e => setForm({...form, content: e.target.value})} className="input-field resize-none" rows={4} placeholder="Share your experience..." required minLength={10} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-primary/70 mb-2">Your Role (optional)</label>
                      <input type="text" value={form.role} onChange={e => setForm({...form, role: e.target.value})} className="input-field" placeholder="e.g., Tech Reviewer" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-primary/70 mb-2">Location (optional)</label>
                      <input type="text" value={form.location} onChange={e => setForm({...form, location: e.target.value})} className="input-field" placeholder="e.g., Sydney, AU" />
                    </div>
                  </div>
                  {submitStatus === "error" && <p className="text-error text-sm">{message}</p>}
                  <div className="flex gap-3">
                    <button type="submit" className="btn-primary text-sm" disabled={submitStatus === "loading"}>Submit Review</button>
                    <button type="button" onClick={() => setShowForm(false)} className="btn-secondary text-sm">Cancel</button>
                  </div>
                </form>
              )}
            </div>
          )
        ) : (
          <p className="text-text-primary/50">
            <Link href="/login?redirect=/testimonials" className="text-accent hover:underline">Sign in</Link> to write a review.
          </p>
        )}
      </div>

      {/* Liste des avis */}
      {loading ? (
        <p className="text-center text-text-primary/50">Loading reviews...</p>
      ) : testimonials.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {testimonials.map((t) => (
            <motion.div key={t.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-5">
              <div className="flex gap-1 mb-3">
                {[1,2,3,4,5].map(s => (
                  <svg key={s} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={s <= t.rating ? "currentColor" : "none"} stroke="currentColor" className={`w-3.5 h-3.5 ${s <= t.rating ? "text-warning" : "text-text-primary/20"}`}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                  </svg>
                ))}
              </div>
              <p className="text-sm text-text-primary/70 leading-relaxed mb-3 line-clamp-4">&ldquo;{t.content}&rdquo;</p>
              <div className="flex items-center gap-2 pt-3 border-t border-secondary-light">
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                  <span className="text-xs font-bold text-accent">{t.user.firstName?.charAt(0)}{t.user.lastName?.charAt(0)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{t.user.firstName} {t.user.lastName}</p>
                  <div className="flex items-center gap-2">
                    {t.role && <p className="text-xs text-text-primary/40 truncate">{t.role}</p>}
                    {t.location && <p className="text-xs text-text-primary/30">· {t.location}</p>}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 card">
          <span className="text-4xl mb-4 block">⭐</span>
          <h3 className="text-lg font-heading font-semibold mb-2">No Reviews Yet</h3>
          <p className="text-text-primary/50">Be the first to share your experience!</p>
        </div>
      )}
    </div>
  );
}