import { useEffect } from "react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
  useUser,
} from "@clerk/clerk-react";

import "./App.css";

function App() {
  const { isSignedIn, user } = useUser();

  useEffect(() => {
    console.log("useEffect called");
    console.log("isSignedIn:", isSignedIn);
    console.log("user:", user);

    const saveUser = async () => {
      console.log("saveUser called");

      if (!isSignedIn || !user) {
        console.log("User not signed in or user is null");
        return;
      }

      const profile = {
        clerkId: user.id,
        email:
          user.primaryEmailAddress?.emailAddress ||
          user.emailAddresses?.[0]?.emailAddress,
        name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
        profileImage: user.profileImageUrl,
      };

      console.log("Profile:", profile);

      try {
        console.log("Sending POST request to /api/users...");

        const response = await fetch("/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(profile),
        });

        console.log("Response Status:", response.status);

        const data = await response.json();
        console.log("Response Data:", data);
      } catch (error) {
        console.error("Failed to save user:", error);
      }
    };

    saveUser();
  }, [isSignedIn, user]);

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

export default App;