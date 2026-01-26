import { useState, useRef, useEffect } from "react";
import type { ChangeEvent, DragEvent } from "react";
import Header from "../../component/header";
import SEO from "../../component/seo";
import StructuredData from "../../component/seo/StructuredData";
import { SEO_METADATA } from "../../constants/seoMetadata";
import { generateSoftwareApplicationSchema } from "../../utils/structuredData";
import "./jpgToPng.scss";

interface FileWithPreview {
  file: File;
  preview: string;
  converted?: string;
  convertedSize?: number;
  isConverting?: boolean;
}

const JpgToPng = () => {
  const metadata = SEO_METADATA.JPG_TO_PNG;
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [quality, setQuality] = useState(0.8);
  const [outputFormat, setOutputFormat] = useState<"png" | "webp">("png");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Cleanup object URLs on unmount
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
      .filter((file) => file.type === "image/jpeg" || file.type === "image/jpg")
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
      if (newFiles[index].converted) {
        URL.revokeObjectURL(newFiles[index].converted!);
      }
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

  const convertToPng = async (fileObj: FileWithPreview, index: number) => {
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

    const mimeType = `image/${outputFormat}`;
    // Quality only works for image/jpeg and image/webp in most browsers
    const conversionQuality = outputFormat === "webp" ? quality : undefined;

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
      mimeType,
      conversionQuality,
    );
  };

  const downloadFile = (convertedData: string, originalName: string) => {
    const link = document.createElement("a");
    link.href = convertedData;
    const extension = outputFormat;
    link.download = originalName.replace(/\.(jpg|jpeg)$/i, `.${extension}`);
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
          "JPG to PNG Converter",
          metadata.description,
          metadata.canonical
        )}
      />
      <Header />
      <main className="tool-page">
        <div className="tool-header">
          <h1>Convert JPG to PNG</h1>
          <p>
            Transform JPG images to PNG for lossless quality and transparency support. Ideal for graphics, logos, and images that need editing. All processing happens in your browser – completely private.
          </p>
        </div>

        {/* Conversion Settings */}
        <div className="tool-settings">
          <div className="setting-group">
            <label>Output Format:</label>
            <div className="format-toggles">
              <button
                className={outputFormat === "png" ? "active" : ""}
                onClick={() => setOutputFormat("png")}
              >
                PNG (Lossless)
              </button>
              <button
                className={outputFormat === "webp" ? "active" : ""}
                onClick={() => setOutputFormat("webp")}
              >
                WebP (Optimized)
              </button>
            </div>
          </div>

          {outputFormat === "webp" && (
            <div className="setting-group">
              <label>Quality: {Math.round(quality * 100)}%</label>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.05"
                value={quality}
                onChange={(e) => setQuality(parseFloat(e.target.value))}
              />
              <span className="setting-hint">
                Lower quality = Smaller file size
              </span>
            </div>
          )}
        </div>

        {files.length === 0 ? (
          <div className="upload-section">
            <div className="upload-container">
              <input
                type="file"
                multiple
                accept=".jpg,.jpeg"
                style={{ display: "none" }}
                ref={fileInputRef}
                onChange={handleFileSelect}
              />
              <button
                className="select-button"
                onClick={() => fileInputRef.current?.click()}
              >
                Select JPG images
              </button>
            </div>
            <p className="drop-text">or drop JPGs here</p>
          </div>
        ) : (
          <div className="files-grid-container">
            <div className="files-grid">
              {files.map((fileObj, index) => (
                <div key={index} className="file-card">
                  <button
                    className="remove-file-btn"
                    onClick={() => removeFile(index)}
                    title="Remove file"
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
                        onClick={() => convertToPng(fileObj, index)}
                      >
                        {fileObj.isConverting
                          ? "Converting..."
                          : "Convert to PNG"}
                      </button>
                    ) : (
                      <button
                        className="download-btn-small"
                        onClick={() =>
                          downloadFile(fileObj.converted!, fileObj.file.name)
                        }
                      >
                        Download PNG
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
                Add more files
              </button>
              <button
                className="convert-all-btn"
                onClick={() =>
                  files.forEach((f, i) => !f.converted && convertToPng(f, i))
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

export default JpgToPng;
