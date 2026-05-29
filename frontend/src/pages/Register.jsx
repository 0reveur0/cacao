
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const RegisterContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  animation: ${fadeIn} 0.8s ease-out;
`;

const RegisterCard = styled.div`
  background-color: var(--soft-ui-color);
  padding: 3rem;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
  border: 1px solid rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50px;
    right: -50px;
    width: 100px;
    height: 100px;
    background-color: var(--accent-color);
    opacity: 0.1;
    border-radius: 50%;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -80px;
    left: -40px;
    width: 150px;
    height: 150px;
    background-color: var(--secondary-color);
    opacity: 0.1;
    border-radius: 50%;
  }
`;

const Title = styled.h1`
  font-family: 'Playfair Display', serif;
  color: var(--primary-color);
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: var(--secondary-color);
  margin-bottom: 2rem;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
`;

const StyledInput = styled.input`
  background-color: var(--background-color);
  border: 1px solid var(--soft-ui-color);
  border-radius: 10px;
  padding: 1rem;
  margin-bottom: 1rem;
  font-size: 1rem;
  color: var(--primary-color);
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: var(--accent-color);
    box-shadow: 0 0 0 3px rgba(198, 139, 89, 0.3);
  }
`;

const StyledSelect = styled.select`
  background-color: var(--background-color);
  border: 1px solid var(--soft-ui-color);
  border-radius: 10px;
  padding: 1rem;
  margin-bottom: 1rem;
  font-size: 1rem;
  color: var(--primary-color);
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: var(--accent-color);
    box-shadow: 0 0 0 3px rgba(198, 139, 89, 0.3);
  }
`;

const StyledButton = styled.button`
  background: linear-gradient(145deg, var(--primary-color), var(--secondary-color));
  color: var(--background-color);
  border: none;
  padding: 1rem;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(74, 44, 42, 0.3);
  }
`;

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      navigate('/login');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <RegisterContainer>
      <RegisterCard>
        <Title>Join Our Cafe</Title>
        <Subtitle>Create your cozy learning account</Subtitle>
        <StyledForm onSubmit={handleSubmit}>
          <StyledInput
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <StyledInput
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <StyledSelect value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="admin">Admin</option>
          </StyledSelect>
          <StyledButton type="submit">Register</StyledButton>
        </StyledForm>
      </RegisterCard>
    </RegisterContainer>
  );
};

export default Register;
