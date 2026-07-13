'use client';

export default function Home() {
  return (
    <div className="container">
      <div style={{
        textAlign: 'center',
        paddingTop: '60px',
        paddingBottom: '60px'
      }}>
        <h1 style={{
          fontSize: '48px',
          fontWeight: 'bold',
          marginBottom: '20px',
          color: '#fff'
        }}>
          Palakkad Marketplace
        </h1>

        <p style={{
          fontSize: '20px',
          color: '#aaa',
          marginBottom: '40px',
          maxWidth: '600px',
          margin: '0 auto 40px'
        }}>
          Drivers find jobs. Customers fix tasks. Direct connection. No middleman.
        </p>

        <div className="grid-2" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="card">
            <h2 style={{ fontSize: '24px', marginBottom: '12px', color: '#fff' }}>
              🚗 For Drivers
            </h2>
            <p style={{ color: '#aaa', marginBottom: '20px' }}>
              Login and see all customer ride requests in Palakkad. Accept jobs, get customer contact, negotiate price.
            </p>
            <a href="/auth?type=driver">
              <button style={{ width: '100%' }}>Find Your Job</button>
            </a>
          </div>

          <div className="card">
            <h2 style={{ fontSize: '24px', marginBottom: '12px', color: '#fff' }}>
              📍 For Customers
            </h2>
            <p style={{ color: '#aaa', marginBottom: '20px' }}>
              Post your ride request. See drivers who accept. Pay safely via Razorpay. Get connected.
            </p>
            <a href="/auth?type=customer">
              <button style={{ width: '100%' }}>Fix Your Task</button>
            </a>
          </div>
        </div>

        <div style={{
          marginTop: '60px',
          paddingTop: '40px',
          borderTop: '1px solid #333',
          color: '#aaa'
        }}>
          <h3 style={{ color: '#fff', marginBottom: '20px' }}>How it works</h3>
          <div className="grid-2" style={{ maxWidth: '900px', margin: '0 auto', fontSize: '14px' }}>
            <div>
              <p style={{ marginBottom: '8px' }}><strong>For Drivers:</strong></p>
              <ol style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
                <li>Sign up with phone or email</li>
                <li>Add vehicle details (type, number, rate)</li>
                <li>See all customer requests on map</li>
                <li>Accept jobs you want</li>
                <li>Call customer, negotiate, complete ride</li>
                <li>Get paid (app takes small commission)</li>
              </ol>
            </div>
            <div>
              <p style={{ marginBottom: '8px' }}><strong>For Customers:</strong></p>
              <ol style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
                <li>Sign up with phone or email</li>
                <li>Post your ride request</li>
                <li>See drivers who accept</li>
                <li>Choose and call driver directly</li>
                <li>Complete ride</li>
                <li>Pay via secure payment</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
