'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { SERVICES } from '@/lib/config';

export default function AuthPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const userType = searchParams.get('type') || 'provider';
  const selectedService = searchParams.get('service') || 'driver';

  const [step, setStep] = useState<'service-select' | 'email' | 'signup'>('service-select');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [serviceType, setServiceType] = useState(selectedService);
  const [serviceDetails, setServiceDetails] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailSignUp = async () => {
    if (!email || !password) {
      setError('Email and password required');
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
      setStep('signup');
      setError('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!name) {
      setError('Name required');
      return;
    }

    setLoading(true);
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('No user');

      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert({
          auth_id: user.data.user.id,
          user_type: userType,
          name,
          phone: email,
          email: email,
          service_type: userType === 'provider' ? serviceType : null,
          location: 'palakkad',
        })
        .select()
        .single();

      if (userError) throw userError;

      if (userType === 'provider') {
        const { error: providerError } = await supabase
          .from('service_providers')
          .insert({
            user_id: userData.id,
            service_type: serviceType,
            service_details: serviceDetails,
          });

        if (providerError) throw providerError;
      }

      router.push(userType === 'provider' ? '/provider/dashboard' : '/customer/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '400px',
        width: '100%',
        background: '#1a1a1a',
        padding: '40px',
        borderRadius: '12px',
        border: '1px solid #333',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <h1 style={{ marginBottom: '8px', fontSize: '24px', color: '#fff' }}>
          🎯 Get It Done
        </h1>
        <p style={{ color: '#aaa', marginBottom: '30px', fontSize: '14px' }}>
          {userType === 'provider' ? 'Find jobs in your field' : 'Find service providers'}
        </p>

        {error && <div className="error" style={{ marginBottom: '20px', padding: '10px', background: '#4a2020', borderRadius: '4px', fontSize: '13px' }}>{error}</div>}

        {step === 'service-select' && userType === 'provider' && (
          <>
            <label style={{ display: 'block', marginBottom: '12px', fontWeight: '500', color: '#fff' }}>Select Your Service</label>
            <select 
              value={serviceType} 
              onChange={(e) => setServiceType(e.target.value)}
              style={{ width: '100%', marginBottom: '20px' }}
            >
              {SERVICES.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            <button
              onClick={() => setStep('email')}
              style={{ width: '100%' }}
            >
              Continue
            </button>
          </>
        )}

        {step === 'email' && (
          <>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Password (min 6 characters)</label>
              <input
                type="password"
                placeholder="••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              onClick={handleEmailSignUp}
              disabled={loading}
              style={{ width: '100%' }}
            >
              {loading ? 'Signing up...' : 'Sign Up'}
            </button>
            <button
              onClick={() => setStep(userType === 'provider' ? 'service-select' : 'email')}
              style={{ width: '100%', marginTop: '10px', background: '#333' }}
            >
              Back
            </button>
          </>
        )}

        {step === 'signup' && (
          <>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {userType === 'provider' && (
              <>
                <div className="form-group">
                  <label>Hourly Rate (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g., 300"
                    value={serviceDetails.rate || ''}
                    onChange={(e) => setServiceDetails({ ...serviceDetails, rate: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Years of Experience</label>
                  <input
                    type="number"
                    placeholder="e.g., 5"
                    value={serviceDetails.experience || ''}
                    onChange={(e) => setServiceDetails({ ...serviceDetails, experience: e.target.value })}
                  />
                </div>
              </>
            )}

            <button
              onClick={handleSignUp}
              disabled={loading}
              style={{ width: '100%' }}
            >
              {loading ? 'Creating account...' : 'Complete Sign Up'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
