import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { authFetch } from "../services/AuthService";
import styles from "./styles/AdminPanel.module.css";

type UploadForm = {
  title: string;
  year: string;
  medium: string;
  surface?: string;
  size: string;
};

type ImageEntry = {
  src: string;
  title: string;
  year: number;
  medium: string;
  surface?: string;
  size: string;
};

export function AdminPanel({ onUpload }: { onUpload: () => Promise<void> }) {
  const { user, logout } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [entries, setEntries] = useState<ImageEntry[]>([]);
  const [data, setData] = useState<UploadForm>({
    title: "",
    year: new Date().getFullYear().toString(),
    medium: "",
    surface: "",
    size: "",
  });
  const [pending, setPending] = useState(false);
  const [deletingFilename, setDeletingFilename] = useState<string | null>(null);

  useEffect(() => {
    const apiUrl = `${import.meta.env.VITE_API_URL}/originals.json?${Date.now()}`;
    console.log("Fetching originals.json for admin panel:", apiUrl);

    fetch(apiUrl)
      .then((r) => {
        if (!r.ok) throw new Error(`Fetch failed: ${r.status}`);
        return r.json();
      })
      .then((data) => {
        console.log("Fetched entries for admin panel:", data);
        setEntries(data);
      })
      .catch((err) => console.error("Error fetching originals.json:", err));
  }, []);

  if (!user) return null;

  function filenameFromSrc(src: string) {
    return src.split("/").pop()!;
  }

  async function handleUpload() {
    if (!file) return;
    setPending(true);
    try {
      const fd = new FormData();
      fd.append("image", file);
      Object.entries(data).forEach(([key, value]) => fd.append(key, value));

      const response = await authFetch(
        `${import.meta.env.VITE_API_URL}/upload`,
        { method: "POST", body: fd },
      );

      if (!response.ok) throw new Error("Upload failed");

      const newEntry = await response.json();
      setEntries((prev) => [...prev, newEntry]);
      await onUpload();

      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } finally {
      setPending(false);
    }
  }

  async function handleDelete(src: string) {
    const filename = filenameFromSrc(src);
    setDeletingFilename(filename);
    try {
      const response = await authFetch(
        `${import.meta.env.VITE_API_URL}/upload/${filename}`,
        { method: "DELETE" },
      );
      if (!response.ok) throw new Error("Delete failed");
      setEntries((prev) => prev.filter((e) => e.src !== src));
      await onUpload();
    } finally {
      setDeletingFilename(null);
    }
  }

  return (
    <div className={styles.adminPanel}>
      <h2>Upload</h2>
      {(["title", "year", "medium", "surface", "size"] as const).map(
        (field) => (
          <input
            className={styles.inputField}
            key={field}
            placeholder={field}
            value={data[field]}
            onChange={(e) =>
              setData((data) => ({ ...data, [field]: e.target.value }))
            }
          />
        ),
      )}
      <input
        className={styles.inputField}
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
      />
      <button onClick={handleUpload} disabled={!file || pending}>
        {pending ? "Uploading…" : "Upload"}
      </button>

      <h2>Images</h2>
      <div className={styles.imageList}>
        {entries.map((entry) => {
          const filename = filenameFromSrc(entry.src);
          const isDeleting = deletingFilename === filename;
          return (
            <div key={entry.src} className={styles.imageRow}>
              <div className={styles.imageMeta}>
                <span>
                  {entry.title}, {entry.year}
                </span>

                <span className={styles.filename}>{filename}</span>
              </div>
              <button
                className={styles.deleteBtn}
                onClick={() => handleDelete(entry.src)}
                disabled={isDeleting}
              >
                {isDeleting ? "…" : "Delete"}
              </button>
            </div>
          );
        })}
      </div>

      <button onClick={logout}>Log out</button>
    </div>
  );
}
