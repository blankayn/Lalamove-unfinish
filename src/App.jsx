import { useState } from 'react';
import LandingPage from './components/LandingPage';
import LoginExperience from './components/LoginExperience';

const App = () => {
  const [screen, setScreen] = useState('landing');

  if (screen === 'login') {
    return <LoginExperience onBack={() => setScreen('landing')} />;
  }

  return <LandingPage onLogin={() => setScreen('login')} />;
};

export default App;
