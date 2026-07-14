import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
 

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        gap: "20px",
      }}
    >
      <SignedOut>
        <h1>Welcome to Talent IQ</h1>

        <SignInButton mode="modal">
          <button>Sign In</button>
        </SignInButton>

        <SignUpButton mode="modal">
          <button>Sign Up</button>
        </SignUpButton>
      </SignedOut>

      <SignedIn>
        <h1>Welcome 🎉</h1>
        <UserButton />
      </SignedIn>
    </div>
    
     
  );
}

export default App
