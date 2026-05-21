import { useState } from "react";
import styles from "./Contact.module.css";

export default function Contact() {
  const [result, setResult] = useState("");

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setResult("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    formData.append("access_key", "9f617d88-4057-48ac-8a1c-7b77ac3cb070");
    formData.append("from_name", `${formData.get("first_name")} ${formData.get("last_name")}`);

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    setResult(data.success ? "Success! Your message has been sent." : "Error. Please try again.");
  };

  return (
    <div className={styles.container}>
      <h1>Contact</h1>
      <form className={styles.form} onSubmit={onSubmit}>
        <div className={styles.row}>
          <label className={styles.field}>
            <span>First Name *</span>
            <input name="first_name" required />
          </label>
          <label className={styles.field}>
            <span>Last Name *</span>
            <input name="last_name" required />
          </label>
        </div>
        <label className={styles.field}>
          <span>Email *</span>
          <input type="email" name="email" required />
        </label>
        <label className={styles.field}>
          <span>Message *</span>
          <textarea name="message" required rows={6} />
        </label>
        <button className={styles.button} type="submit">Send</button>
        {result && <p className={styles.result}>{result}</p>}
      </form>
    </div>
  );
}
