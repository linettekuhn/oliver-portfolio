import { Link } from "react-router-dom";
import styles from "./styles/Header.module.css";

const socials = [
  { href: "https://www.instagram.com/cuello.art/", src: "/icons/instagram.png", alt: "Instagram" },
  { href: "https://www.linkedin.com/in/oliver-cuello-aa3717359/", src: "/icons/linkedin.png", alt: "LinkedIn" },
  { href: "https://cuelloart.com/", src: "/icons/link.png", alt: "Website" },
  { href: "https://x.com/cu_ello", src: "/icons/twitter.png", alt: "Twitter" },
];

export default function Header() {
  return (
    <div className={styles.header}>
      <div className={styles.logoWrapper}>
        <Link to="/">
          <img
            className={styles.logo}
            src="/icons/logo_with_text.png"
            alt="Logo"
          />
        </Link>
      </div>
      <div className={styles.titlesContainer}>
        <p className={styles.title}>Illustrator</p>
        <p className={styles.title}>Fine Artist</p>
      </div>
      <div className={styles.socialRow}>
        {socials.map((s) => (
          <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer">
            <img className={styles.socialIcon} src={s.src} alt={s.alt} />
          </a>
        ))}
      </div>
        <Link className={styles.links} to="/about">About</Link>

    </div>
  );
}
