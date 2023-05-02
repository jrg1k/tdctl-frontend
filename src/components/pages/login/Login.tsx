import React from 'react';
import { LoginForm } from 'components/molecules/forms/';
import './login.scss';
import useTitle from 'hooks/useTitle';
import useAnalytics from '../../../hooks/useAnalytics';

const LoginPage: React.FC = () => {
  const { logPageVisit } = useAnalytics();
  useTitle('Login');
  logPageVisit();

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
