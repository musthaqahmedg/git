'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function CustomerDashboard() {
  const router = useRouter();
  const [serviceType, setServiceType] = useState('');
  const [location, setLocation] = useState('');
  const [pay, setPay] = useState('');

  const handlePostJob = async (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Job posted: ${serviceType} at ${location} for ₹${pay}`);
    // TODO: Call API to save job
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Customer Dashboard</h1>
      
      <form onSubmit={handlePostJob} className="bg-gray-800 p-6 rounded-lg max-w-md">
        <h2 className="text-xl font-bold mb-4">Post a Job</h2>
        <input type="text" placeholder="Service Type" value={serviceType} onChange={(e) => setServiceType(e.target.value)} className="w-full mb-4 p-2 rounded bg-gray-700" required />
        <input type="text" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full mb-4 p-2 rounded bg-gray-700" required />
        <input type="number" placeholder="Price (₹)" value={pay} onChange={(e) => setPay(e.target.value)} className="w-full mb-4 p-2 rounded bg-gray-700" required />
        <button type="submit" className="w-full bg-green-600 p-2 rounded hover:bg-green-700">Post Job</button>
      </form>
    </div>
  );
}
