import React, { useState, useRef } from "react";
import Header from "../../component/header";
import SEO from "../../component/seo";
import StructuredData from "../../component/seo/StructuredData";
import { SEO_METADATA } from "../../constants/seoMetadata";
import { generateSoftwareApplicationSchema } from "../../utils/structuredData";
import { PDFDocument } from "pdf-lib";
import * as pdfjsLib from "pdfjs-dist";
import { FileUp, Trash2, Download, RefreshCw, AlertCircle } from "lucide-react";
import "./removePages.scss";

// --- PDF.js Worker Configuration ---
// Crucial for rendering PDF pages in the browser.
// Using the CDN version matching the installed package version.
import "pdfjs-dist/build/pdf.worker.mjs"; // Ensure worker is bundled

// Set worker source to the file in node_modules (Vite moves this to assets)
// Ideally, for Vite we use the ?url import, but for simplicity with standard pdfjs-dist:
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

interface PageItem {
  id: string;
  originalPageIndex: number; // 0-based index from the original PDF
  thumbnail: string; // Base64 image data
}

const RemovePages = () => {
  // Fallback metadata
  const metadata = SEO_METADATA.MERGE_PDF || {
    title: "Remove PDF Pages - Delete Pages Online",
    description: "Easily remove specific pages from your PDF documents online.",
    keywords: "remove pdf pages, delete pdf pages, extract pdf pages",
    canonical: "https://yourdomain.com/remove-pages",
    ogImage: "",
  };

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PageItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Drag and drop state
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
  const [dragOverItemIndex, setDragOverItemIndex] = useState<number | null>(
    null,
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === "application/pdf") {
        setSelectedFile(file);
        loadPdfPages(file);
      } else {
        alert("Please select a PDF file.");
      }
    }
  };

  const loadPdfPages = async (file: File) => {
    setIsProcessing(true);
    setPages([]);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;

      const newPages: PageItem[] = [];

      // Render each page to a canvas and get base64 image
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 0.5 }); // Thumbnail scale
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        if (context) {
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          await page.render({
            canvas: canvas,
            canvasContext: context,
            viewport: viewport,
          }).promise;

          newPages.push({
            id: Math.random().toString(36).substr(2, 9),
            originalPageIndex: i - 1,
            thumbnail: canvas.toDataURL("image/jpeg"),
          });
        }
      }
      setPages(newPages);
    } catch (error) {
      console.error("Error loading PDF pages:", error);
      alert("Failed to load PDF pages. Please try another file.");
      setSelectedFile(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemovePage = (id: string) => {
    setPages((prev) => prev.filter((p) => p.id !== id));
  };

  // --- Drag and Drop Logic ---
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedItemIndex(index);
    // Required for Firefox
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnter = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverItemIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // allow drop
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedItemIndex === null || dragOverItemIndex === null) return;

    if (draggedItemIndex !== dragOverItemIndex) {
      const newPages = [...pages];
      const draggedItem = newPages[draggedItemIndex];
      newPages.splice(draggedItemIndex, 1);
      newPages.splice(dragOverItemIndex, 0, draggedItem);
      setPages(newPages);
    }

    setDraggedItemIndex(null);
    setDragOverItemIndex(null);
  };

  const handleSavePdf = async () => {
    if (!selectedFile || pages.length === 0) return;
    setIsSaving(true);

    try {
      const originalPdfBytes = await selectedFile.arrayBuffer();
      const originalPdfDoc = await PDFDocument.load(originalPdfBytes);
      const newPdfDoc = await PDFDocument.create();

      // Get page indices to copy in the specific order needed
      const pageIndices = pages.map((p) => p.originalPageIndex);

      const copiedPages = await newPdfDoc.copyPages(
        originalPdfDoc,
        pageIndices,
      );

      copiedPages.forEach((page) => newPdfDoc.addPage(page));

      const pdfBytes = await newPdfDoc.save();
      const blob = new Blob([pdfBytes as any], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `edited-${selectedFile.name}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error saving PDF:", error);
      alert("Failed to save PDF.");
    } finally {
      setIsSaving(false);
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
          "Remove PDF Pages",
          metadata.description,
          metadata.canonical,
        )}
      />
      <Header />
      <main className="tool-page">
        <div className="tool-header">
          <h1>Remove & Rearrange Pages</h1>
          <p>Delete unwanted pages and rearrange the rest.</p>
        </div>

        <div className="remove-pages-container">
          {!selectedFile ? (
            <div
              className="upload-area"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="icon-wrapper">
                <FileUp size={48} />
              </div>
              <h3>Select PDF file</h3>
              <p>or drag and drop it here</p>
              <input
                type="file"
                accept=".pdf"
                className="hidden-input"
                ref={fileInputRef}
                onChange={handleFileSelect}
              />
            </div>
          ) : (
            <div className="editor-area">
              <div className="toolbar">
                <span className="file-name">{selectedFile.name}</span>
                <div className="actions">
                  <button
                    className="reset-btn"
                    onClick={() => {
                      setSelectedFile(null);
                      setPages([]);
                    }}
                  >
                    Change File
                  </button>
                  <button
                    className="save-btn"
                    onClick={handleSavePdf}
                    disabled={isSaving || pages.length === 0}
                  >
                    {isSaving ? (
                      <>
                        <RefreshCw className="spin" size={16} /> Saving...
                      </>
                    ) : (
                      <>
                        <Download size={16} /> Save PDF
                      </>
                    )}
                  </button>
                </div>
              </div>

              {isProcessing ? (
                <div className="loading-state">
                  <RefreshCw className="spin" size={40} />
                  <p>Loading pages...</p>
                </div>
              ) : (
                <>
                  {pages.length === 0 ? (
                    <div className="empty-state">
                      <AlertCircle size={40} />
                      <p>All pages removed!</p>
                    </div>
                  ) : (
                    <div className="pages-grid">
                      {pages.map((page, index) => (
                        <div
                          key={page.id}
                          className={`page-card ${draggedItemIndex === index ? "dragging" : ""} ${dragOverItemIndex === index ? "drag-over" : ""}`}
                          draggable
                          onDragStart={(e) => handleDragStart(e, index)}
                          onDragEnter={(e) => handleDragEnter(e, index)}
                          onDragOver={handleDragOver}
                          onDrop={handleDrop}
                        >
                          <div className="page-number">{index + 1}</div>
                          <img src={page.thumbnail} alt={`Page ${index + 1}`} />
                          <button
                            className="delete-btn"
                            onClick={() => handleRemovePage(page.id)}
                            title="Remove Page"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default RemovePages;
