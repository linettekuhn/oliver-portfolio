import { useState } from "react";
import styles from "./App.module.css";
import { MasonryPhotoAlbum, type Photo } from "react-photo-album";
import "react-photo-album/masonry.css";

import originalsJson from "./assets/originals.json";

const photos: Photo[] = originalsJson.map((thumb, i) => ({
  ...thumb,
  width: 200,
  height: Math.round((thumb.height / thumb.width) * 200),
}));

function App() {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  return (
    <main>
      <div className={styles.header}>
        <div className={styles.logoWrapper}>
          <img
            className={styles.logo}
            src="/icons/logo_with_text.png"
            alt="Logo"
          />
        </div>
        <div className={styles.titles}>
          <h2 className={styles.title}>illustrator</h2>
          <h2 className={styles.title}>fine artist</h2>
        </div>
      </div>
      <div
        style={{
          width: "100%",
          alignSelf: "stretch",
          padding: "0 20px",
          boxSizing: "border-box",
        }}
      >
        <MasonryPhotoAlbum
          photos={photos}
          columns={(containerWidth) => {
            if (containerWidth < 500) return 2;
            if (containerWidth < 1000) return 3;
            return 4;
          }}
          spacing={30}
          onClick={({ photo }) => setSelectedPhoto(photo as Photo)}
        />
      </div>

      {selectedPhoto && (
        <div
          className={styles.lightboxBackdrop}
          onClick={() => setSelectedPhoto(null)}
        >
          <img
            className={styles.lightboxImage}
            src={selectedPhoto.src}
            alt={selectedPhoto.alt ?? ""}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </main>
  );
}

export default App;
