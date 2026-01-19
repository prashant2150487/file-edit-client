import { useState, useRef, useEffect } from "react";
import type { ChangeEvent, DragEvent } from "react";
import { Helmet } from "react-helmet-async";
import Header from "../../component/header";
import "./jpgToPng.scss";

interface FileWithPreview {
  file: File;
  preview: string;
  converted?: string;
  isConverting?: boolean;
}

const JpgToPng = () => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Cleanup object URLs on unmount
    return () => {
      files.forEach((f) => URL.revokeObjectURL(f.preview));
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
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const resetAll = () => {
    files.forEach((f) => URL.revokeObjectURL(f.preview));
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

    // PNG is lossless, so we maintain quality
    const pngData = canvas.toDataURL("image/png");

    setFiles((prev) =>
      prev.map((f, i) =>
        i === index ? { ...f, converted: pngData, isConverting: false } : f,
      ),
    );
  };

  const downloadFile = (convertedData: string, originalName: string) => {
    const link = document.createElement("a");
    link.href = convertedData;
    link.download = originalName.replace(/\.(jpg|jpeg)$/i, ".png");
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
      <Helmet>
        <title>
          Convert JPG to PNG Online - High Quality & Free | File Edit
        </title>
        <meta
          name="description"
          content="Easily convert your JPG images to PNG format online for free. Support for high-quality conversion, transparency, and bulk processing. No registration required."
        />
        <meta
          name="keywords"
          content="JPG to PNG, image converter, convert JPG to PNG, free online converter, bulk image conversion"
        />
        <link rel="canonical" href="https://fileedit.com/jpg-to-png" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://fileedit.com/jpg-to-png" />
        <meta
          property="og:title"
          content="Convert JPG to PNG Online - High Quality & Free"
        />
        <meta
          property="og:description"
          content="Easily convert your JPG images to PNG format online for free. Support for high-quality conversion and transparency."
        />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta
          property="twitter:url"
          content="https://fileedit.com/jpg-to-png"
        />
        <meta
          property="twitter:title"
          content="Convert JPG to PNG Online - High Quality & Free"
        />
        <meta
          property="twitter:description"
          content="Easily convert your JPG images to PNG format online for free."
        />
      </Helmet>
      <Header />
      <main className="tool-page">
        <div className="tool-header">
          <h1>JPG to PNG</h1>
          <p>
            Convert your JPG images to PNG format with high quality and
            transparency support.
          </p>
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
                    <span className="file-size">
                      {(fileObj.file.size / 1024).toFixed(2)} KB
                    </span>
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
