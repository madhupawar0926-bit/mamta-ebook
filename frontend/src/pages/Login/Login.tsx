import { FormEvent, useState } from "react";
import { ArrowRight, LockKeyhole, Mail } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (localStorage.getItem("mamta-authenticated") === "true") {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Enter your email and password to continue.");
      return;
    }

    localStorage.setItem("mamta-authenticated", "true");
    navigate("/", { replace: true });
  };

  return (
    <main className="login-page">
      <section className="login-panel">
        <div className="login-brand">
          <img src={logo} alt="Mamta" />
          <div>
            <strong>MAMTA</strong>
            <span>E-Book Publication</span>
          </div>
        </div>

        <div className="login-heading">
          <p className="login-eyebrow">Publisher workspace</p>
          <h1>Welcome back</h1>
          <p>Sign in to manage your books, folders, and earnings.</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <label>
            Email address
            <span className="login-input">
              <Mail size={17} />
              <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" autoComplete="email" />
            </span>
          </label>
          <label>
            Password
            <span className="login-input">
              <LockKeyhole size={17} />
              <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" autoComplete="current-password" />
            </span>
          </label>
          {error && <p className="login-error" role="alert">{error}</p>}
          <button className="login-submit" type="submit">Sign in <ArrowRight size={18} /></button>
        </form>
      </section>
      <aside className="login-aside">
        <span>01 / 03</span>
        <h2>Your stories deserve a sharper shelf.</h2>
        <p>Bring every title from draft to published, all in one calm workspace.</p>
      </aside>
    </main>
  );
}