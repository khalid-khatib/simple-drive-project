import { useState } from "react";
import { getBlob } from "../utils/api";

export default function RetrieveForm() {
  const [id, setId] = useState("");
  const [blob, setBlob] = useState(null);
  const [error, setError] = useState(null);

  const handleFetch = async (e) => {
    e.preventDefault();
    setBlob(null);
    setError(null);

    try {
      const res = await getBlob(id);
      setBlob(res.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const downloadUrl = blob
    ? `data:application/octet-stream;base64,${blob.data}`
    : null;

  return (
    <div className="card mb-4">
      <div className="card-header">Retrieve a Blob</div>
      <div className="card-body">
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleFetch}>
          <div className="mb-3">
            <label className="form-label">ID</label>
            <input
              type="text"
              className="form-control"
              value={id}
              onChange={(e) => setId(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Fetch
          </button>
        </form>

        {blob && (
          <div className="mt-4">
            <p>
              <strong>Size:</strong> {blob.size} bytes
            </p>
            <p>
              <strong>Created at:</strong>{" "}
              {new Date(blob.created_at).toLocaleString()}
            </p>
            <a
              href={downloadUrl}
              download={blob.id}
              className="btn btn-success"
            >
              Download “{blob.id}”
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
