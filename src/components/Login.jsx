
import axios from 'axios';
import { useState } from 'react';

const Login = ({ onLoginSuccess }) => {
  const [hostIP, setHostIP] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Clean host IP to remove http:// or https:// and trailing slashes
  const cleanHostIp = (input) => {
    return input.replace(/^https?:\/\//, '').replace(/\/+$/, '');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const cleanedHostIp = cleanHostIp(hostIP);
    const apiUrl = `http://${cleanedHostIp}/api/token/`;

    try {
      const response = await axios.post(apiUrl, {
        username,
        password,
      });

      const { access, refresh } = response.data;
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      localStorage.setItem('host_ip', cleanedHostIp); // Store host IP for other components
      setIsLoading(false);
      setHostIP('');
      setUsername('');
      setPassword('');
      onLoginSuccess();
    } catch (err) {
      setIsLoading(false);
      setError(err.response?.data?.detail || 'Login failed. Please check your credentials or host IP.');
    }
  };

  return (
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
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            required
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)} // Fixed syntax error
            placeholder="Enter username"
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
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
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
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
};

export default Login;
