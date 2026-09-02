import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { BrizXWelcomeScreen } from '../components/BrizXWelcomeScreen';

export default function WelcomePage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Failsafe Redirect: If the welcome page is somehow stuck,
    // automatically redirect to home page after 6 seconds
    const fallbackTimer = setTimeout(() => {
      console.log('Failsafe redirect triggered');
      sessionStorage.setItem('brizx_welcome_seen', 'true');
      navigate('/', { replace: true });
    }, 6000);

    return () => clearTimeout(fallbackTimer);
  }, [navigate]);

  const handleComplete = () => {
    sessionStorage.setItem('brizx_welcome_seen', 'true');
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#EEF4FF] overflow-hidden">
      <BrizXWelcomeScreen onComplete={handleComplete} />
    </div>
  );
}
