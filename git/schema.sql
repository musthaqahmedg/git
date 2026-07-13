-- Users table (drivers and customers)
create table users (
  id uuid primary key default gen_random_uuid(),
  auth_id uuid references auth.users(id) on delete cascade,
  user_type text not null check (user_type in ('driver', 'customer')),
  name text not null,
  phone text not null unique,
  email text,
  created_at timestamp default now()
);

-- Driver details
create table drivers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  vehicle_type text not null, -- "bike", "auto", "car", "cab"
  vehicle_number text,
  rate_per_km numeric,
  is_available boolean default true,
  accepted_jobs_count int default 0,
  completed_jobs_count int default 0,
  rating numeric default 0,
  created_at timestamp default now()
);

-- Tasks (customer posts)
create table tasks (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references users(id) on delete cascade,
  service_type text not null default 'driver', -- "driver", "plumber", "electrician", etc. (for future)
  title text not null,
  description text,
  pickup_location text,
  dropoff_location text,
  preferred_date timestamp,
  budget numeric,
  status text default 'open' check (status in ('open', 'accepted', 'completed', 'cancelled')),
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- Job acceptances (driver accepts a task)
create table job_acceptances (
  id uuid primary key default gen_random_uuid(),
  task_id uuid references tasks(id) on delete cascade,
  driver_id uuid references drivers(id) on delete cascade,
  status text default 'accepted' check (status in ('accepted', 'in_progress', 'completed', 'cancelled')),
  accepted_at timestamp default now(),
  completed_at timestamp,
  final_amount numeric,
  created_at timestamp default now()
);

-- Payments
create table payments (
  id uuid primary key default gen_random_uuid(),
  job_acceptance_id uuid references job_acceptances(id) on delete cascade,
  razorpay_order_id text,
  razorpay_payment_id text,
  razorpay_signature text,
  amount numeric not null,
  commission_amount numeric,
  driver_amount numeric,
  status text default 'pending' check (status in ('pending', 'success', 'failed')),
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- Enable real-time
alter publication supabase_realtime add table tasks;
alter publication supabase_realtime add table job_acceptances;
alter publication supabase_realtime add table payments;

-- Indexes for performance
create index idx_tasks_customer_id on tasks(customer_id);
create index idx_tasks_status on tasks(status);
create index idx_drivers_user_id on drivers(user_id);
create index idx_job_acceptances_task_id on job_acceptances(task_id);
create index idx_job_acceptances_driver_id on job_acceptances(driver_id);
create index idx_payments_job_acceptance_id on payments(job_acceptance_id);
