# NearHand - Local Service Marketplace

Book drivers, plumbers, electricians and more near you in Palakkad, Kerala, or find work close to home.

(Formerly "GIT Marketplace". The brand name NearHand was checked against the Indian trademark registry in classes 9, 35 and 42, with no existing marks found.)

## 🚀 Features

- **Accounts** - Sign up and log in as a customer or a worker
- **Post a job** - Customers choose a service, say where, set a price, describe the job, list what to bring, and add photos
- **Find work** - Workers see open jobs nearby, newest first, and accept them
- **Mobile-first design** - Built for phones first, in paddy green and turmeric yellow
- **Commission model** - The platform earns 20% on each transaction

## 🛠️ Tech Stack

- **Frontend:** Next.js 16, React 19, Tailwind CSS 4
- **Backend:** Next.js API Routes, Supabase
- **Database:** PostgreSQL (Supabase), with row level security
- **Storage:** Supabase Storage for job photos
- **Payments:** Razorpay (test mode)
- **Deployment:** Vercel

## 📱 Live Demo

https://git-two-delta.vercel.app

## 🎯 Current Progress

✅ User authentication (signup/login)
✅ Customer job posting
✅ Worker job list and job acceptance
✅ New NearHand design
✅ Security clean-up (new API keys, locked-down tables)
🔄 Job descriptions and photos (built, in testing)
🔄 Payment integration (coming soon)
🔄 Separate customer and worker accounts (coming soon)

## 📰 Latest Update (27/11/2026)

✅ Chose the new brand name **NearHand** after a trademark check
✅ Upgraded to Next.js 16 and React 19
✅ Moved to Supabase's new API keys and switched off the old ones
✅ Locked the jobs table so only the server can change jobs
✅ Redesigned every screen as NearHand, mobile-first
✅ Customers can now really post jobs, and workers can really accept them
✅ Built job descriptions, "what to bring" and photo uploads (on the `upgrade/latest-stack` branch, in testing)

**Next up:**
1. Test photo uploads, then put them live
2. Make a new Razorpay test secret
3. Separate customer and worker accounts
4. Payments with Razorpay

## 📰 Previous Update (25/11/2026)

✅ Resumed the Supabase database after inactivity
✅ Verified driver login works on production
✅ Driver dashboard loads all available jobs
✅ Brand name research: "Get It Done" is already in use

## 👨‍💻 How to Run

1. Clone: `git clone https://github.com/musthaqahmedg/git`
2. Install: `npm install`
3. Add your Supabase and Razorpay keys to `.env.local` (never commit this file)
4. Run: `npm run dev`

## 📝 Author

Musthaq Ahmed - Full Stack Developer
