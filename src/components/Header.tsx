import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./styles/Header.module.css";

const socials = [
  {
    href: "https://www.instagram.com/cuello.art/",
    src: "/icons/instagram.png",
    alt: "Instagram",
  },
  {
    href: "https://www.linkedin.com/in/oliver-cuello-aa3717359/",
    src: "/icons/linkedin.png",
    alt: "LinkedIn",
  },
  { href: "https://cuelloart.com/", src: "/icons/link.png", alt: "Website" },
  { href: "https://x.com/cu_ello", src: "/icons/twitter.png", alt: "Twitter" },
];

export default function Header() {
  const [isHovered, setIsHovered] = useState(false);
  const [canHover, setCanHover] = useState(() =>
    window.matchMedia("(hover: hover)").matches
  );

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover)");
    const handler = (e: MediaQueryListEvent) => setCanHover(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <div className={styles.header}>
      <div className={styles.logoWrapper}>
        <Link to="/">
          <img
            className={styles.logo}
            src={canHover && !isHovered ? "/gifs/logo_static.jpg" : "/gifs/logo_animated.gif"}
            alt="Logo"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          />
          <h1 className={styles.logoText}>oliver cuello</h1>
        </Link>
      </div>
      <div className={styles.titlesContainer}>
        <p className={styles.title}>Illustrator | Fine Artist</p>
        <p className={styles.title}></p>
      </div>
      <div className={styles.socialRow}>
        {socials.map((s) => (
          <a
            key={s.href}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img className={styles.socialIcon} src={s.src} alt={s.alt} />
          </a>
        ))}
      </div>

      <div style={{ display: "flex", gap: "20px" }}>
        <Link className={styles.links} to="/about">
          About
        </Link>
        <Link className={styles.links} to="/contact">
          Contact
        </Link>
      </div>
    </div>
  );
}
