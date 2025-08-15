import axios from 'axios';
import { useState, useEffect, useRef } from 'react';

// Configuration for API endpoint
const getApiBaseUrl = () => {
  const hostIp = localStorage.getItem('host_ip');
  return hostIp ? `http://${hostIp}/api` : null;
};

const App = () => {
  const [view, setView] = useState('login'); // Controls current view: 'login', 'tracker', or 'receive'
  const [hostIP, setHostIP] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userGroup, setUserGroup] = useState('');
  const [gpsRecords, setGpsRecords] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState('Initializing GPS Tracker...');
  const [isTracking, setIsTracking] = useState(false); // Tracks if GPS collection is active
  const gpsIntervalRef = useRef(null); // Store interval ID for cleanup

  // Clean host IP to remove http:// or https:// and trailing slashes
  const cleanHostIp = (input) => {
    return input.replace(/^https?:\/\//, '').replace(/\/+$/, '');
  };

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const cleanedHostIp = cleanHostIp(hostIP);
    const apiUrl = `http://${cleanedHostIp}/api/token/`;

    try {
      const response = await axios.post(apiUrl, { username, password });
      const { access, refresh } = response.data;
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      localStorage.setItem('host_ip', cleanedHostIp);
      setIsLoading(false);
      setHostIP('');
      setUsername('');
      setPassword('');
      setView('tracker'); // Move to GPSTracker view
    } catch (err) {
      setIsLoading(false);
      setError(err.response?.data?.detail || 'Login failed. Please check your credentials or host IP.');
    }
  };

  // Send GPS data to backend
  const sendGPSData = async (gpsData) => {
    const apiBaseUrl = getApiBaseUrl();
    if (!apiBaseUrl) {
      setStatus('Error: Host IP not set. Please log in again.');
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No access token found. Please log in.');
      }

      await axios.post(`${apiBaseUrl}/gpslocations/`, gpsData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      localStorage.removeItem('gpsData');
      setStatus('GPS data sent successfully');
    } catch (error) {
      setStatus(`Error sending GPS data: ${error.message}`);
      localStorage.setItem('gpsData', JSON.stringify(gpsData));
    }
  };

  // Start GPS tracking
  const startGPSTracking = () => {
    setIsTracking(true);
    setStatus('Starting GPS tracking...');
  };

  // Stop GPS tracking
  const stopGPSTracking = () => {
    setIsTracking(false);
    setStatus('GPS tracking stopped');
    if (gpsIntervalRef.current) {
      console.log('Clearing GPS interval'); // Debug log
      clearInterval(gpsIntervalRef.current);
      gpsIntervalRef.current = null;
    }
  };

  // Periodic GPS capture
  useEffect(() => {
    if (isTracking) {
      console.log('Starting GPS interval'); // Debug log
      gpsIntervalRef.current = setInterval(() => {
        console.log('Attempting GPS capture'); // Debug log
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const gpsData = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              altitude: position.coords.altitude || null,
              accuracy: position.coords.accuracy || null,
            };
            localStorage.setItem('gpsData', JSON.stringify(gpsData));
            setStatus(`GPS data captured: (${gpsData.latitude}, ${gpsData.longitude})`);
            console.log('GPS data:', gpsData); // Debug log
            sendGPSData(gpsData);
          },
          (error) => {
            setStatus(`Geolocation error: ${error.message}`);
            console.log('Geolocation error:', error); // Debug log
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
      }, 5000); // Every 5 seconds
    }

    return () => {
      if (gpsIntervalRef.current) {
        console.log('Clearing GPS interval'); // Debug log
        clearInterval(gpsIntervalRef.current);
        gpsIntervalRef.current = null;
      }
    };
  }, [isTracking]);

  // Fetch GPS records
  const fetchGPSRecords = async () => {
    const apiBaseUrl = getApiBaseUrl();
    if (!apiBaseUrl) {
      setError('Host IP not set. Please log in again.');
      setGpsRecords([]);
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No access token found. Please log in.');
      }

      setIsLoading(true);
      const response = await axios.get(`${apiBaseUrl}/gpslocations/latest`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { user_group: userGroup || undefined },
      });

      setGpsRecords(response.data);
      setError('');
      console.log('Fetched GPS records:', response.data); // Debug log
    } catch (err) {
      setError(err.message || 'Failed to fetch GPS records.');
      setGpsRecords([]);
      console.log('Fetch error:', err); // Debug log
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch records every 10 seconds if in 'receive' view
  useEffect(() => {
    let fetchInterval;
    if (view === 'receive' && userGroup) {
      fetchGPSRecords(); // Initial fetch
      console.log('Starting fetch interval'); // Debug log
      fetchInterval = setInterval(fetchGPSRecords, 10000); // Every 10 seconds
    }
    return () => {
      if (fetchInterval) {
        console.log('Clearing fetch interval'); // Debug log
        clearInterval(fetchInterval);
      }
    };
  }, [view, userGroup]);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('host_ip');
    localStorage.removeItem('gpsData');
    setView('login');
    setUserGroup('');
    setGpsRecords([]);
    setError('');
    setStatus('Initializing GPS Tracker...');
    setIsTracking(false);
    if (gpsIntervalRef.current) {
      console.log('Clearing GPS interval'); // Debug log
      clearInterval(gpsIntervalRef.current);
      gpsIntervalRef.current = null;
    }
  };

  // Render Login View
  const renderLogin = () => (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h2>Login to GPS Tracker</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="hostIP">Host IP</label>
          <input
            type="text"
            id="hostIP"
            value={hostIP}
            onChange={(e) => setHostIP(e.target.value)}
            placeholder="Enter host IP (e.g., 209.97.164.73:8000)"
            style={{ width: '100%', padding: '8px', marginTop: '5px', border: '1px solid #ddd' }}
            required
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            style={{ width: '100%', padding: '8px', marginTop: '5px', border: '1px solid #ddd' }}
            required
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            style={{ width: '100%', padding: '8px', marginTop: '5px', border: '1px solid #ddd' }}
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: isLoading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            cursor: isLoading ? 'not-allowed' : 'pointer',
          }}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );

  // Render GPSTracker View
  const renderTracker = () => (
    <div style={{ padding: '20px', textAlign: 'center', maxWidth: '400px', margin: '0 auto' }}>
      <h2>GPS Tracker</h2>
      <p>{status}</p>
      <button
        onClick={startGPSTracking}
        disabled={isTracking}
        style={{
          width: '100%',
          padding: '10px',
          backgroundColor: isTracking ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          cursor: isTracking ? 'not-allowed' : 'pointer',
          marginTop: '10px',
        }}
      >
        {isTracking ? 'Tracking...' : 'Start GPS Tracking'}
      </button>
      <button
        onClick={stopGPSTracking}
        disabled={!isTracking}
        style={{
          width: '100%',
          padding: '10px',
          backgroundColor: !isTracking ? '#ccc' : '#ffc107',
          color: 'white',
          border: 'none',
          cursor: !isTracking ? 'not-allowed' : 'pointer',
          marginTop: '10px',
        }}
      >
        Stop GPS Tracking
      </button>
      <button
        onClick={() => setView('receive')}
        disabled={!isTracking}
        style={{
          width: '100%',
          padding: '10px',
          backgroundColor: !isTracking ? '#ccc' : '#28a745',
          color: 'white',
          border: 'none',
          cursor: !isTracking ? 'not-allowed' : 'pointer',
          marginTop: '10px',
        }}
      >
        View Other Users' Positions
      </button>
      <button
        onClick={handleLogout}
        style={{
          width: '100%',
          padding: '10px',
          backgroundColor: '#dc3545',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          marginTop: '10px',
        }}
      >
        Logout
      </button>
    </div>
  );

  // Render GPSReceive View
  const renderReceive = () => (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>GPS Info Recording (React)</h2>
      <p>Tracking Status: {status}</p>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={(e) => { e.preventDefault(); fetchGPSRecords(); }}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="userGroup">User Group</label>
          <input
            type="text"
            id="userGroup"
            value={userGroup}
            onChange={(e) => setUserGroup(e.target.value)}
            placeholder="Enter user group"
            style={{ width: '100%', padding: '8px', marginTop: '5px', border: '1px solid #ddd' }}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: isLoading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            cursor: isLoading ? 'not-allowed' : 'pointer',
          }}
        >
          {isLoading ? 'Fetching...' : 'Fetch Records'}
        </button>
      </form>
      <h3 style={{ marginTop: '20px' }}>GPS Records</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>User</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Latitude</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Longitude</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Timestamp</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Altitude</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Accuracy</th>
          </tr>
        </thead>
        <tbody>
          {gpsRecords.length > 0 ? (
            gpsRecords.map((record) => (
              <tr key={record.username}>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{record.username || 'N/A'}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{record.latitude}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{record.longitude}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  {new Date(record.timestamp).toLocaleString()}
                </td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{record.altitude ?? 'N/A'}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{record.accuracy ?? 'N/A'}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center', padding: '8px' }}>
                No records available
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <button
        onClick={() => setView('tracker')}
        style={{
          width: '100%',
          padding: '10px',
          backgroundColor: '#17a2b8',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          marginTop: '10px',
        }}
      >
        Back to Tracking
      </button>
      <button
        onClick={handleLogout}
        style={{
          width: '100%',
          padding: '10px',
          backgroundColor: '#dc3545',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          marginTop: '10px',
        }}
      >
        Logout
      </button>
    </div>
  );

  // Render based on current view
  return (
    <div>
      {view === 'login' && renderLogin()}
      {view === 'tracker' && renderTracker()}
      {view === 'receive' && renderReceive()}
    </div>
  );
};

export default App;