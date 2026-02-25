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

      {/* Blog Section */}
      <article className="blog-section">
        <div className="blog-container">
          {/* Introduction */}
          <section className="blog-content">
            <h2>JPG to PNG: Complete Conversion Guide</h2>
            <p>
              Converting JPG to PNG is a common need when you require lossless image quality or need to work with transparency. This guide explains when and why to convert, and how to do it securely in your browser.
            </p>
            <div className="key-difference">
              <strong>Key Difference:</strong> JPG uses lossy compression (smaller files, some quality loss), while PNG is lossless (larger files, perfect quality preservation) and supports transparency.
            </div>
          </section>

          {/* Why Convert Section */}
          <section className="blog-content">
            <h3>Why Convert JPG to PNG?</h3>
            <p>There are several important reasons to convert JPG files to PNG format:</p>

            <div className="reasons-list">
              <div className="reason-item">
                <h4>Preserve Quality During Editing</h4>
                <p>
                  Every time you edit and save a JPG, it gets compressed again, gradually degrading quality. PNG files don't lose quality when saved, making them ideal for images that need multiple rounds of editing.
                </p>
              </div>

              <div className="reason-item">
                <h4>Prepare for Transparency</h4>
                <p>
                  If you plan to remove backgrounds or add transparent areas in photo editing software, you need to work with PNG. JPG doesn't support transparency—every pixel must have a color.
                </p>
              </div>

              <div className="reason-item">
                <h4>Better for Graphics and Text</h4>
                <p>
                  PNG handles sharp edges, text, and solid colors much better than JPG. Converting screenshots, diagrams, or images with text to PNG prevents the fuzzy artifacts that JPG compression creates.
                </p>
              </div>
            </div>

            <div className="important-note">
              <strong>Important:</strong> Converting JPG to PNG won't restore quality that was already lost during JPG compression. The PNG will perfectly preserve the current state of the image, including any existing artifacts.
            </div>
          </section>

          {/* Comparison Table */}
          <section className="blog-content">
            <h3>JPG vs PNG: Which Format to Use?</h3>
            <div className="comparison-table">
              <div className="table-row header-row">
                <div className="table-cell">Use JPG When...</div>
                <div className="table-cell">Use PNG When...</div>
              </div>
              <div className="table-row">
                <div className="table-cell">Storing photographs</div>
                <div className="table-cell">Image needs transparent areas</div>
              </div>
              <div className="table-row">
                <div className="table-cell">File size is critical</div>
                <div className="table-cell">Quality must be preserved exactly</div>
              </div>
              <div className="table-row">
                <div className="table-cell">Sharing on social media</div>
                <div className="table-cell">Image contains text or UI elements</div>
              </div>
              <div className="table-row">
                <div className="table-cell">Email attachments</div>
                <div className="table-cell">Screenshots and diagrams</div>
              </div>
              <div className="table-row">
                <div className="table-cell">Web images (with WebP alternative)</div>
                <div className="table-cell">Logos and graphics</div>
              </div>
            </div>
          </section>

          {/* How to Convert */}
          <section className="blog-content">
            <h3>How to Convert JPG to PNG</h3>
            <p>Our converter makes the process fast and private:</p>
            <div className="steps-list">
              <div className="step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h4>Select files</h4>
                  <p>Click SELECT FILES or drag and drop up to 20 JPG images into the drop area</p>
                </div>
              </div>
              <div className="step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h4>Convert</h4>
                  <p>Click CONVERT to process your images instantly in your browser</p>
                </div>
              </div>
              <div className="step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h4>Save</h4>
                  <p>Save individual files or use SAVE ALL to get everything at once</p>
                </div>
              </div>
            </div>
            <div className="pro-tip">
              <strong>Pro Tip:</strong> Converting to PNG will increase file size significantly—sometimes 5-10x larger. This is normal and expected because PNG doesn't use lossy compression.
            </div>
          </section>

          {/* Common Use Cases */}
          <section className="blog-content">
            <h3>Common Use Cases</h3>
            <p>Real-World Scenarios:</p>
            <ul className="use-cases-list">
              <li><strong>Photo editing workflow:</strong> Convert to PNG before extensive editing, then export final result as JPG for sharing</li>
              <li><strong>Creating graphics:</strong> Convert source photos to PNG, add to design software, compose with transparent elements</li>
              <li><strong>Archiving important images:</strong> Store as PNG to prevent future quality degradation from re-saves</li>
              <li><strong>Screenshots for documentation:</strong> Convert to PNG for crisp text and clean edges</li>
            </ul>
          </section>

          {/* Transparency Section */}
          <section className="blog-content">
            <h3>About Transparency</h3>
            <p>
              A common misconception is that converting JPG to PNG creates transparency. It doesn't—your converted PNG will have the same solid background as the original JPG.
            </p>
            <p>To add transparency, you'll need to:</p>
            <ol className="transparency-steps">
              <li>Convert to PNG first (preserves quality for editing)</li>
              <li>Use photo editing software to remove the background</li>
              <li>Save as PNG to keep the transparent areas</li>
            </ol>
            <p>
              The conversion gives you a PNG file that's ready for transparency work, but the actual background removal requires editing software like Photoshop, GIMP, or online tools.
            </p>
          </section>

          {/* Privacy and Security */}
          <section className="blog-content">
            <h3>Privacy and Security</h3>
            <p>Your files stay completely private:</p>
            <ul className="privacy-list">
              <li><strong>Browser-based</strong> — All processing happens locally on your device</li>
              <li><strong>No uploads</strong> — Files are never sent to any server</li>
              <li><strong>No storage</strong> — We have no access to your images</li>
              <li><strong>Originals preserved</strong> — Your source JPG files remain untouched</li>
            </ul>
            <p>
              Using WebAssembly technology, we've brought image conversion directly to your browser. This means instant processing with zero privacy concerns.
            </p>
          </section>
        </div>
      </article>
    </div>
  );
};

export default JpgToPng;
