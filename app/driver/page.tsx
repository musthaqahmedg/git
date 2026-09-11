'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface Job {
  id: string;
  service_type: string;
  location: string;
  pay: number;
  customer_name: string;
  status: string;
}

export default function DriverDashboard() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch('/api/jobs/list');
        if (res.ok) {
          const data = await res.json();
          setJobs(data.jobs || []);
        }
      } catch (err) {
        console.error('Failed to fetch jobs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleAcceptJob = (jobId: string) => {
    alert(`Job ${jobId} accepted!`);
    // TODO: Call API to accept job
  };

  const handleLogout = () => {
    // TODO: Clear session and redirect to login
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Driver Dashboard</h1>
        <button onClick={handleLogout} className="bg-red-600 px-4 py-2 rounded hover:bg-red-700">
          Logout
        </button>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg mb-6">
        <h2 className="text-xl font-bold mb-4">Available Jobs</h2>
        {loading ? (
          <p>Loading jobs...</p>
        ) : jobs.length === 0 ? (
          <p className="text-gray-400">No jobs available right now</p>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div key={job.id} className="bg-gray-700 p-4 rounded flex justify-between items-center">
                <div>
                  <p className="font-bold">{job.service_type}</p>
                  <p className="text-gray-300">{job.location}</p>
                  <p className="text-green-400 font-bold">₹{job.pay}</p>
                </div>
                <button
                  onClick={() => handleAcceptJob(job.id)}
                  className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"
                >
                  Accept Job
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
