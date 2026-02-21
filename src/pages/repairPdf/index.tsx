import Header from "../../component/header";
import SEO from "../../component/seo";
import StructuredData from "../../component/seo/StructuredData";
import { SEO_METADATA } from "../../constants/seoMetadata";
import { generateSoftwareApplicationSchema } from "../../utils/structuredData";
import "./repairPdf.scss";

const RepairPdf = () => {
  // Fallback if metadata is missing
  const metadata = SEO_METADATA.MERGE_PDF || {
    title: "Repair PDF - Recover Corrupted PDF Files",
    description: "Repair broken or corrupted PDF files online.",
    keywords: "repair pdf, fix pdf, recover pdf",
    canonical: "https://yourdomain.com/repair-pdf",
    ogImage: "",
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
          "PDF Repair",
          metadata.description,
          metadata.canonical,
        )}
      />
      <Header />
      <main className="tool-page">
        <div className="tool-header">
          <h1>Repair PDF</h1>
          <p>Recover data from a corrupted or damaged PDF document.</p>
        </div>
        <div style={{ padding: "50px", textAlign: "center", color: "#666" }}>
          <h2>Tool Coming Soon</h2>
          <p>We are working hard to bring you this feature.</p>
        </div>
      </main>
    </div>
  );
};

export default RepairPdf;
