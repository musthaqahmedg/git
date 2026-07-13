'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface Task {
  id: string;
  title: string;
  description: string;
  pickup_location: string;
  dropoff_location: string;
  budget: number;
  status: string;
  created_at: string;
}

interface Driver {
  id: string;
  vehicle_type: string;
  vehicle_number: string;
  rate_per_km: number;
  accepted_jobs_count: number;
  completed_jobs_count: number;
}

export default function DriverDashboard() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [driver, setDriver] = useState<Driver | null>(null);
  const [acceptedJobs, setAcceptedJobs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        // Check auth
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
          router.push('/auth?type=driver');
          return;
        }

        // Get driver profile
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id')
          .eq('auth_id', user.id)
          .single();

        if (userError) throw userError;

        const { data: driverData, error: driverError } = await supabase
          .from('drivers')
          .select('*')
          .eq('user_id', userData.id)
          .single();

        if (driverError) throw driverError;
        setDriver(driverData);

        // Get open tasks
        const { data: tasksData, error: tasksError } = await supabase
          .from('tasks')
          .select('*')
          .eq('status', 'open')
          .eq('service_type', 'driver')
          .order('created_at', { ascending: false });

        if (tasksError) throw tasksError;
        setTasks(tasksData || []);

        // Get accepted jobs by this driver
        const { data: acceptedData, error: acceptedError } = await supabase
          .from('job_acceptances')
          .select('task_id')
          .eq('driver_id', driverData.id);

        if (acceptedError) throw acceptedError;
        setAcceptedJobs(acceptedData?.map((a) => a.task_id) || []);

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();

    // Subscribe to new tasks
    const subscription = supabase
      .channel('tasks')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'tasks', filter: 'status=eq.open' },
        (payload) => {
          setTasks((prev) => [payload.new as Task, ...prev]);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  const handleAcceptJob = async (taskId: string) => {
    if (!driver) return;

    try {
      const { error } = await supabase
        .from('job_acceptances')
        .insert({
          task_id: taskId,
          driver_id: driver.id,
        });

      if (error) throw error;
      setAcceptedJobs((prev) => [...prev, taskId]);
    } catch (err: any) {
      alert('Error accepting job: ' + err.message);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) {
    return <div className="container"><p>Loading...</p></div>;
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', marginBottom: '30px' }}>
        <div>
          <h1 style={{ fontSize: '28px', marginBottom: '4px' }}>🚗 Driver Dashboard</h1>
          {driver && (
            <p style={{ color: '#aaa', fontSize: '14px' }}>
              {driver.vehicle_type} · {driver.vehicle_number} · ₹{driver.rate_per_km}/km
            </p>
          )}
        </div>
        <button onClick={handleSignOut} style={{ background: '#666' }}>Sign Out</button>
      </div>

      {error && <div className="error" style={{ marginBottom: '20px', padding: '10px', background: '#4a2020', borderRadius: '4px' }}>{error}</div>}

      {driver && (
        <div className="grid-2" style={{ marginBottom: '30px' }}>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>{driver.accepted_jobs_count}</div>
            <div style={{ fontSize: '12px', color: '#aaa' }}>Jobs Accepted</div>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>{driver.completed_jobs_count}</div>
            <div style={{ fontSize: '12px', color: '#aaa' }}>Jobs Completed</div>
          </div>
        </div>
      )}

      <h2 className="card-title">Available Tasks</h2>

      {tasks.length === 0 ? (
        <div className="card">
          <p style={{ color: '#aaa', textAlign: 'center' }}>No open tasks. Check back later!</p>
        </div>
      ) : (
        tasks.map((task) => (
          <div key={task.id} className="task-item">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
              <div style={{ flex: 1 }}>
                <div className="task-title">{task.title}</div>
                {task.description && (
                  <p style={{ fontSize: '14px', color: '#aaa', marginBottom: '8px' }}>{task.description}</p>
                )}
                <div style={{ fontSize: '13px', color: '#aaa', marginBottom: '4px' }}>
                  📍 {task.pickup_location}
                </div>
                {task.dropoff_location && (
                  <div style={{ fontSize: '13px', color: '#aaa', marginBottom: '8px' }}>
                    → {task.dropoff_location}
                  </div>
                )}
              </div>
              <div style={{ textAlign: 'right', marginLeft: '12px' }}>
                <div className="task-budget">₹{task.budget}</div>
                <div style={{ fontSize: '12px', color: '#aaa', marginTop: '4px' }}>
                  {new Date(task.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>

            {acceptedJobs.includes(task.id) ? (
              <div className="badge success">You accepted this job</div>
            ) : (
              <button
                onClick={() => handleAcceptJob(task.id)}
                style={{ width: '100%' }}
              >
                Accept Job
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}
