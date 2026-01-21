import { useState, useRef, useEffect } from "react";
import Header from "../../component/header";
import SEO from "../../component/seo";
import StructuredData from "../../component/seo/StructuredData";
import { SEO_METADATA } from "../../constants/seoMetadata";
import { generateSoftwareApplicationSchema } from "../../utils/structuredData";
import "./resizeImage.scss";

interface FileWithPreview {
  file: File;
  preview: string;
  converted?: string;
  isConverting?: boolean;
}

const ResizeImage = () => {
  const metadata = SEO_METADATA.RESIZE_IMAGE;
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [width, setWidth] = useState(800);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () =>
      files.forEach((f) => {
        URL.revokeObjectURL(f.preview);
        if (f.converted) URL.revokeObjectURL(f.converted);
      });
  }, [files]);

  /**
   * Core Logic: Image Resizing
   * 1. Uses Canvas with different dimensions
   * 2. Draws the original image onto a smaller (or larger) canvas
   * 3. Browser's built-in interpolation handles the scaling
   */
  const resize = async (fileObj: FileWithPreview, index: number) => {
    setFiles((prev) =>
      prev.map((f, i) => (i === index ? { ...f, isConverting: true } : f)),
    );

    const img = new Image();
    img.src = fileObj.preview;
    await new Promise((resolve) => (img.onload = resolve));

    let finalWidth = width;
    let finalHeight = width * (img.height / img.width);

    if (!maintainAspectRatio) {
      finalHeight = width; // Or add a separate height slider
    }

    const canvas = document.createElement("canvas");
    canvas.width = finalWidth;
    canvas.height = finalHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(img, 0, 0, finalWidth, finalHeight);

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      setFiles((prev) =>
        prev.map((f, i) =>
          i === index ? { ...f, converted: url, isConverting: false } : f,
        ),
      );
    }, fileObj.file.type);
  };

  return (
    <div className="page-wrapper">
      <SEO
        title={metadata.title}
        description={metadata.description}
        keywords={metadata.keywords}
        canonical={metadata.canonical}
        ogImage={metadata.ogImage}
      />
      <StructuredData
        data={generateSoftwareApplicationSchema(
          "Image Resizer",
          metadata.description,
          metadata.canonical
        )}
      />
      <Header />
      <main className="tool-page">
        <div className="tool-header">
          <h1>Resize Image</h1>
          <p>Change your image dimensions by defining new pixel width.</p>
        </div>

        <div className="tool-settings">
          <div className="setting-group">
            <label>Target Width: {width}px</label>
            <input
              type="range"
              min="100"
              max="2500"
              step="50"
              value={width}
              onChange={(e) => setWidth(parseInt(e.target.value))}
            />
          </div>
          <div className="setting-group">
            <label>
              <input
                type="checkbox"
                checked={maintainAspectRatio}
                onChange={(e) => setMaintainAspectRatio(e.target.checked)}
              />
              Maintain Aspect Ratio
            </label>
          </div>
        </div>

        {files.length === 0 ? (
          <div className="upload-section">
            <button
              className="select-button"
              onClick={() => fileInputRef.current?.click()}
            >
              Select Images
            </button>
            <input
              type="file"
              multiple
              accept="image/*"
              style={{ display: "none" }}
              ref={fileInputRef}
              onChange={(e) => {
                if (e.target.files) {
                  const newFiles = Array.from(e.target.files).map((file) => ({
                    file,
                    preview: URL.createObjectURL(file),
                  }));
                  setFiles((prev) => [...prev, ...newFiles]);
                }
              }}
            />
          </div>
        ) : (
          <div className="files-grid">
            {files.map((f, i) => (
              <div key={i} className="file-card">
                <img
                  src={f.preview}
                  alt=""
                  className="preview-mini"
                  style={{ maxWidth: "100%", borderRadius: "8px" }}
                />
                <span>{f.file.name}</span>
                {!f.converted ? (
                  <button
                    className="convert-btn-small"
                    onClick={() => resize(f, i)}
                  >
                    Resize to {width}px
                  </button>
                ) : (
                  <button
                    className="download-btn-small"
                    onClick={() => {
                      const a = document.createElement("a");
                      a.href = f.converted!;
                      a.download = `resized-${f.file.name}`;
                      a.click();
                    }}
                  >
                    Download
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ResizeImage;
