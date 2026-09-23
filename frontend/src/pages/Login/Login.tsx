import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { ArrowRight, LockKeyhole, Phone } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import type { ConfirmationResult } from "firebase/auth";
import logo from "../../assets/logo.png";
import { auth } from "../../firebase";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);
  const confirmationResultRef = useRef<ConfirmationResult | null>(null);

  useEffect(() => {
    recaptchaVerifierRef.current = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      { size: "invisible" }
    );

    return () => {
      recaptchaVerifierRef.current?.clear();
      recaptchaVerifierRef.current = null;
    };
  }, []);

  if (localStorage.getItem("mamta-authenticated") === "true") {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!phone.trim()) {
      setError("Enter your phone number to continue.");
      return;
    }

    if (isCodeSent && !otp.trim()) {
      setError("Enter the verification code sent to your phone.");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      if (!isCodeSent) {
        const trimmedPhone = phone.trim();
        const phoneDigits = trimmedPhone.replace(/\D/g, "");
        const phoneNumber = trimmedPhone.startsWith("+")
          ? `+${phoneDigits}`
          : `+91${phoneDigits}`;

        if (!/^\+\d{10,15}$/.test(phoneNumber)) {
          setError("Enter a valid phone number with country code.");
          return;
        }

        if (!recaptchaVerifierRef.current) {
          setError("Unable to start phone verification. Please try again.");
          return;
        }

        confirmationResultRef.current = await signInWithPhoneNumber(
          auth,
          phoneNumber,
          recaptchaVerifierRef.current
        );
        setIsCodeSent(true);
        return;
      }

      if (!confirmationResultRef.current) {
        setError("Your verification session expired. Please request a new code.");
        setIsCodeSent(false);
        return;
      }

      await confirmationResultRef.current.confirm(otp.trim());

      // App.tsx currently uses this non-secret flag for its route gate.
      localStorage.setItem("mamta-authenticated", "true");
      navigate("/", { replace: true });
    } catch (authError) {
      if (authError instanceof FirebaseError) {
        switch (authError.code) {
          case "auth/invalid-phone-number":
            setError("Enter a valid phone number with country code.");
            break;
          case "auth/invalid-verification-code":
            setError("The verification code is incorrect.");
            break;
          case "auth/code-expired":
          case "auth/session-expired":
            setError("The verification code expired. Please request a new one.");
            setIsCodeSent(false);
            break;
          case "auth/too-many-requests":
            setError("Too many attempts. Please try again later.");
            break;
          case "auth/captcha-check-failed":
            setError("Phone verification could not be completed. Try again.");
            break;
          case "auth/quota-exceeded":
            setError("SMS limit reached. Please try again later.");
            break;
          case "auth/network-request-failed":
            setError("Network error. Check your connection and try again.");
            break;
          default:
            setError("Unable to sign in. Please try again.");
        }
      } else {
        setError("Unable to sign in. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
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
            Phone number
            <span className="login-input">
              <Phone size={17} />
              <input type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="+91 98765 43210" autoComplete="tel" disabled={isCodeSent} />
            </span>
          </label>
          <label>
            Verification code
            <span className="login-input">
              <LockKeyhole size={17} />
              <input type="text" inputMode="numeric" value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))} placeholder={isCodeSent ? "Enter 6-digit OTP" : "OTP will be sent by SMS"} autoComplete="one-time-code" disabled={!isCodeSent} />
            </span>
          </label>
          {error && <p className="login-error" role="alert">{error}</p>}
          <button className="login-submit" type="submit" disabled={isLoading}>
            {isLoading ? "Please wait..." : isCodeSent ? "Verify OTP" : "Send OTP"} <ArrowRight size={18} />
          </button>
          <div id="recaptcha-container" />
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