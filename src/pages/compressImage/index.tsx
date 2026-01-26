import { useState, useRef, useEffect } from "react";
import Header from "../../component/header";
import SEO from "../../component/seo";
import StructuredData from "../../component/seo/StructuredData";
import { SEO_METADATA } from "../../constants/seoMetadata";
import { generateSoftwareApplicationSchema } from "../../utils/structuredData";
import "./compressImage.scss";

interface FileWithPreview {
  file: File;
  preview: string;
  converted?: string;
  convertedSize?: number;
  isConverting?: boolean;
}

const CompressImage = () => {
  const metadata = SEO_METADATA.COMPRESS_IMAGE;
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [selectedFileIndex, setSelectedFileIndex] = useState<number>(0);
  const [quality, setQuality] = useState(53); // Default quality percentage
  const [comparisonValue, setComparisonValue] = useState(50);
  const [compressionType, setCompressionType] = useState<"quality" | "size">(
    "quality",
  );
  const [maxSize, setMaxSize] = useState<number>(100);
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
    setFiles((prev) => {
      const updated = [...prev, ...validFiles];
      if (prev.length === 0 && updated.length > 0) {
        setSelectedFileIndex(0);
      }
      return updated;
    });
  };

  const removeFile = (index: number) => {
    setFiles((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      if (selectedFileIndex >= updated.length) {
        setSelectedFileIndex(Math.max(0, updated.length - 1));
      }
      return updated;
    });
  };

  const compress = async (index: number) => {
    const fileObj = files[index];
    if (!fileObj) return;

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

    const qValue = quality / 100;

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
      qValue,
    );
  };

  const currentFile = files[selectedFileIndex];

  return (
    <div className="compress-page-container">
      <SEO
        title={metadata.title}
        description={metadata.description}
        keywords={metadata.keywords}
        canonical={metadata.canonical}
        ogImage={metadata.ogImage}
      />
      <StructuredData
        data={generateSoftwareApplicationSchema(
          "Image Compressor",
          metadata.description,
          metadata.canonical,
        )}
      />
      <Header />

      <main className="compress-main">
        {/* Sidebar */}
        <aside className="compress-sidebar">
          <div className="sidebar-top">
            <button
              className="icon-btn add-btn"
              onClick={() => fileInputRef.current?.click()}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
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
            <div className="sidebar-actions">
              <button className="icon-btn" onClick={() => setFiles([])}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
              <button className="icon-btn">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="4" y1="21" x2="4" y2="14"></line>
                  <line x1="4" y1="10" x2="4" y2="3"></line>
                  <line x1="12" y1="21" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12" y2="3"></line>
                  <line x1="20" y1="21" x2="20" y2="16"></line>
                  <line x1="20" y1="12" x2="20" y2="3"></line>
                  <line x1="1" y1="14" x2="7" y2="14"></line>
                  <line x1="9" y1="8" x2="15" y2="8"></line>
                  <line x1="17" y1="16" x2="23" y2="16"></line>
                </svg>
              </button>
            </div>
          </div>
          <span className="max-size-hint">Max file size: 10 MB</span>

          <div className="file-list">
            {files.map((f, i) => (
              <div
                key={i}
                className={`file-item ${i === selectedFileIndex ? "active" : ""}`}
                onClick={() => setSelectedFileIndex(i)}
              >
                <div className="thumb-container">
                  <img src={f.preview} alt="" />
                  <button
                    className="remove-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(i);
                    }}
                  >
                    ×
                  </button>
                  {f.convertedSize && (
                    <div className="reduction-badge">
                      -{Math.round((1 - f.convertedSize / f.file.size) * 100)}%
                    </div>
                  )}
                  <div className="settings-gear">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="3"></circle>
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                    </svg>
                  </div>
                  <button className="thumb-download-btn">Download</button>
                </div>
                <div className="file-name">{f.file.name}</div>
              </div>
            ))}
          </div>

          <div className="sidebar-footer">
            <button
              className="download-all-btn"
              disabled={files.length === 0}
              onClick={() => {
                files.forEach((f) => {
                  if (f.converted) {
                    const a = document.createElement("a");
                    a.href = f.converted;
                    a.download = `compressed-${f.file.name}`;
                    a.click();
                  }
                });
              }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Download Image
              
            </button>
          </div>
        </aside>

        {/* Content Area */}
        <section className="compress-content">
          <div className="settings-header">
            <div className="settings-left">
              <div
                className="setting-option"
                onClick={() => setCompressionType("size")}
              >
                <div
                  className={`radio-circle ${compressionType === "size" ? "selected" : ""}`}
                />
                <span>Max File Size (KB)</span>
                <div className="help-icon">?</div>
              </div>
              <div
                className="setting-option"
                onClick={() => setCompressionType("quality")}
              >
                <div
                  className={`radio-circle ${compressionType === "quality" ? "selected" : ""}`}
                />
                <span>Quality</span>
                <div className="help-icon">?</div>
              </div>
            </div>

            <div className="settings-center">
              {compressionType === "quality" ? (
                <div className="slider-wrapper">
                  <div
                    className="slider-tooltip"
                    style={{ left: `${quality}%` }}
                  >
                    {quality}%
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={quality}
                    onChange={(e) => setQuality(parseInt(e.target.value))}
                    style={{
                      background: `linear-gradient(to right, #e5322d 0%, #e5322d ${quality}%, #eee ${quality}%, #eee 100%)`,
                    }}
                  />
                </div>
              ) : (
                <div className="size-input-wrapper">
                  <input
                    type="number"
                    placeholder="Enter Max File Size"
                    value={maxSize || ""}
                    onChange={(e) => setMaxSize(parseInt(e.target.value))}
                    className="max-size-input"
                  />
                </div>
              )}
            </div>

            <div className="settings-right">
              <div className="apply-btn-group">
                <button
                  className="apply-btn"
                  onClick={() => compress(selectedFileIndex)}
                  disabled={!currentFile || currentFile.isConverting}
                >
                  {currentFile?.isConverting ? "Working..." : "Apply"}
                </button>
                <div className="dropdown-separator" />
                
              </div>
            </div>
          </div>

          <div className="preview-display">
            {currentFile ? (
              <>
                <div className="stats-comparison">
                  <div className="stat">
                    Original:{" "}
                    <span>{(currentFile.file.size / 1024).toFixed(2)} KB</span>
                  </div>
                  {currentFile.convertedSize && (
                    <div className="stat">
                      Compressed:{" "}
                      <span>
                        {(currentFile.convertedSize / 1024).toFixed(2)} KB
                      </span>{" "}
                      <span className="reduction">
                        (-
                        {Math.round(
                          (1 -
                            currentFile.convertedSize / currentFile.file.size) *
                            100,
                        )}
                        %)
                      </span>
                    </div>
                  )}
                </div>

                <div className="comparison-tool">
                  <div className="image-container">
                    <img
                      src={currentFile.preview}
                      alt="Original"
                      className="original-img"
                    />
                    {currentFile.converted && (
                      <div
                        className="compressed-img-wrapper"
                        style={{ clipPath: `inset(0 0 0 ${comparisonValue}%)` }}
                      >
                        <img
                          src={currentFile.converted}
                          alt="Compressed"
                          className="compressed-img"
                        />
                      </div>
                    )}
                    {currentFile.converted && (
                      <div
                        className="comparison-slider-handle"
                        style={{ left: `${comparisonValue}%` }}
                      >
                        <div className="slider-line" />
                        <div className="slider-circle">
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <polyline points="11 17 6 12 11 7"></polyline>
                            <polyline points="13 17 18 12 13 7"></polyline>
                          </svg>
                        </div>
                      </div>
                    )}
                    {currentFile.converted && (
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={comparisonValue}
                        onChange={(e) =>
                          setComparisonValue(parseInt(e.target.value))
                        }
                        className="comparison-input"
                      />
                    )}
                  </div>
                </div>

                <div className="current-file-name">{currentFile.file.name}</div>
              </>
            ) : (
              <div className="empty-state">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  width="100"
                  height="100"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
                <p>Upload images to begin compression</p>
                <button
                  className="select-button"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Select Images
                </button>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default CompressImage;
