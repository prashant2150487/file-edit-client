import { useState, useRef, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Header from "../../component/header";
import { jsPDF } from "jspdf";
import "./jpgToPdf.scss";

interface FileWithPreview {
  file: File;
  preview: string;
  converted?: string;
  isConverting?: boolean;
}

const JpgToPdf = () => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [pageSize, setPageSize] = useState<"a4" | "letter">("a4");
  const [orientation, setOrientation] = useState<"p" | "l">("p");
  const [margin, setMargin] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => files.forEach((f) => URL.revokeObjectURL(f.preview));
  }, [files]);

  const addFiles = (newFiles: File[]) => {
    const validFiles = newFiles
      .filter((file) => file.type === "image/jpeg" || file.type === "image/jpg")
      .map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));
    setFiles((prev) => [...prev, ...validFiles]);
  };

  /**
   * Core Logic: JPG to PDF
   * 1. Uses jsPDF library to create a new PDF document.
   * 2. Iterates through all uploaded images.
   * 3. Calculates scales to fit the image within the PDF page based on orientation.
   * 4. Adds each image as a new page.
   */
  const convertToPdf = async () => {
    if (files.length === 0) return;

    const doc = new jsPDF({
      orientation: orientation,
      unit: "mm",
      format: pageSize,
    });

    for (let i = 0; i < files.length; i++) {
      const fileObj = files[i];
      const img = new Image();
      img.src = fileObj.preview;
      await new Promise((resolve) => (img.onload = resolve));

      if (i > 0) doc.addPage();

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      const usableWidth = pageWidth - margin * 2;
      const usableHeight = pageHeight - margin * 2;

      const ratio = img.width / img.height;
      let imgWidth = usableWidth;
      let imgHeight = usableWidth / ratio;

      if (imgHeight > usableHeight) {
        imgHeight = usableHeight;
        imgWidth = usableHeight * ratio;
      }

      const x = (pageWidth - imgWidth) / 2;
      const y = (pageHeight - imgHeight) / 2;

      doc.addImage(img, "JPEG", x, y, imgWidth, imgHeight);
    }

    doc.save("converted.pdf");
  };

  return (
    <div className="page-wrapper">
      <Helmet>
        <title>JPG to PDF - Convert Images to PDF Document | File Edit</title>
      </Helmet>
      <Header />
      <main className="tool-page">
        <div className="tool-header">
          <h1>JPG to PDF</h1>
          <p>
            Easily convert your JPG images into a professional PDF document.
          </p>
        </div>

        <div className="tool-settings">
          <div className="setting-group">
            <label>Page Size</label>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(e.target.value as any)}
            >
              <option value="a4">A4 (210 x 297mm)</option>
              <option value="letter">Letter (216 x 279mm)</option>
            </select>
          </div>
          <div className="setting-group">
            <label>Orientation</label>
            <div className="format-toggles">
              <button
                className={orientation === "p" ? "active" : ""}
                onClick={() => setOrientation("p")}
              >
                Portrait
              </button>
              <button
                className={orientation === "l" ? "active" : ""}
                onClick={() => setOrientation("l")}
              >
                Landscape
              </button>
            </div>
          </div>
          <div className="setting-group">
            <label>Margin: {margin}mm</label>
            <input
              type="range"
              min="0"
              max="50"
              value={margin}
              onChange={(e) => setMargin(parseInt(e.target.value))}
            />
          </div>
        </div>

        {files.length === 0 ? (
          <div className="upload-section">
            <button
              className="select-button"
              onClick={() => fileInputRef.current?.click()}
            >
              Select JPGs
            </button>
            <input
              type="file"
              multiple
              accept=".jpg,.jpeg"
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
                  </div>
                </div>
              ))}
            </div>
            <div className="action-footer">
              <button className="reset-btn" onClick={() => setFiles([])}>
                Reset
              </button>
              <button className="convert-all-btn" onClick={convertToPdf}>
                Generate PDF
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default JpgToPdf;
