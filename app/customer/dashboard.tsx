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
  user_id: string;
  vehicle_type: string;
  vehicle_number: string;
  rate_per_km: number;
}

interface JobAcceptance {
  id: string;
  task_id: string;
  driver_id: string;
  driver: Driver;
}

export default function CustomerDashboard() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [drivers, setDrivers] = useState<Map<string, Driver>>(new Map());
  const [acceptances, setAcceptances] = useState<JobAcceptance[]>([]);
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [budget, setBudget] = useState('');

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        // Check auth
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
          router.push('/auth?type=customer');
          return;
        }

        // Get user ID
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id')
          .eq('auth_id', user.id)
          .single();

        if (userError) throw userError;
        setUserId(userData.id);

        // Get customer's tasks
        const { data: tasksData, error: tasksError } = await supabase
          .from('tasks')
          .select('*')
          .eq('customer_id', userData.id)
          .order('created_at', { ascending: false });

        if (tasksError) throw tasksError;
        setTasks(tasksData || []);

        // Get job acceptances
        const { data: acceptancesData, error: acceptancesError } = await supabase
          .from('job_acceptances')
          .select(`
            id,
            task_id,
            driver_id,
            drivers (
              id,
              user_id,
              vehicle_type,
              vehicle_number,
              rate_per_km
            )
          `)
          .in('task_id', tasksData?.map((t) => t.id) || []);

        if (acceptancesError) throw acceptancesError;

        setAcceptances(acceptancesData || []);

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [router]);

  const handlePostTask = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !pickupLocation || !budget) {
      setError('Title, location, and budget required');
      return;
    }

    setPosting(true);
    try {
      const { error } = await supabase
        .from('tasks')
        .insert({
          customer_id: userId,
          service_type: 'driver',
          title,
          description,
          pickup_location: pickupLocation,
          dropoff_location: dropoffLocation || null,
          budget: parseFloat(budget),
          status: 'open',
        });

      if (error) throw error;

      setTitle('');
      setDescription('');
      setPickupLocation('');
      setDropoffLocation('');
      setBudget('');
      setShowForm(false);
      setError('');

      // Reload tasks
      const { data: tasksData } = await supabase
        .from('tasks')
        .select('*')
        .eq('customer_id', userId)
        .order('created_at', { ascending: false });

      setTasks(tasksData || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setPosting(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const getAcceptancesForTask = (taskId: string) => {
    return acceptances.filter((a) => a.task_id === taskId);
  };

  if (loading) {
    return <div className="container"><p>Loading...</p></div>;
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '28px' }}>📍 Customer Dashboard</h1>
        <button onClick={handleSignOut} style={{ background: '#666' }}>Sign Out</button>
      </div>

      {error && <div className="error" style={{ marginBottom: '20px', padding: '10px', background: '#4a2020', borderRadius: '4px' }}>{error}</div>}

      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          style={{ marginBottom: '30px', background: '#10b981' }}
        >
          + Post New Task
        </button>
      ) : (
        <form onSubmit={handlePostTask} className="card" style={{ marginBottom: '30px' }}>
          <h2 className="card-title">Post a Ride Request</h2>

          <div className="form-group">
            <label>Task Title</label>
            <input
              type="text"
              placeholder="e.g., Need ride to airport"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Description (optional)</label>
            <textarea
              placeholder="Any details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ minHeight: '80px' }}
            />
          </div>

          <div className="form-group">
            <label>Pickup Location</label>
            <input
              type="text"
              placeholder="Your location in Palakkad"
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Dropoff Location (optional)</label>
            <input
              type="text"
              placeholder="Destination"
              value={dropoffLocation}
              onChange={(e) => setDropoffLocation(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Budget (₹)</label>
            <input
              type="number"
              placeholder="e.g., 200"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" disabled={posting} style={{ flex: 1 }}>
              {posting ? 'Posting...' : 'Post Task'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              style={{ flex: 1, background: '#333' }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <h2 className="card-title">Your Tasks</h2>

      {tasks.length === 0 ? (
        <div className="card">
          <p style={{ color: '#aaa', textAlign: 'center' }}>No tasks yet. Post one to get started!</p>
        </div>
      ) : (
        tasks.map((task) => {
          const taskAcceptances = getAcceptancesForTask(task.id);
          return (
            <div key={task.id} className="card">
              <div style={{ marginBottom: '16px' }}>
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
                <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                  <span className="badge">{task.status}</span>
                  <div className="task-budget">₹{task.budget}</div>
                </div>
              </div>

              {taskAcceptances.length > 0 ? (
                <>
                  <h3 style={{ fontSize: '14px', fontWeight: 600, marginTop: '16px', marginBottom: '12px', paddingTop: '16px', borderTop: '1px solid #333' }}>
                    Drivers interested ({taskAcceptances.length})
                  </h3>
                  {taskAcceptances.map((acceptance) => {
                    const driver = acceptance.drivers || acceptance.driver;
                    return (
                      <div key={acceptance.id} style={{
                        background: '#0a0a0a',
                        padding: '12px',
                        borderRadius: '6px',
                        marginBottom: '8px',
                        border: '1px solid #333',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '4px' }}>
                            {driver?.vehicle_type?.toUpperCase()} - {driver?.vehicle_number}
                          </div>
                          <div style={{ fontSize: '12px', color: '#aaa' }}>
                            ₹{driver?.rate_per_km}/km
                          </div>
                        </div>
                        <button
                          onClick={() => alert('Call driver: ' + driver?.user_id)}
                          style={{ fontSize: '12px', padding: '6px 12px' }}
                        >
                          Contact
                        </button>
                      </div>
                    );
                  })}
                </>
              ) : (
                <div style={{ color: '#aaa', fontSize: '13px', fontStyle: 'italic', paddingTop: '12px', borderTop: '1px solid #333', marginTop: '16px' }}>
                  Waiting for drivers to accept...
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
