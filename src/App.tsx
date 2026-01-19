import "./App.css";
import AppRoutes from "./routes/appRoutes";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider, Helmet } from "react-helmet-async";

function App() {
  return (
    <>
      <HelmetProvider>
        <Helmet
          titleTemplate="%s | File Edit"
          defaultTitle="File Edit - Online PDF & Image Tools"
        >
          <meta
            name="description"
            content="Free and easy to use online tools for PDF and image editing."
          />
        </Helmet>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </HelmetProvider>
    </>
  );
}

export default App;
