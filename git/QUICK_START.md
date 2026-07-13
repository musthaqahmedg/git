# Quick Start - Do This NOW

## Step 1: Create Free Accounts (10 minutes)

### Supabase (Database)
1. Go to https://supabase.com
2. Click "Sign Up" (use email)
3. Create a new project (name: "palakkad-marketplace")
4. Wait for it to initialize (2-3 min)
5. Go to Settings → API
6. Copy **Project URL** and **Anon Public Key**

### Razorpay (Payments)
1. Go to https://razorpay.com
2. Sign up (use email)
3. Go to Settings → API Keys
4. Copy **Key ID** and **Secret**
5. For testing, use Test Mode keys first

## Step 2: Setup Database (10 minutes)

1. In Supabase, go to SQL Editor (left sidebar)
2. Create a new query
3. Copy ALL the SQL from `schema.sql` file
4. Paste into Supabase SQL Editor
5. Click "Run" (green button)
6. Wait for tables to be created

## Step 3: Setup Your Local Code (15 minutes)

1. Open the `palakkad-marketplace` folder in terminal
2. Run: `npm install` (wait 2-3 min)
3. Create `.env.local` file with this:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id_here
RAZORPAY_KEY_SECRET=your_razorpay_secret_here

NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

(Replace with actual values from step 1)

## Step 4: Run Locally (2 minutes)

1. In terminal: `npm run dev`
2. Open http://localhost:3000
3. You should see the homepage with two buttons

## Step 5: Test the App (10 minutes)

### Test as Driver:
1. Click "Driver Login"
2. Enter phone number (or use email)
3. Enter OTP (check Supabase Email tab in console)
4. Fill vehicle details
5. You'll see a dashboard with no tasks (empty)

### Test as Customer:
1. Click "Customer Login" (new browser tab)
2. Sign up
3. Click "+ Post New Task"
4. Fill: Title, pickup location, budget
5. Click "Post Task"
6. Go back to driver tab, refresh
7. You should see your posted task!

### Driver Accepts Job:
1. In driver tab, click "Accept Job"
2. Go to customer tab
3. Refresh dashboard
4. You'll see the driver who accepted!

## Step 6: Deploy to Vercel (15 minutes)

1. Go to https://vercel.com
2. Sign up with GitHub (link your GitHub account first)
3. Click "New Project"
4. Select this repo
5. Add environment variables (from `.env.local`)
6. Click Deploy

Your app will be live at: `your-project.vercel.app`

## Troubleshooting Quick Fixes

**"Cannot find module @supabase"**
→ Run `npm install`

**Phone OTP not received**
→ For local testing, use Email login instead
→ Razorpay/Supabase phone auth needs Twilio (paid)

**Blank page**
→ Check browser console (F12) for errors
→ Check `.env.local` has correct values

**Payment not working**
→ Make sure using Test mode keys from Razorpay
→ Check API keys in `.env.local`

## What Happens Next

1. **MVP is live** — Drivers and customers can find each other
2. **Add features** — Chat, ratings, analytics
3. **Expand services** — Add plumber, electrician, etc.
4. **Scale marketing** — WhatsApp groups, word of mouth

## Need Help?

- Check README.md for detailed docs
- All code is in the files created
- API routes are in `app/api/`
- Dashboards are in `app/driver/` and `app/customer/`

---

**You're building a real marketplace. This actually works. Start now. 🚀**
