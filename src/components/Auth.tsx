import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import type { BackendError } from "../types";
import styles from "./styles/Auth.module.css";
import CapsuleInput from "./CapsuleInput";
import { MdAlternateEmail, MdPassword } from "react-icons/md";
import { RiEyeFill, RiEyeCloseLine } from "react-icons/ri";

export function Auth() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [isPending, setIsPending] = useState(false);

  async function handleLogin() {
    try {
      setIsPending(true);
      await login(email, password);
      toast.success("Logged in!");
    } catch (error) {
      const backendError = error as BackendError;
      toast.error(backendError.message);
      if (backendError.details) {
        const { formErrors, fieldErrors } = backendError.details;
        const fieldMessages = Object.values(fieldErrors).flat().filter(Boolean);
        [...formErrors, ...fieldMessages].forEach((msg, index) =>
          toast.error(<div key={index}>{msg}</div>),
        );
      }
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className={styles.authWrapper}>
      <div className={styles.header}>
        <h2 className="displayMedium">Log in</h2>
      </div>
      <div className={styles.form}>
        <div className={styles.inputWrapper}>
          <p className="caption">Email</p>
          <CapsuleInput
            value={email}
            onChange={setEmail}
            placeholder="Your email goes here..."
            IconComponent={MdAlternateEmail}
          />
        </div>
        <div className={styles.inputWrapper}>
          <p className="caption">Password</p>
          <CapsuleInput
            value={password}
            onChange={setPassword}
            placeholder="Your password goes here..."
            IconComponent={MdPassword}
            secure={!showPass}
          >
            <div
              className={styles.showPassBtn}
              onClick={() => setShowPass((prev) => !prev)}
            >
              {showPass ? <RiEyeCloseLine /> : <RiEyeFill />}
            </div>
          </CapsuleInput>
        </div>
      </div>
      <button
        className={`button ${styles.actionBtn} ${isPending ? "disabled" : ""}`}
        onClick={isPending ? undefined : handleLogin}
      >
        {isPending ? "Logging in…" : "Log in"}
      </button>
    </div>
  );
}
