import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Authentication(props) {
  const [isRegistration, setIsRegistration] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [warningMessage, setWarningMessage] = useState(null);

  const { signUp, login } = useAuth();
  const { handleCloseModal } = props;

  async function handleAuthenticate() {
    if (isAuthenticating) {
      return;
    }
    if (!email || !email.includes("a") || !password || password.length < 6) {
      setWarningMessage(
        `Please enter a valid email and a password that is at least 6 characters long`
      );
      return;
    }

    try {
      setIsAuthenticating(true);
      setWarningMessage(null);

      if (isRegistration) {
        // register a user
        signUp(email, password);
      } else {
        // login a user
        await login(email, password);
      }
      handleCloseModal();
    } catch (err) {
      setWarningMessage(err.message);
      console.log(err.message);
    } finally {
      setIsAuthenticating(false);
    }
  }

  return (
    <>
      <h2 className="sign-up-text">{isRegistration ? "Sign Up" : "Login"}</h2>
      <p>{isRegistration ? "Create an account!" : "Sign into your account!"}</p>
      {warningMessage && <p>❌ {warningMessage}</p>}
      <input
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
        }}
        placeholder="Email"
      />
      <input
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
        }}
        placeholder="*********"
        type="password"
      />
      <button onClick={handleAuthenticate}>
        <p>{isAuthenticating ? "Authenticating..." : "Submit"}</p>
      </button>
      <hr />
      <div className="register-content">
        <p>
          {isRegistration
            ? "Already have an account?"
            : "Don't have an account?"}
        </p>
        <button
          onClick={() => {
            setIsRegistration(!isRegistration);
          }}
        >
          <p>{isRegistration ? "Sign In" : "Sign up"}</p>
        </button>
      </div>
    </>
  );
}
