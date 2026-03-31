import { useState } from "react";
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

export function AdminPanel({ onUpload }: { onUpload: () => Promise<void> }) {
  const { user, logout } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<UploadForm>({
    title: "",
    year: new Date().getFullYear().toString(),
    medium: "",
    surface: "",
    size: "",
  });
  const [pending, setPending] = useState(false);

  if (!user) return null;

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
      onUpload();
      setFile(null);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className={styles.adminPanel}>
      <h1>Upload</h1>
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
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
      />
      <button onClick={handleUpload} disabled={!file || pending}>
        {pending ? "Uploading…" : "Upload"}
      </button>
      <button onClick={logout}>Log out</button>
    </div>
  );
}
