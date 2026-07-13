# Palakkad Marketplace

Two-sided marketplace connecting drivers with customers in Palakkad.

## Features

- **Driver Dashboard** — See customer ride requests, accept jobs, track completed rides
- **Customer Dashboard** — Post ride requests, see interested drivers, book directly
- **Phone OTP + Email Login** — Two authentication options
- **Payment Integration** — Razorpay payment processing with commission tracking
- **Real-time Updates** — Jobs and tasks update in real-time
- **Commission Model** — App takes 10% commission (configurable)

## Tech Stack

- **Frontend:** Next.js 14, React, TypeScript
- **Backend:** Next.js API Routes
- **Database:** Supabase (PostgreSQL)
- **Payment:** Razorpay
- **Auth:** Supabase Auth (Phone OTP + Email/Password)

## Setup Instructions

### 1. Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (free tier works)
- Razorpay account (for payment processing)

### 2. Clone & Install

```bash
cd palakkad-marketplace
npm install
```

### 3. Supabase Setup

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. In your project, go to **SQL Editor** and run the SQL from `schema.sql` to create all tables
4. Copy your **Project URL** and **Anon Key** from Settings → API

### 4. Environment Variables

Create `.env.local` in project root:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret

NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 5. Razorpay Setup

1. Sign up at [razorpay.com](https://razorpay.com)
2. Go to Settings → API Keys
3. Copy your Key ID and Secret
4. Add to `.env.local`

### 6. Enable Phone Auth (Supabase)

1. Go to Supabase Dashboard → Authentication → Providers
2. Enable **Phone Auth**
3. For testing, use Twilio (you'll need account) or Firebase phone testing

### 7. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 8. Test the App

**For Drivers:**
- Go to [http://localhost:3000/auth?type=driver](http://localhost:3000/auth?type=driver)
- Sign up with phone or email
- Add vehicle details
- See customer ride requests

**For Customers:**
- Go to [http://localhost:3000/auth?type=customer](http://localhost:3000/auth?type=customer)
- Sign up with phone or email
- Post a ride request
- See drivers who accept

## Deployment

### Deploy to Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

Follow the prompts. Add environment variables in Vercel dashboard.

### Deploy to Other Platforms

1. **Railway.app** — Easy with Vercel file structure
2. **Render.com** — Supports Next.js
3. **Heroku** — Works but needs buildpack

## Database Structure

### Tables

- `users` — All users (drivers + customers)
- `drivers` — Driver details (vehicle, rate, ratings)
- `tasks` — Customer ride requests
- `job_acceptances` — Driver accepts task
- `payments` — Payment records with commission tracking

## API Routes

- `POST /api/payment/create-order` — Create Razorpay order
- `POST /api/payment/verify` — Verify payment and update status

## Key Features to Implement Next

1. **Driver location tracking** — GPS integration
2. **Rating system** — After ride completion
3. **Chat between driver & customer** — Real-time messaging
4. **Payment payout to drivers** — Scheduled payouts
5. **Admin dashboard** — Analytics & commission tracking
6. **Mobile app** — Flutter/React Native version
7. **Expand to other services** — Plumber, electrician, etc.

## Commission Model

- Default: **10% commission** on each ride
- Driver gets: **90%** of ride amount
- Configurable in payment verification

## Troubleshooting

**Phone OTP not working?**
- Make sure phone auth is enabled in Supabase
- For local testing, use email login instead
- In production, configure Twilio or Firebase

**Razorpay payment failing?**
- Check API keys in `.env.local`
- Test mode: use test keys from Razorpay dashboard
- Verify webhook configuration

**Real-time updates not working?**
- Check Supabase realtime is enabled on tables
- Verify RLS policies allow read/write

## License

MIT
