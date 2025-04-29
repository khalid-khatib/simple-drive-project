import { useState } from "react";
import { uploadBlob } from "../utils/api";

export default function UploadForm() {
  const [mode, setMode] = useState("file"); // 'file' or 'base64'
  const [id, setId] = useState("");
  const [file, setFile] = useState(null);
  const [base64Input, setBase64Input] = useState("");
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);

  // Helper to turn a File into a raw Base64 string
  const toBase64 = (file) =>
    new Promise((res, rej) => {
      const reader = new FileReader();
      reader.onload = () => res(reader.result.split(",")[1]);
      reader.onerror = () => rej(reader.error);
      reader.readAsDataURL(file);
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    setError(null);

    if (!id || (mode === "file" ? !file : !base64Input.trim())) {
      setError(
        `ID and ${mode === "file" ? "file" : "Base64 data"} are required.`
      );
      return;
    }

    try {
      setStatus("Uploading…");

      const dataToSend =
        mode === "file" ? await toBase64(file) : base64Input.trim();

      await uploadBlob(id, dataToSend);
      setStatus("Upload successful!");
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setStatus(null);
    }
  };

  return (
    <div className="card mb-4">
      <div className="card-header">Upload a Blob</div>
      <div className="card-body">
        {error && <div className="alert alert-danger">{error}</div>}
        {status && <div className="alert alert-success">{status}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">ID (without whitespaces)</label>
            <input
              type="text"
              className="form-control"
              value={id}
              onChange={(e) => setId(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                id="modeFile"
                name="uploadMode"
                value="file"
                checked={mode === "file"}
                onChange={() => setMode("file")}
              />
              <label className="form-check-label" htmlFor="modeFile">
                File
              </label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                id="modeBase64"
                name="uploadMode"
                value="base64"
                checked={mode === "base64"}
                onChange={() => setMode("base64")}
              />
              <label className="form-check-label" htmlFor="modeBase64">
                Base64
              </label>
            </div>
          </div>

          {mode === "file" && (
            <div className="mb-3">
              <label className="form-label">File</label>
              <input
                type="file"
                className="form-control"
                onChange={(e) => setFile(e.target.files[0] || null)}
              />
            </div>
          )}

          {mode === "base64" && (
            <div className="mb-3">
              <label className="form-label">Base64 Data</label>
              <textarea
                className="form-control"
                rows="5"
                value={base64Input}
                onChange={(e) => setBase64Input(e.target.value)}
              />
            </div>
          )}

          <button type="submit" className="btn btn-primary">
            Upload
          </button>
        </form>
      </div>
    </div>
  );
}
