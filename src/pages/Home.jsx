import React from 'react';
import Hero from '../components/Hero';
import Services from '../components/Services';
import Portfolio from '../components/Portfolio';
import Contact from '../components/Contact';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { isAdmin } = useAuth();
  return (
    <main>
      <Hero />
      <Services />
      <Portfolio />
      {!isAdmin && <Contact />}
    </main>
  );
};

export default Home;
