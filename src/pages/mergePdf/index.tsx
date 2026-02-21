import { useState, useRef } from "react";
import Header from "../../component/header";
import SEO from "../../component/seo";
import StructuredData from "../../component/seo/StructuredData";
import { SEO_METADATA } from "../../constants/seoMetadata";
import { generateSoftwareApplicationSchema } from "../../utils/structuredData";
import { PDFDocument } from "pdf-lib";
import "./mergePdf.scss";

interface FileItem {
  file: File;
  id: string;
}

const Grip = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="drag-handle"
  >
    <circle cx="9" cy="12" r="1" />
    <circle cx="9" cy="5" r="1" />
    <circle cx="9" cy="19" r="1" />
    <circle cx="15" cy="12" r="1" />
    <circle cx="15" cy="5" r="1" />
    <circle cx="15" cy="19" r="1" />
  </svg>
);

const MergePdf = () => {
  const metadata = SEO_METADATA.MERGE_PDF;
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isMerging, setIsMerging] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [hoveredRowIndex, setHoveredRowIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addFiles = (newFiles: File[]) => {
    const validFiles = newFiles
      .filter((file) => file.type === "application/pdf")
      .map((file) => ({
        file,
        id: Math.random().toString(36).substr(2, 9),
      }));
    setFiles((prev) => [...prev, ...validFiles]);
  };

  /**
   * Core Logic: Merge PDFs
   * 1. Uses 'pdf-lib' to create a new PDFDocument.
   * 2. Loads each external PDF as a donor document.
   * 3. Copies all pages from donor documents into the main merged document.
   * 4. Saves as a single binary blob for download.
   */
  /**
   * Drag and Drop Logic
   */
  const handleDragStart = (index: number) => {
    setDragIndex(index);
  };

  const handleDragEnter = (index: number) => {
    setDragOverIndex(index);
  };

  const handleDragEnd = () => {
    if (
      dragIndex !== null &&
      dragOverIndex !== null &&
      dragIndex !== dragOverIndex
    ) {
      const _files = [...files];
      const draggedFile = _files[dragIndex];
      _files.splice(dragIndex, 1);
      _files.splice(dragOverIndex, 0, draggedFile);
      setFiles(_files);
    }
    setDragIndex(null);
    setDragOverIndex(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  /**
   * Core Logic: Merge PDFs
   * 1. Uses 'pdf-lib' to create a new PDFDocument.
   * 2. Loads each external PDF as a donor document.
   * 3. Copies all pages from donor documents into the main merged document.
   * 4. Saves as a single binary blob for download.
   */
  const handleMerge = async () => {
    if (files.length < 2) {
      alert("Please select at least 2 PDF files to merge.");
      return;
    }

    setIsMerging(true);
    try {
      const mergedPdf = await PDFDocument.create();

      for (const fileItem of files) {
        const fileContent = await fileItem.file.arrayBuffer();
        const pdf = await PDFDocument.load(fileContent);
        const copiedPages = await mergedPdf.copyPages(
          pdf,
          pdf.getPageIndices(),
        );
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const pdfBytes = await mergedPdf.save();
      const blob = new Blob([pdfBytes as any], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "merged-document.pdf";
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Merging failed:", err);
      alert("An error occurred while merging your PDFs.");
    } finally {
      setIsMerging(false);
    }
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
          "PDF Merger",
          metadata.description,
          metadata.canonical,
        )}
      />
      <Header />
      <main className="tool-page">
        <div className="tool-header">
          <h1>Merge PDF</h1>
          <p>
            The easiest way to combine multiple PDF files into one document.
          </p>
        </div>

        {files.length === 0 ? (
          <div className="upload-section">
            <button
              className="select-button"
              onClick={() => fileInputRef.current?.click()}
            >
              Select PDF files
            </button>
          </div>
        ) : (
          <div className="files-grid-container">
            <div className="files-list">
              {files.map((f, i) => (
                <div
                  key={f.id}
                  className={`file-row ${dragIndex === i ? "dragging" : ""} ${dragOverIndex === i ? "drag-over" : ""}`}
                  draggable={hoveredRowIndex === i}
                  onDragStart={() => handleDragStart(i)}
                  onDragEnter={() => handleDragEnter(i)}
                  onDragEnd={handleDragEnd}
                  onDragOver={handleDragOver}
                >
                  <div className="file-info-row">
                    <span
                      onMouseEnter={() => setHoveredRowIndex(i)}
                      onMouseLeave={() => setHoveredRowIndex(null)}
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <Grip />
                    </span>
                    <span className="order">{i + 1}</span>
                    <span className="name">{f.file.name}</span>
                    <span className="size">
                      {(f.file.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </div>
                  <button
                    className="remove-btn"
                    onClick={() =>
                      setFiles((prev) =>
                        prev.filter((item) => item.id !== f.id),
                      )
                    }
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
            <div className="action-footer">
              <button
                className="add-more-btn"
                onClick={() => fileInputRef.current?.click()}
              >
                Add more
              </button>
              <button
                className="convert-all-btn"
                disabled={isMerging}
                onClick={handleMerge}
              >
                {isMerging ? "Merging..." : "Merge PDF"}
              </button>
            </div>
          </div>
        )}

        {/* Hidden Input Layer - Always accessible */}
        <input
          type="file"
          multiple
          accept=".pdf"
          style={{ display: "none" }}
          ref={fileInputRef}
          onChange={(e) =>
            e.target.files && addFiles(Array.from(e.target.files))
          }
        />
      </main>
    </div>
  );
};

export default MergePdf;
