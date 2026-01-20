import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Header from "../../component/header";
import { ROUTES } from "../../routes/routePaths";
import "./home.scss";

const Home = () => {
  const pdfTools = [
    {
      title: "Merge PDF",
      description: "Combine multiple PDF files into one easily.",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M15 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V7l-5-5zM14 2v4a1 1 0 001 1h4M8 13h8M8 17h8" />
        </svg>
      ),
      route: ROUTES.HOME,
      disabled: true,
    },
    {
      title: "Split PDF",
      description: "Extract pages from your PDF into separate files.",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M8 3v3a2 2 0 01-2 2H3m18 0h-3a2 2 0 01-2-2V3m0 18v-3a2 2 0 012-2h3M3 16h3a2 2 0 012 2v3" />
        </svg>
      ),
      route: ROUTES.HOME,
      disabled: true,
    },
    {
      title: "Compress PDF",
      description: "Reduce file size while optimizing for maximal quality.",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M4 14l6-6 6 6M4 6l16 0M4 18l16 0" />
        </svg>
      ),
      route: ROUTES.HOME,
      disabled: true,
    },
  ];

  const imageTools = [
    {
      title: "JPG to PNG",
      description: "Convert JPG images to PNG with transparency support.",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M12 20l9-5-9-5-9 5 9 5z" />
          <path d="M12 12l9-5-9-5-9 5 9 5z" />
        </svg>
      ),
      route: ROUTES.JPG_TO_PNG,
    },
    {
      title: "PNG to JPG",
      description: "Fast conversion from PNG to high-quality JPG.",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h7m4 0h5m0 0v5m0-5L12 12" />
        </svg>
      ),
      route: ROUTES.PNG_TO_JPG,
    },
    {
      title: "Compress Image",
      description: "The best quality and compression for your images.",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="M21 15l-5-5L5 21" />
        </svg>
      ),
      route: ROUTES.HOME,
      disabled: true,
    },
  ];

  return (
    <div className="home-container">
      <Helmet>
        <title>File Edit - Premium Online PDF & Image Tools | 100% Free</title>
        <meta
          name="description"
          content="File Edit is an all-in-one platform for effortless PDF management and high-quality image conversion. Professional-grade tools for Merging, Splitting, Compressing PDFs, and converting JPG to PNG/WebP instantly. No registration, 100% private and free."
        />
        <meta
          name="keywords"
          content="PDF tools, image converter, online file editor, merge PDF online, split PDF pages, JPG to PNG converter, JPG to WebP, compress images without quality loss, free PDF editor"
        />
        <meta
          property="og:title"
          content="File Edit - Premium Online PDF & Image Tools"
        />
        <meta
          property="og:description"
          content="Effortless PDF management and high-quality image conversion. 100% Free & Secure."
        />
        <link rel="canonical" href="https://fileedit.com/" />
      </Helmet>

      <Header />

      <main>
        <section className="hero-section">
          <div className="hero-content">
            <h1>
              The <span>Fastest</span> Way to work with PDFs and Images
            </h1>
            <p>
              Professional-grade tools for everyone. Merge, Compress, and
              Convert your files instantly without compromising on quality.
            </p>
            <div className="hero-btns">
              <a href="#pdf-tools" className="btn-primary">
                View PDF Tools
              </a>
              <Link to={ROUTES.JPG_TO_PNG} className="btn-secondary">
                Convert JPG to PNG
              </Link>
            </div>
          </div>
        </section>

        <section id="pdf-tools" className="section-label">
          <h2>Popular PDF Tools</h2>
          <p>
            Everything you need to organize and optimize your PDF documents in
            one place.
          </p>
        </section>

        <div className="tools-grid">
          {pdfTools.map((tool, index) => (
            <Link
              to={tool.route}
              key={index}
              className={`tool-card ${tool.disabled ? "disabled" : ""}`}
            >
              <div className="icon-wrapper">{tool.icon}</div>
              <h3>{tool.title}</h3>
              <p>{tool.description}</p>
            </Link>
          ))}
        </div>

        <section id="image-tools" className="section-label">
          <h2>Powerful Image Tools</h2>
          <p>
            Professional image conversion and optimization for photographers and
            designers.
          </p>
        </section>

        <div className="tools-grid">
          {imageTools.map((tool, index) => (
            <Link
              to={tool.route}
              key={index}
              className={`tool-card ${tool.disabled ? "disabled" : ""}`}
            >
              <div className="icon-wrapper">{tool.icon}</div>
              <h3>{tool.title}</h3>
              <p>{tool.description}</p>
            </Link>
          ))}
        </div>

        <section className="how-it-works">
          <div className="container">
            <h2>How it works?</h2>
            <div className="steps-grid">
              <div className="step">
                <div className="number">1</div>
                <h4>Select Files</h4>
                <p>
                  Upload your documents or images directly from your computer or
                  drag and drop them into the tool.
                </p>
              </div>
              <div className="step">
                <div className="number">2</div>
                <h4>Configure</h4>
                <p>
                  Adjust settings like quality, compression level, or page order
                  to get the perfect result.
                </p>
              </div>
              <div className="step">
                <div className="number">3</div>
                <h4>Download</h4>
                <p>
                  Wait a few seconds for our servers to process your request and
                  download your optimized files.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="features-highlight">
          <div className="highlight-content">
            <h2>Experience Premium Performance</h2>
            <div className="features-grid">
              <div className="feature-item">
                <h4>Privacy & Security</h4>
                <p>
                  Your privacy is our priority. All files are processed using
                  256-bit SSL encryption and deleted automatically after
                  processing.
                </p>
              </div>
              <div className="feature-item">
                <h4>Universal Compatibility</h4>
                <p>
                  Our tools work on any device—Windows, Mac, Linux, iOS, or
                  Android—directly through your browser.
                </p>
              </div>
              <div className="feature-item">
                <h4>No Limits, No Fees</h4>
                <p>
                  Enjoy unlimited file conversions without any subscriptions or
                  hidden costs. Truly free, forever.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="faq-section">
          <div className="container">
            <h2>Frequently Asked Questions</h2>
            <div className="faq-item">
              <h3>Is File Edit safe to use?</h3>
              <p>
                Yes, absolutely. We use industry-standard encryption to protect
                your data during transit. Your files are only stored temporarily
                and are deleted immediately after you close the session.
              </p>
            </div>
            <div className="faq-item">
              <h3>Are there any file size limits?</h3>
              <p>
                For most tools, we support files up to 100MB. This ensures
                high-speed processing and reliability for all users.
              </p>
            </div>
            <div className="faq-item">
              <h3>Does it work on mobile devices?</h3>
              <p>
                Yes! File Edit is fully responsive and optimized for mobile
                browsers, so you can edit and convert files on the go.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="footer-content">
          <div className="footer-brand">
            <Link to={ROUTES.HOME} className="logo">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
              </svg>
              File Edit
            </Link>
            <p>
              Your all-in-one solution for PDF management and image conversion.
              Fast, secure, and free.
            </p>
          </div>
          <div className="footer-links">
            <h4>PDF Tools</h4>
            <ul>
              <li>
                <Link to={ROUTES.HOME}>Merge PDF</Link>
              </li>
              <li>
                <Link to={ROUTES.HOME}>Split PDF</Link>
              </li>
              <li>
                <Link to={ROUTES.HOME}>Compress PDF</Link>
              </li>
            </ul>
          </div>
          <div className="footer-links">
            <h4>Image Tools</h4>
            <ul>
              <li>
                <Link to={ROUTES.JPG_TO_PNG}>JPG to PNG</Link>
              </li>
              <li>
                <Link to={ROUTES.HOME}>PNG to JPG</Link>
              </li>
              <li>
                <Link to={ROUTES.HOME}>Compress Image</Link>
              </li>
            </ul>
          </div>
          <div className="footer-links">
            <h4>Company</h4>
            <ul>
              <li>
                <Link to={ROUTES.HOME}>About Us</Link>
              </li>
              <li>
                <Link to={ROUTES.HOME}>Privacy Policy</Link>
              </li>
              <li>
                <Link to={ROUTES.HOME}>Terms of Service</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 File Edit. All rights reserved.</p>
          <div className="social-links">Made with &hearts; for the web</div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
