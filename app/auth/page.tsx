'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const userType = searchParams.get('type') || 'driver';

  const [step, setStep] = useState<'login-method' | 'phone-otp' | 'email' | 'signup'>('login-method');
  const [authMethod, setAuthMethod] = useState<'phone' | 'email'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [ratePerKm, setRatePerKm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePhoneSignUp = async () => {
    if (!phone || phone.length < 10) {
      setError('Enter valid phone number');
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({ phone });
      if (error) throw error;
      setStep('phone-otp');
      setError('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneOtpVerify = async () => {
    if (!otp || otp.length < 6) {
      setError('Enter valid OTP');
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        phone,
        token: otp,
        type: 'sms',
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

      // Create user profile
      const { error: userError } = await supabase
        .from('users')
        .insert({
          auth_id: user.data.user.id,
          user_type: userType,
          name,
          phone: phone || email,
          email: email || null,
        });

      if (userError) throw userError;

      // If driver, create driver profile
      if (userType === 'driver') {
        if (!vehicleType || !vehicleNumber || !ratePerKm) {
          setError('Vehicle details required');
          setLoading(false);
          return;
        }

        const { data: userData, error: getUserError } = await supabase
          .from('users')
          .select('id')
          .eq('auth_id', user.data.user.id)
          .single();

        if (getUserError) throw getUserError;

        const { error: driverError } = await supabase
          .from('drivers')
          .insert({
            user_id: userData.id,
            vehicle_type: vehicleType,
            vehicle_number: vehicleNumber,
            rate_per_km: parseFloat(ratePerKm),
          });

        if (driverError) throw driverError;
      }

      router.push(userType === 'driver' ? '/driver/dashboard' : '/customer/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div style={{
        maxWidth: '400px',
        margin: '60px auto',
        background: '#1a1a1a',
        padding: '40px',
        borderRadius: '8px',
        border: '1px solid #333'
      }}>
        <h1 style={{ marginBottom: '8px', fontSize: '24px' }}>
          {userType === 'driver' ? '🚗 Driver Login' : '📍 Customer Login'}
        </h1>
        <p style={{ color: '#aaa', marginBottom: '30px', fontSize: '14px' }}>
          {userType === 'driver' ? 'Find jobs near you' : 'Post your ride request'}
        </p>

        {error && <div className="error" style={{ marginBottom: '20px', padding: '10px', background: '#4a2020', borderRadius: '4px' }}>{error}</div>}

        {step === 'login-method' && (
          <>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              <button
                onClick={() => { setAuthMethod('phone'); setStep('phone-otp'); }}
                style={{
                  flex: 1,
                  background: authMethod === 'phone' ? '#2563eb' : '#333',
                  color: '#fff'
                }}
              >
                Phone OTP
              </button>
              <button
                onClick={() => { setAuthMethod('email'); setStep('email'); }}
                style={{
                  flex: 1,
                  background: authMethod === 'email' ? '#2563eb' : '#333',
                  color: '#fff'
                }}
              >
                Email
              </button>
            </div>
          </>
        )}

        {step === 'phone-otp' && (
          <>
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <button
              onClick={handlePhoneSignUp}
              disabled={loading}
              style={{ width: '100%' }}
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
            <button
              onClick={() => setStep('login-method')}
              style={{ width: '100%', marginTop: '10px', background: '#333' }}
            >
              Back
            </button>
          </>
        )}

        {step === 'phone-otp' && phone && (
          <>
            <div className="form-group" style={{ marginTop: '20px' }}>
              <label>OTP</label>
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value.slice(0, 6))}
                maxLength={6}
              />
            </div>
            <button
              onClick={handlePhoneOtpVerify}
              disabled={loading}
              style={{ width: '100%' }}
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
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
              <label>Password</label>
              <input
                type="password"
                placeholder="Min 6 characters"
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
              onClick={() => setStep('login-method')}
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

            {userType === 'driver' && (
              <>
                <div className="form-group">
                  <label>Vehicle Type</label>
                  <select value={vehicleType} onChange={(e) => setVehicleType(e.target.value)}>
                    <option value="">Select vehicle</option>
                    <option value="bike">Bike</option>
                    <option value="auto">Auto</option>
                    <option value="car">Car</option>
                    <option value="cab">Cab</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Vehicle Number</label>
                  <input
                    type="text"
                    placeholder="KL01AB1234"
                    value={vehicleNumber}
                    onChange={(e) => setVehicleNumber(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Rate per km (₹)</label>
                  <input
                    type="number"
                    placeholder="15"
                    value={ratePerKm}
                    onChange={(e) => setRatePerKm(e.target.value)}
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
