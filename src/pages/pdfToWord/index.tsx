import Header from "../../component/header";
import SEO from "../../component/seo";
import StructuredData from "../../component/seo/StructuredData";
import { SEO_METADATA } from "../../constants/seoMetadata";
import { generateSoftwareApplicationSchema } from "../../utils/structuredData";

const PdfToWord = () => {
  const metadata = SEO_METADATA.PDF_TO_WORD;
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
          metadata.canonical
        )}
      />
      <Header />
      <main className="tool-page">
        <div className="tool-header">
          <h1>PDF to Word</h1>
          <p>The best quality PDF to Word conversion on the market.</p>
        </div>
        <div className="upload-section">
          <p style={{ color: "#666", marginBottom: "20px" }}>
            Converting PDFs to editable Word documents requires complex OCR and
            layout processing. Coming soon!
          </p>
          <button className="select-button disabled">Select PDF File</button>
        </div>
      </main>
    </div>
  );
};

export default PdfToWord;
