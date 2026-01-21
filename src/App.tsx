import "./App.css";
import AppRoutes from "./routes/appRoutes";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider, Helmet } from "react-helmet-async";
import StructuredData from "./component/seo/StructuredData";
import { generateOrganizationSchema, generateWebsiteSchema } from "./utils/structuredData";

function App() {
  return (
    <>
      <HelmetProvider>
        <Helmet
          titleTemplate="%s | File Edit"
          defaultTitle="File Edit - Free Online PDF & Image Conversion Tools"
        >
          <meta
            name="description"
            content="Free and easy to use online tools for PDF and image editing. Convert, merge, compress, and resize files instantly."
          />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta name="charset" content="utf-8" />
        </Helmet>

        {/* Schema.org Organization and Website Markup */}
        <StructuredData data={generateOrganizationSchema()} />
        <StructuredData data={generateWebsiteSchema()} />

        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </HelmetProvider>
    </>
  );
}

export default App;
