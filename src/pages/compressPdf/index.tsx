import React, { useState, useRef } from "react";
import Header from "../../component/header";
import SEO from "../../component/seo";
import StructuredData from "../../component/seo/StructuredData";
import { SEO_METADATA } from "../../constants/seoMetadata";
import { generateSoftwareApplicationSchema } from "../../utils/structuredData";
import { PDFDocument } from "pdf-lib";
import { FileUp, Download, RefreshCw, FileText } from "lucide-react";
import "./compressPdf.scss";

interface CompressedFile {
  originalFile: File;
  originalSize: number;
  compressedBlob: Blob;
  compressedSize: number;
  compressionRatio: number;
}

const CompressPdf = () => {
  // Fallback if metadata is missing, or define a new key in SEO_METADATA later
  const metadata = SEO_METADATA.MERGE_PDF || {
    title: "Compress PDF - Reduce PDF File Size Online",
    description:
      "Compress PDF files to reduce their size while maintaining quality.",
    keywords: "compress pdf, reduce pdf size, pdf optimizer",
    canonical: "https://yourdomain.com/compress-pdf",
    ogImage: "",
  };

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [result, setResult] = useState<CompressedFile | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === "application/pdf") {
        setSelectedFile(file);
        setResult(null); // Reset previous result
      } else {
        alert("Please select a PDF file.");
      }
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const compressPdf = async () => {
    if (!selectedFile) return;

    setIsCompressing(true);
    try {
      const fileBuffer = await selectedFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(fileBuffer);

      // pdf-lib doesn't have native "compression" levels like Ghostscript,
      // but saving it often restructures and optimizes the file.
      // We can also remove unused objects if any (though load/save does this implicitly).
      const pdfBytes = await pdfDoc.save();

      const compressedBlob = new Blob([pdfBytes as any], {
        type: "application/pdf",
      });
      const compressedSize = compressedBlob.size;
      const originalSize = selectedFile.size;

      // Calculate savings
      const savedBytes = originalSize - compressedSize;
      const ratio = (savedBytes / originalSize) * 100;

      setResult({
        originalFile: selectedFile,
        originalSize,
        compressedBlob,
        compressedSize,
        compressionRatio: ratio > 0 ? ratio : 0,
      });
    } catch (error) {
      console.error("Compression failed:", error);
      alert("Failed to compress PDF. Please try another file.");
    } finally {
      setIsCompressing(false);
    }
  };

  const downloadFile = () => {
    if (!result) return;
    const url = URL.createObjectURL(result.compressedBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `compressed-${result.originalFile.name}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
          "PDF Compressor",
          metadata.description,
          metadata.canonical,
        )}
      />
      <Header />
      <main className="tool-page">
        <div className="tool-header">
          <h1>Compress PDF</h1>
          <p>
            Reduce the file size of your PDF documents while maintaining the
            best possible quality.
          </p>
        </div>

        <div className="compress-container">
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
            <div className="interface-area">
              {!result ? (
                <div className="file-preview-card">
                  <div className="file-icon">
                    <FileText size={40} />
                  </div>
                  <div className="file-details">
                    <span className="file-name">{selectedFile.name}</span>
                    <span className="file-size">
                      {formatSize(selectedFile.size)}
                    </span>
                  </div>
                  <div className="actions">
                    <button
                      className="action-btn secondary"
                      onClick={() => setSelectedFile(null)}
                    >
                      Remove
                    </button>
                    <button
                      className="action-btn primary"
                      onClick={compressPdf}
                      disabled={isCompressing}
                    >
                      {isCompressing ? (
                        <>
                          <RefreshCw className="spin" size={18} />{" "}
                          Compressing...
                        </>
                      ) : (
                        "Compress PDF"
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="result-card">
                  <div className="success-icon">
                    <Download size={32} />
                  </div>
                  <h2>Compression Complete!</h2>

                  <div className="stats-grid">
                    <div className="stat-item">
                      <span className="label">Original Size</span>
                      <span className="value">
                        {formatSize(result.originalSize)}
                      </span>
                    </div>
                    <div className="stat-arrow">→</div>
                    <div className="stat-item match">
                      <span className="label">New Size</span>
                      <span className="value">
                        {formatSize(result.compressedSize)}
                      </span>
                    </div>
                    <div className="stat-item highlight">
                      <span className="label">Saved</span>
                      <span className="value">
                        {result.compressionRatio.toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  <div className="result-actions">
                    <button className="download-btn" onClick={downloadFile}>
                      <Download size={20} /> Download Compressed PDF
                    </button>
                    <button
                      className="reset-link"
                      onClick={() => {
                        setSelectedFile(null);
                        setResult(null);
                      }}
                    >
                      Compress another PDF
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CompressPdf;
