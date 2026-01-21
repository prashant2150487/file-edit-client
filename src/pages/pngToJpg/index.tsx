import { useState, useRef, useEffect } from "react";
import type { ChangeEvent, DragEvent } from "react";
import Header from "../../component/header";
import SEO from "../../component/seo";
import StructuredData from "../../component/seo/StructuredData";
import { SEO_METADATA } from "../../constants/seoMetadata";
import { generateSoftwareApplicationSchema } from "../../utils/structuredData";
import "./pngToJpg.scss";

interface FileWithPreview {
  file: File;
  preview: string;
  converted?: string;
  convertedSize?: number;
  isConverting?: boolean;
}

const PngToJpg = () => {
  const metadata = SEO_METADATA.PNG_TO_JPG;
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [quality, setQuality] = useState(0.85); // Default quality for JPG
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Cleanup object URLs to prevent memory leaks
    return () => {
      files.forEach((f) => {
        URL.revokeObjectURL(f.preview);
        if (f.converted) URL.revokeObjectURL(f.converted);
      });
    };
  }, [files]);

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFiles(Array.from(e.target.files));
    }
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      addFiles(Array.from(e.dataTransfer.files));
    }
  };

  const addFiles = (newFiles: File[]) => {
    const validFiles = newFiles
      .filter((file) => file.type === "image/png")
      .map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));

    setFiles((prev) => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index].preview);
      if (newFiles[index].converted)
        URL.revokeObjectURL(newFiles[index].converted!);
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const resetAll = () => {
    files.forEach((f) => {
      URL.revokeObjectURL(f.preview);
      if (f.converted) URL.revokeObjectURL(f.converted);
    });
    setFiles([]);
  };

  /**
   * Core Logic: PNG to JPG Conversion
   * 1. Load the PNG image into an Image object
   * 2. Draw it onto a Canvas
   * 3. Export the canvas as 'image/jpeg' with the specified quality
   */
  const convertToJpg = async (fileObj: FileWithPreview, index: number) => {
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

    // Set background to white for JPG (since JPG doesn't support transparency)
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const convertedUrl = URL.createObjectURL(blob);
        const convertedSize = blob.size;

        setFiles((prev) =>
          prev.map((f, i) =>
            i === index
              ? {
                  ...f,
                  converted: convertedUrl,
                  convertedSize,
                  isConverting: false,
                }
              : f,
          ),
        );
      },
      "image/jpeg",
      quality,
    );
  };

  const downloadFile = (convertedData: string, originalName: string) => {
    const link = document.createElement("a");
    link.href = convertedData;
    link.download = originalName.replace(/\.png$/i, ".jpg");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className="page-wrapper"
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
    >
      <SEO
        title={metadata.title}
        description={metadata.description}
        keywords={metadata.keywords}
        canonical={metadata.canonical}
        ogImage={metadata.ogImage}
      />
      <StructuredData
        data={generateSoftwareApplicationSchema(
          "PNG to JPG Converter",
          metadata.description,
          metadata.canonical
        )}
      />
      <Header />
      <main className="tool-page">
        <div className="tool-header">
          <h1>PNG to JPG</h1>
          <p>Quickly convert your PNG images to high-quality JPG format.</p>
        </div>

        {/* Quality Control Slider */}
        <div className="tool-settings">
          <div className="setting-group">
            <label>Output Quality: {Math.round(quality * 100)}%</label>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.05"
              value={quality}
              onChange={(e) => setQuality(parseFloat(e.target.value))}
            />
            <span className="setting-hint">
              Higher quality results in larger files.
            </span>
          </div>
        </div>

        {files.length === 0 ? (
          <div className="upload-section">
            <div className="upload-container">
              <input
                type="file"
                multiple
                accept=".png"
                style={{ display: "none" }}
                ref={fileInputRef}
                onChange={handleFileSelect}
              />
              <button
                className="select-button"
                onClick={() => fileInputRef.current?.click()}
              >
                Select PNG images
              </button>
            </div>
            <p className="drop-text">or drop PNG files here</p>
          </div>
        ) : (
          <div className="files-grid-container">
            <div className="files-grid">
              {files.map((fileObj, index) => (
                <div key={index} className="file-card">
                  <button
                    className="remove-file-btn"
                    onClick={() => removeFile(index)}
                  >
                    <svg viewBox="0 0 24 24" width="16" height="16">
                      <path
                        fill="currentColor"
                        d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                      />
                    </svg>
                  </button>
                  <div className="preview-container">
                    <img src={fileObj.preview} alt="preview" />
                  </div>
                  <div className="file-info">
                    <span className="file-name">{fileObj.file.name}</span>
                    <div className="file-stats">
                      <span className="file-size">
                        {(fileObj.file.size / 1024).toFixed(2)} KB
                      </span>
                      {fileObj.convertedSize && (
                        <span className="converted-size">
                          → {(fileObj.convertedSize / 1024).toFixed(2)} KB
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="card-actions">
                    {!fileObj.converted ? (
                      <button
                        className="convert-btn-small"
                        disabled={fileObj.isConverting}
                        onClick={() => convertToJpg(fileObj, index)}
                      >
                        {fileObj.isConverting
                          ? "Converting..."
                          : "Convert to JPG"}
                      </button>
                    ) : (
                      <button
                        className="download-btn-small"
                        onClick={() =>
                          downloadFile(fileObj.converted!, fileObj.file.name)
                        }
                      >
                        Download JPG
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="action-footer">
              <button className="reset-btn" onClick={resetAll}>
                Reset
              </button>
              <button
                className="add-more-btn"
                onClick={() => fileInputRef.current?.click()}
              >
                Add more
              </button>
              <button
                className="convert-all-btn"
                onClick={() =>
                  files.forEach((f, i) => !f.converted && convertToJpg(f, i))
                }
              >
                Convert All
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default PngToJpg;
