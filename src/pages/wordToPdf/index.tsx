import { Helmet } from "react-helmet-async";
import Header from "../../component/header";

const WordToPdf = () => {
  return (
    <div className="page-wrapper">
      <Helmet>
        <title>Word to PDF - Convert DOCX to PDF Online | File Edit</title>
      </Helmet>
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
