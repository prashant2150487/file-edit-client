import { useState } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../routes/routePaths";
import "./header.scss";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header>
      <div className="header-container">
        {/* Logo */}
        <Link to={ROUTES.HOME} className="logo">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
          </svg>
          File Edit
        </Link>

        {/* Navigation - Desktop */}
        <nav className="nav-wrapper desktop-nav">
          <div className="nav-main">
            <div className="nav-item">
              <Link to={ROUTES.HOME} className="nav-link disabled">
                All PDF tools
                <svg
                  className="dropdown-arrow"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </Link>
              <div className="dropdown-menu">
                <div className="section-title">Organize PDF</div>
                <Link to={ROUTES.HOME} className="disabled">
                  Merge PDF
                </Link>
                <Link to={ROUTES.HOME} className="disabled">
                  Split PDF
                </Link>
                <Link to={ROUTES.HOME} className="disabled">
                  Remove pages
                </Link>
                <div className="section-title" style={{ marginTop: "8px" }}>
                  Optimize PDF
                </div>
                <Link to={ROUTES.HOME} className="disabled">
                  Compress PDF
                </Link>
                <Link to={ROUTES.HOME} className="disabled">
                  Repair PDF
                </Link>
              </div>
            </div>

            <div className="nav-item">
              <Link to={ROUTES.HOME} className="nav-link disabled">
                Convert PDF
                <svg
                  className="dropdown-arrow"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </Link>
              <div className="dropdown-menu">
                <div className="section-title">Convert to PDF</div>
                <Link to={ROUTES.HOME} className="disabled">
                  Word to PDF
                </Link>
                <Link to={ROUTES.HOME} className="disabled">
                  JPG to PDF
                </Link>
                <div className="section-title" style={{ marginTop: "8px" }}>
                  Convert from PDF
                </div>
                <Link to={ROUTES.HOME} className="disabled">
                  PDF to Word
                </Link>
                <Link to={ROUTES.HOME} className="disabled">
                  PDF to JPG
                </Link>
              </div>
            </div>

            <div className="nav-item">
              <Link to={ROUTES.HOME} className="nav-link">
                Image Tools
                <svg
                  className="dropdown-arrow"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </Link>
              <div className="dropdown-menu">
                <div className="section-title">Convert Image</div>
                <Link to={ROUTES.JPG_TO_PNG}>JPG to PNG</Link>
                <Link to={ROUTES.PNG_TO_JPG}>PNG to JPG</Link>
                <Link to={ROUTES.HOME} className="disabled">
                  Image to JPG
                </Link>
                <Link to={ROUTES.HOME} className="disabled">
                  Image to PNG
                </Link>
                <Link to={ROUTES.HOME} className="disabled">
                  SVG to PNG
                </Link>
                <div className="section-title" style={{ marginTop: "8px" }}>
                  Edit Image
                </div>
                <Link to={ROUTES.HOME} className="disabled">
                  Compress Image
                </Link>
                <Link to={ROUTES.HOME} className="disabled">
                  Resize Image
                </Link>
                <Link to={ROUTES.HOME} className="disabled">
                  Crop Image
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Right Section */}
        <div className="nav-right">
          <button
            className={`hamburger ${isMenuOpen ? "active" : ""}`}
            onClick={toggleMenu}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <svg
            className="menu-icon dots-icon"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <circle cx="12" cy="5" r="2" />
            <circle cx="12" cy="12" r="2" />
            <circle cx="12" cy="19" r="2" />
          </svg>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className={`mobile-sidebar ${isMenuOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <Link
            to={ROUTES.HOME}
            className="logo"
            onClick={() => setIsMenuOpen(false)}
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
            </svg>
            File Edit
          </Link>
          <button className="close-btn" onClick={() => setIsMenuOpen(false)}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div className="sidebar-content">
          <div className="sidebar-section">
            <div className="section-title">Organize PDF</div>
            <Link
              to={ROUTES.HOME}
              className="disabled"
              onClick={() => setIsMenuOpen(false)}
            >
              Merge PDF
            </Link>
            <Link
              to={ROUTES.HOME}
              className="disabled"
              onClick={() => setIsMenuOpen(false)}
            >
              Split PDF
            </Link>
            <Link to={ROUTES.HOME} onClick={() => setIsMenuOpen(false)}>
              Remove pages
            </Link>
          </div>
          <div className="sidebar-section">
            <div className="section-title">Convert PDF</div>
            <Link
              to={ROUTES.HOME}
              className="disabled"
              onClick={() => setIsMenuOpen(false)}
            >
              Word to PDF
            </Link>
            <Link
              to={ROUTES.HOME}
              className="disabled"
              onClick={() => setIsMenuOpen(false)}
            >
              JPG to PDF
            </Link>
            <Link
              to={ROUTES.HOME}
              className="disabled"
              onClick={() => setIsMenuOpen(false)}
            >
              PDF to Word
            </Link>
            <Link
              to={ROUTES.HOME}
              className="disabled"
              onClick={() => setIsMenuOpen(false)}
            >
              PDF to JPG
            </Link>
          </div>
          <div className="sidebar-section">
            <div className="section-title">Image Tools</div>
            <Link to={ROUTES.JPG_TO_PNG} onClick={() => setIsMenuOpen(false)}>
              JPG to PNG
            </Link>
            <Link to={ROUTES.PNG_TO_JPG} onClick={() => setIsMenuOpen(false)}>
              PNG to JPG
            </Link>
            <Link
              to={ROUTES.HOME}
              className="disabled"
              onClick={() => setIsMenuOpen(false)}
            >
              Compress Image
            </Link>
            <Link
              to={ROUTES.HOME}
              className="disabled"
              onClick={() => setIsMenuOpen(false)}
            >
              Resize Image
            </Link>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isMenuOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}
    </header>
  );
};

export default Header;
