import React, { useState } from 'react';
import './SignInButton.css'; 
function Signinbtn() {
  const [authenticated, setAuthenticated] = useState(false);

  const handleSignIn = () => {
    console.log("Sign in button clicked");
    // Implement your authentication logic here.
    // For example, you can use OAuth or a custom authentication method.
    // When authentication is successful, setAuthenticated(true).
    // When signing out, setAuthenticated(false).
  };

  return (
    <div className="flex items-center">
      {authenticated ? (
        <button
          onClick={() => {
            // Implement sign-out logic here.
            // For example, call a sign-out API or clear the user's session.
            // After signing out, setAuthenticated(false).
          }}
          className="text-lg flex items-center bg-white text-gray-900 p-2 rounded-md"
        >
          <img
            src={session?.user?.image || "google.svg"}
            alt="profile" ></img>{" "} Logout
        </button>
      ) : (
        <button
          onClick={handleSignIn}
          className="button"
        >
          <img src="google.svg" alt="Google Login" ></img>{" "}
          Login
        </button>
      )}
    </div>
  );
}

export default Signinbtn; // Corrected export statement
