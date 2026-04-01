import { useEffect, useState } from "react";
import styles from "./App.module.css";
import { MasonryPhotoAlbum, type Photo } from "react-photo-album";
import "react-photo-album/masonry.css";
import { useAuth } from "./context/AuthContext";
import { AdminPanel } from "./components/AdminPanel";
import { Bounce, ToastContainer } from "react-toastify";
import { Auth } from "./components/Auth";

type ArtPhoto = Photo & {
  title: string;
  year: number;
  medium: string;
  surface: string;
  size: string;
};

function mapPhotos(data: ArtPhoto[]): ArtPhoto[] {
  return data.map((item) => {
    const srcUrl = `https://cuelloart.com${item.src}`;
    console.log("Mapping photo:", item.src, "->", srcUrl); // log each src
    return {
      ...item,
      width: 200,
      height: Math.round((item.height / item.width) * 200),
      src: srcUrl,
    };
  });
}

function App() {
  const { user } = useAuth();
  const [photos, setPhotos] = useState<ArtPhoto[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<ArtPhoto | null>(null);
  const [showLogin, setShowLogin] = useState(false);

  // fetch photos from JSON
  async function fetchPhotos() {
    try {
      const apiUrl = `${import.meta.env.VITE_API_URL}/originals.json?${Date.now()}`;
      console.log("Fetching originals.json from API:", apiUrl);
      const res = await fetch(apiUrl);
      if (!res.ok) {
        console.error("Failed to fetch originals.json, status:", res.status);
        return;
      }
      const data = await res.json();
      console.log("Fetched data:", data);
      const mapped = mapPhotos(data);
      console.log("Mapped photos:", mapped);
      setPhotos(mapped);
    } catch (err) {
      console.error("Failed to fetch photos:", err);
    }
  }

  // load photos once on mount
  useEffect(() => {
    const loadPhotos = async () => {
      await fetchPhotos();
    };
    loadPhotos();
  }, []);

  // keyboard secret login trigger
  useEffect(() => {
    let buffer = "";
    const handler = (e: KeyboardEvent) => {
      if (!e.shiftKey) {
        buffer = "";
        return;
      }
      buffer += e.key.toLowerCase();
      if (buffer.endsWith("u")) {
        setShowLogin(true);
      }
      if (buffer.length > 10) buffer = buffer.slice(-10);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
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
                  on {selectedPhoto.surface.toLowerCase()} |{" "}
                  {selectedPhoto.size}
                </p>
              </div>
            </div>
          </div>
        )}

        {showLogin && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 999,
            }}
            onClick={() => setShowLogin(false)}
          >
            <div onClick={(e) => e.stopPropagation()}>
              {user ? <AdminPanel onUpload={fetchPhotos} /> : <Auth />}
            </div>
          </div>
        )}
      </main>

      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Bounce}
        style={{ zIndex: 10000 }}
      />
    </>
  );
}

export default App;
