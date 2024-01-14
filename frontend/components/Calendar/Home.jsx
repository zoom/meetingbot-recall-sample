import React from 'react';
import { CalendarIcon } from '@heroicons/react/24/solid';
import SignInButton from './Signinbtn';
import './Home.css'; // Import your CSS file

function Home() {
  const ACCESS_TOKEN = "ya29.a0AfB_byDkgMdygtElsnAD2HcqqVlrgSrlK6ckCXYi1TyMJsr-Hi1TuDV7Ic2wmcWZbDNSN61-fu7D2jdd_ibwL1PeECM1bSQ44xjdgEqM63hYvTiSWG6ret_ZfoY-u2lLVQ-1mTjjLptiDPc2dBvxglZ4kEiCqudk9RhRaCgYKAa0SARISFQGOcNnCFSfxdffpbbp9B__xXjhDPA0171";

  return (
    <div>
      <header className="header">
        <div className="header">
          <CalendarIcon className="icon" />
          <h1 className="ml-2">Google Calendar Assistant</h1>
        </div>
        <SignInButton />
      </header>

      <main className="main">
        <div>
          <h1>Google Calendar Assistant</h1>
          <p>Your own personal AI assistant for managing your Google Calendar.</p>
        </div>
      </main>
    </div>
  );
}

export default Home;
