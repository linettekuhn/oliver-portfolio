import { useEffect, useState } from "react";
import styles from "./App.module.css";
import { MasonryPhotoAlbum, type Photo } from "react-photo-album";
import "react-photo-album/masonry.css";

type ArtPhoto = Photo & {
  title: string;
  year: number;
  medium: string;
  surface: string;
  size: string;
};

function App() {
  const [photos, setPhotos] = useState<ArtPhoto[]>([]);

  useEffect(() => {
    fetch("/originals.json")
      .then((r) => r.json())
      .then((data) =>
        setPhotos(
          data.map((item: ArtPhoto) => ({
            ...item,
            width: 200,
            height: Math.round((item.height / item.width) * 200),
          })),
        ),
      );
  }, []);

  const [selectedPhoto, setSelectedPhoto] = useState<ArtPhoto | null>(null);

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
          onClick={({ photo }) => setSelectedPhoto(photo as ArtPhoto)}
        />
      </div>

      {selectedPhoto && (
        <div
          className={styles.lightboxBackdrop}
          onClick={() => setSelectedPhoto(null)}
        >
          <div className={styles.imageWrapper}>
            <img
              className={styles.lightboxImage}
              src={selectedPhoto.src}
              alt={selectedPhoto.alt ?? ""}
              onClick={(e) => e.stopPropagation()}
            />
            <div className={styles.description}>
              <h2>
                {selectedPhoto.title}, {selectedPhoto.year}
              </h2>
              <p>
                {selectedPhoto.medium.charAt(0).toUpperCase() +
                  selectedPhoto.medium.slice(1)}{" "}
                on {selectedPhoto.surface.toLowerCase()} | {selectedPhoto.size}
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default App;
