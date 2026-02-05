import React, { useState, useRef } from "react";
import Header from "../../component/header";
import SEO from "../../component/seo";
import StructuredData from "../../component/seo/StructuredData";
import { SEO_METADATA } from "../../constants/seoMetadata";
import { generateSoftwareApplicationSchema } from "../../utils/structuredData";
import * as pdfjsLib from "pdfjs-dist";
import {
  FileUp,
  FileText,
  Download,
  RefreshCw,
  RefreshCcw,
} from "lucide-react";
import "./pdfToWord.scss";

import "pdfjs-dist/build/pdf.worker.mjs"; // Ensure worker is bundled

// Set worker source to the file in node_modules
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

const PdfToWord = () => {
  const metadata = SEO_METADATA.PDF_TO_WORD || {
    title: "PDF to Word Converter - Online & Free",
    description: "Convert PDF documents to editable Word files (DOC) online.",
    keywords: "pdf to word, convert pdf to doc, pdf converter",
    canonical: "https://yourdomain.com/pdf-to-word",
    ogImage: "",
  };

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [conversionResult, setConversionResult] = useState<{
    blob: Blob;
    fileName: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === "application/pdf") {
        setSelectedFile(file);
        setConversionResult(null);
      } else {
        alert("Please select a PDF file.");
      }
    }
  };

  const convertToWord = async () => {
    if (!selectedFile) return;
    setIsConverting(true);

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;

      let htmlContent = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head><meta charset='utf-8'><title>Export HTML To Doc</title></head>
        <body>
      `;

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();

        // Basic reconstruction: paragraphs based on y-position or just breaks
        // Simpler approach: Join items with space, add double break for new pages or large logic gaps
        // Advanced: Use transform matrix to approximate layout (complex for client-side)

        let pageText = "";
        let lastY = -1;

        for (const item of textContent.items as any[]) {
          // Very basic layout attempt based on line breaks
          if (lastY !== -1 && Math.abs(item.transform[5] - lastY) > 5) {
            pageText += "<br/>";
          }
          pageText += item.str + " ";
          lastY = item.transform[5];
        }

        htmlContent += `<div class="page">${pageText}</div><br style="page-break-after:always;"/>`;
      }

      htmlContent += "</body></html>";

      const blob = new Blob([htmlContent], {
        type: "application/msword;charset=utf-8",
      });

      setConversionResult({
        blob,
        fileName: selectedFile.name.replace(".pdf", ".doc"),
      });
    } catch (error) {
      console.error("Conversion failed:", error);
      alert("Failed to convert PDF.");
    } finally {
      setIsConverting(false);
    }
  };

  const downloadFile = () => {
    if (!conversionResult) return;
    const url = URL.createObjectURL(conversionResult.blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = conversionResult.fileName;
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
          "PDF to Word Converter",
          metadata.description,
          metadata.canonical,
        )}
      />
      <Header />
      <main className="tool-page">
        <div className="tool-header">
          <h1>PDF to Word</h1>
          <p>The best quality PDF to Word conversion on the market.</p>
        </div>

        <div className="pdf-to-word-container">
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
            <div className="interface-card">
              {!conversionResult ? (
                <div className="process-view">
                  <div className="file-info">
                    <FileText size={40} className="file-icon" />
                    <div>
                      <span className="name">{selectedFile.name}</span>
                      <span className="size">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                    </div>
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
                      onClick={convertToWord}
                      disabled={isConverting}
                    >
                      {isConverting ? (
                        <>
                          <RefreshCw className="spin" size={18} /> Converting...
                        </>
                      ) : (
                        "Convert to Word"
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="result-view">
                  <div className="success-icon">
                    <Download size={32} />
                  </div>
                  <h2>Conversion Successful!</h2>
                  <p>Your document is ready to download.</p>

                  <div className="result-actions">
                    <button className="download-btn" onClick={downloadFile}>
                      <Download size={20} /> Download WORD
                    </button>

                    <button
                      className="reset-link"
                      onClick={() => {
                        setSelectedFile(null);
                        setConversionResult(null);
                      }}
                    >
                      Convert another file
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

export default PdfToWord;
