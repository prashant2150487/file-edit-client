import { Helmet } from "react-helmet-async";
import Header from "../../component/header";

const Home = () => {
  return (
    <div>
      <Helmet>
        <title>File Edit - All-in-One Online PDF & Image Tools</title>
        <meta
          name="description"
          content="File Edit is your go-to online tool for PDF management and image conversion. Merge, split, compress PDFs, and convert images instantly for free."
        />
        <meta
          name="keywords"
          content="PDF tools, image converter, online file editor, merge PDF, split PDF, JPG to PNG"
        />
        <link rel="canonical" href="https://fileedit.com/" />
      </Helmet>
      <Header />
      <main
        style={{
          padding: "80px 40px",
          textAlign: "center",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <h1
          style={{
            color: "#262626",
            fontSize: "48px",
            marginBottom: "20px",
            fontWeight: "800",
          }}
        >
          Every tool you need to work with PDFs and Images
        </h1>
        <p
          style={{
            color: "#626262",
            fontSize: "20px",
            maxWidth: "800px",
            margin: "0 auto",
          }}
        >
          File Edit is your easy to use, free, and high-quality solution for all
          your file conversion and management needs.
        </p>
      </main>
    </div>
  );
};

export default Home;
