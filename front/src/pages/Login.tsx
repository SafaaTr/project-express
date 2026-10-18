import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import AuthForm from '../components/AuthForm';
import { API_ENDPOINTS } from '../services/api.js';

export default function Login() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (formData) => {
    setError('');
    setLoading(true);

    try {
      const response = await fetch(API_ENDPOINTS.login, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to login');
      }

      // التوكن موجود داخل data.data.accessToken باستجابة السيرفر
      login(data.data.accessToken);
      navigate('/posts');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return <AuthForm type="login" onSubmit={handleLogin} error={error} loading={loading} />;
}