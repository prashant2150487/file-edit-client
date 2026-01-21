import Header from "../../component/header";
import SEO from "../../component/seo";
import StructuredData from "../../component/seo/StructuredData";
import { SEO_METADATA } from "../../constants/seoMetadata";
import { generateSoftwareApplicationSchema } from "../../utils/structuredData";

const WordToPdf = () => {
  const metadata = SEO_METADATA.WORD_TO_PDF;
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
          "Word to PDF Converter",
          metadata.description,
          metadata.canonical
        )}
      />
      <Header />
      <main className="tool-page">
        <div className="tool-header">
          <h1>Word to PDF</h1>
          <p>
            Easily convert your Microsoft Word documents to professional PDF
            files.
          </p>
        </div>
        <div className="upload-section">
          <p style={{ color: "#666", marginBottom: "20px" }}>
            Note: Word conversion is a complex process. This feature will be
            available soon with our high-fidelity conversion engine.
          </p>
          <button className="select-button disabled">Select Word File</button>
        </div>
      </main>
    </div>
  );
};

export default WordToPdf;
