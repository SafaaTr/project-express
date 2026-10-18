import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import AuthForm from '../components/AuthForm';
import { API_ENDPOINTS } from '../services/api.js'

export default function Register() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); 

  const handleRegister = async (formData) => {
    setError('');
    setLoading(true);

    try {
      const response = await fetch(API_ENDPOINTS.register, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to register');
      }

      alert('Account created successfully! Please log in.');
      navigate('/login'); 
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return <AuthForm type="register" onSubmit={handleRegister} error={error} loading={loading} />;
}