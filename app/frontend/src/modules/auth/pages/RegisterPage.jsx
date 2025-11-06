import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Text } from '@mantine/core';
import { useAuth } from '../../../context/useAuth';
import AuthLayout from '../components/AuthLayout';
import RegisterForm from '../components/RegisterForm';


const RegisterPage = () => {
  
  const { register, error, clearError, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/profile', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleRegister = async (values) => {
    try {
      await register(values);
    } 
    catch (err) {
      console.error('Registration failed:', err);
    }
  };

  const loginLink = (
    <Link to="/login" style={{ textDecoration: 'none' }}>
      <Text component="span" color="blue" weight={500}>
        Sign in
      </Text>
    </Link>
  );

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Already have an account?"
      linkComponent={loginLink}
    >
      <RegisterForm
        onSubmit={handleRegister}
        loading={loading}
        error={error}
        onClearError={clearError}
      />
    </AuthLayout>
  );
};

export default RegisterPage;
