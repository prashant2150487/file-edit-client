import { useState, useRef } from "react";
import { Helmet } from "react-helmet-async";
import Header from "../../component/header";
import { PDFDocument } from "pdf-lib";
import "./splitPdf.scss";

const SplitPdf = () => {
  const [file, setFile] = useState<File | null>(null);
  const [range, setRange] = useState("1-1");
  const [isSplitting, setIsSplitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * Core Logic: Split PDF
   * 1. Loads the source PDF using 'pdf-lib'.
   * 2. Parses the user-defined page range (e.g., '1-3').
   * 3. Creates a new PDFDocument and copies only those specific pages.
   * 4. Exports the new document.
   */
  const handleSplit = async () => {
    if (!file) return;

    setIsSplitting(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const totalPages = pdf.getPageCount();

      // Parse range
      const parts = range.split("-").map((p) => parseInt(p.trim()));
      const start = Math.max(1, parts[0]);
      const end = parts[1] ? Math.min(totalPages, parts[1]) : start;

      if (isNaN(start) || start > totalPages) {
        alert("Invalid page range.");
        return;
      }

      const splitPdf = await PDFDocument.create();
      // Page indices are 0-based
      const indices = [];
      for (let i = start - 1; i < end; i++) {
        indices.push(i);
      }

      const copiedPages = await splitPdf.copyPages(pdf, indices);
      copiedPages.forEach((p) => splitPdf.addPage(p));

      const bytes = await splitPdf.save();
      const blob = new Blob([bytes as any], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `split-${start}-${end}-${file.name}`;
      a.click();
    } catch (err) {
      console.error(err);
      alert("Error splitting PDF.");
    } finally {
      setIsSplitting(false);
    }
  };

  return (
    <div className="page-wrapper">
      <Helmet>
        <title>Split PDF - Extract pages from PDF document | File Edit</title>
      </Helmet>
      <Header />
      <main className="tool-page">
        <div className="tool-header">
          <h1>Split PDF</h1>
          <p>Extract specific pages or page ranges from your PDF document.</p>
        </div>

        {!file ? (
          <div className="upload-section">
            <button
              className="select-button"
              onClick={() => fileInputRef.current?.click()}
            >
              Select PDF file
            </button>
            <input
              type="file"
              accept=".pdf"
              style={{ display: "none" }}
              ref={fileInputRef}
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>
        ) : (
          <div className="tool-settings">
            <div className="file-info-box">
              <strong>Selected:</strong> {file.name}
              <button onClick={() => setFile(null)} className="reset-link">
                Change file
              </button>
            </div>
            <div className="setting-group">
              <label>Page Range (e.g., 1-3)</label>
              <input
                type="text"
                value={range}
                onChange={(e) => setRange(e.target.value)}
                placeholder="1-1"
              />
            </div>
            <button
              className="convert-all-btn"
              disabled={isSplitting}
              onClick={handleSplit}
            >
              {isSplitting ? "Processing..." : "Split & Download"}
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default SplitPdf;
