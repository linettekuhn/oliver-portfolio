import oliverImg from "./assets/Oliver.jpg";
import styles from "./About.module.css";

export default function About() {
  return (
    <div className={styles.layout}>
      <div>
        <h1>About Me</h1>
        <p className={styles.text}>
          Hello! My name is Oliver Cuello, I'm an artist born and raised in
          the Dominican Republic. Graduated from the Savannah College of Art &
          Design with a Bachelors of Fine Arts in Illustration with minors in
          both drawing and painting, I'm trying to find jobs in the
          publication market as most of my strengths are focused around
          portraiture! I really enjoy using high saturation and very vibrant
          colors in my work, as well as love for hatching and mark making.
          Most of my work and commissions are done digitally in Photoshop, but
          I also cater to and heavily enjoy acrylics on velum and canvas. Feel
          free to contact me for any personal commissions through my website
          and cheap prints available soon!
        </p>
      </div>

      <img
        className={styles.image}
        src={oliverImg}
        alt="Oliver Cuello"
      />
    </div>
  );
}
