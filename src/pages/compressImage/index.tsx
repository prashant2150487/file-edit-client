import { useState, useRef, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Header from "../../component/header";
import "./compressImage.scss";

interface FileWithPreview {
  file: File;
  preview: string;
  converted?: string;
  convertedSize?: number;
  isConverting?: boolean;
}

const CompressImage = () => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [quality, setQuality] = useState(0.6); // Default aggressive compression
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      files.forEach((f) => {
        URL.revokeObjectURL(f.preview);
        if (f.converted) URL.revokeObjectURL(f.converted);
      });
    };
  }, [files]);

  const addFiles = (newFiles: File[]) => {
    const validFiles = newFiles
      .filter((file) => file.type.startsWith("image/"))
      .map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));
    setFiles((prev) => [...prev, ...validFiles]);
  };

  /**
   * Core Logic: Image Compression
   * 1. Uses Canvas to re-draw the image
   * 2. Exports as 'image/jpeg' or 'image/webp' with low quality parameter
   * 3. This reduces file size significantly by reducing the precision of pixel data
   */
  const compress = async (fileObj: FileWithPreview, index: number) => {
    setFiles((prev) =>
      prev.map((f, i) => (i === index ? { ...f, isConverting: true } : f)),
    );

    const img = new Image();
    img.src = fileObj.preview;
    await new Promise((resolve) => (img.onload = resolve));

    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(img, 0, 0);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const convertedUrl = URL.createObjectURL(blob);
        setFiles((prev) =>
          prev.map((f, i) =>
            i === index
              ? {
                  ...f,
                  converted: convertedUrl,
                  convertedSize: blob.size,
                  isConverting: false,
                }
              : f,
          ),
        );
      },
      "image/jpeg",
      quality,
    ); // Forces JPEG for compression efficiency
  };

  return (
    <div
      className="page-wrapper"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        addFiles(Array.from(e.dataTransfer.files));
      }}
    >
      <Helmet>
        <title>
          Compress Images Online - Reduce file size without losing quality |
          File Edit
        </title>
      </Helmet>
      <Header />
      <main className="tool-page">
        <div className="tool-header">
          <h1>Compress Image</h1>
          <p>
            Reduce the file size of your images while maintaining the best
            possible quality.
          </p>
        </div>

        <div className="tool-settings">
          <div className="setting-group">
            <label>Compression Level: {Math.round((1 - quality) * 100)}%</label>
            <input
              type="range"
              min="0.1"
              max="0.9"
              step="0.1"
              value={quality}
              onChange={(e) => setQuality(parseFloat(e.target.value))}
              style={{ direction: "rtl" }} // Reverse so higher setting means more compression
            />
            <span className="setting-hint">
              Higher compression = smaller file but lower quality.
            </span>
          </div>
        </div>

        {files.length === 0 ? (
          <div className="upload-section">
            <button
              className="select-button"
              onClick={() => fileInputRef.current?.click()}
            >
              Select images to compress
            </button>
            <input
              type="file"
              multiple
              accept="image/*"
              style={{ display: "none" }}
              ref={fileInputRef}
              onChange={(e) =>
                e.target.files && addFiles(Array.from(e.target.files))
              }
            />
          </div>
        ) : (
          <div className="files-grid-container">
            <div className="files-grid">
              {files.map((f, i) => (
                <div key={i} className="file-card">
                  <div className="preview-container">
                    <img src={f.preview} alt="" />
                  </div>
                  <div className="file-info">
                    <span className="file-name">{f.file.name}</span>
                    <div className="file-stats">
                      <span>{(f.file.size / 1024).toFixed(1)}KB</span>
                      {f.convertedSize && (
                        <span>→ {(f.convertedSize / 1024).toFixed(1)}KB</span>
                      )}
                    </div>
                  </div>
                  <div className="card-actions">
                    {!f.converted ? (
                      <button
                        className="convert-btn-small"
                        onClick={() => compress(f, i)}
                      >
                        Compress
                      </button>
                    ) : (
                      <button
                        className="download-btn-small"
                        onClick={() => {
                          const a = document.createElement("a");
                          a.href = f.converted!;
                          a.download = `compressed-${f.file.name.split(".")[0]}.jpg`;
                          a.click();
                        }}
                      >
                        Download
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CompressImage;
