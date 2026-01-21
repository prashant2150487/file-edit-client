import { useState, useRef } from "react";
import Header from "../../component/header";
import SEO from "../../component/seo";
import StructuredData from "../../component/seo/StructuredData";
import { SEO_METADATA } from "../../constants/seoMetadata";
import { generateSoftwareApplicationSchema } from "../../utils/structuredData";
import * as pdfjsLib from "pdfjs-dist";
import "./pdfToJpg.scss";

// Set worker path
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

interface ConvertedPage {
  url: string;
  pageNumber: number;
}

const PdfToJpg = () => {
  const metadata = SEO_METADATA.PDF_TO_JPG;
  const [file, setFile] = useState<File | null>(null);
  const [images, setImages] = useState<ConvertedPage[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * Core Logic: PDF to JPG
   * 1. Loads the PDF using pdfjs-dist.
   * 2. Iterates through each page.
   * 3. Renders the page onto a hidden canvas using task.promise.
   * 4. Converts canvas to image blob/url.
   */
  const convert = async () => {
    if (!file) return;
    setIsConverting(true);
    setImages([]);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const totalPages = pdf.numPages;
      const converted: ConvertedPage[] = [];

      for (let i = 1; i <= totalPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2 }); // High quality scale

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        if (!context) continue;

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // Satisfy PDF.js render parameters for the versions that require explicit canvas or context
        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        await (page as any).render(renderContext).promise;

        const url = canvas.toDataURL("image/jpeg", 0.9);
        converted.push({ url, pageNumber: i });
      }

      setImages(converted);
    } catch (err) {
      console.error(err);
      alert("Conversion failed. Ensure the file is a valid PDF.");
    } finally {
      setIsConverting(false);
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
          "PDF to JPG Converter",
          metadata.description,
          metadata.canonical
        )}
      />
      <Header />
      <main className="tool-page">
        <div className="tool-header">
          <h1>PDF to JPG</h1>
          <p>Extract every page of your PDF into high-quality JPG images.</p>
        </div>

        {!file ? (
          <div className="upload-section">
            <button
              className="select-button"
              onClick={() => fileInputRef.current?.click()}
            >
              Select PDF
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
              <span>
                <strong>File:</strong> {file.name}
              </span>
              <button
                onClick={() => {
                  setFile(null);
                  setImages([]);
                }}
                className="reset-link"
              >
                Change
              </button>
            </div>
            {images.length === 0 ? (
              <button
                className="convert-all-btn"
                onClick={convert}
                disabled={isConverting}
              >
                {isConverting ? "Converting PDF..." : "Convert PDF to JPG"}
              </button>
            ) : (
              <div className="converted-results">
                <h3>Converted Pages ({images.length})</h3>
                <div className="images-grid">
                  {images.map((img) => (
                    <div key={img.pageNumber} className="image-card">
                      <img src={img.url} alt="" />
                      <a
                        href={img.url}
                        download={`page-${img.pageNumber}.jpg`}
                        className="download-btn-small"
                      >
                        Download Page {img.pageNumber}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default PdfToJpg;
