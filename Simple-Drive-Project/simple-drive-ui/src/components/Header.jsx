const features = [
  {
    icon: "file-earmark-arrow-up",
    title: "File & Base64 Upload",
    text: "Choose a file or paste Base64—our service handles both seamlessly.",
  },
  {
    icon: "hdd-stack-fill",
    title: "Pluggable Backends",
    text: "Switch between Local FS, Database, S3-compatible or FTP via env.",
  },
  {
    icon: "table",
    title: "Metadata Tracking",
    text: "All blobs tracked in a separate metadata table with timestamps.",
  },
  {
    icon: "shield-lock-fill",
    title: "Secure Auth",
    text: "Protect every request with simple Bearer-token authentication.",
  },
  {
    icon: "file-lock2-fill",
    title: "Data Integrity",
    text: "Strict Base64 validation ensures only well-formed blobs are saved.",
  },
  {
    icon: "diagram-3-fill",
    title: "CORS-Enabled",
    text: "Cross-origin support built in so browser UIs work out of the box.",
  },
  {
    icon: "clock-fill",
    title: "UTC Timestamps",
    text: "Every blob gets a UTC `created_at` for consistent retrieval.",
  },
  {
    icon: "code-slash",
    title: "Testable Design",
    text: "Modular adapters & clear interfaces make unit/integration tests easy.",
  },
];

export default function Header() {
  return (
    <div className="container px-4 py-5">
      <h2 className="pb-2 border-bottom">Simple Drive Features</h2>
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4 py-5">
        {features.map(({ icon, title, text }) => (
          <div className="col d-flex align-items-start" key={icon}>
            <i
              className={`bi bi-${icon} text-body-secondary flex-shrink-0 me-3`}
              style={{ fontSize: "1.75em" }}
              aria-hidden="true"
            />
            <div>
              <h3 className="fw-bold mb-0 fs-4 text-body-emphasis">{title}</h3>
              <p>{text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
