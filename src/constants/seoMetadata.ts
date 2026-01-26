// SEO Metadata for all pages
const DOMAIN = "https://Doxius.com"

export const SEO_METADATA = {
  HOME: {
    title: "Doxius - Free Online PDF & Image Conversion Tools",
    description:
      "Free online PDF and image editor. Convert JPG to PNG, merge PDFs, compress images, and more. No registration required.",
    keywords:
      "PDF converter, image converter, JPG to PNG, merge PDF, split PDF, online tools",
    ogImage: `${DOMAIN}/og-image.jpg`,
    ogType: "website",
    canonical: `${DOMAIN}/`,
  },
  JPG_TO_PNG: {
    title: "Convert JPG to PNG Online",
    description:
      "Free browser-based JPG to PNG converter. Your files never leave your device – all conversion happens locally in your browser.",
    keywords: "JPG to PNG, image converter, format conversion, online tool",
    ogImage: `${DOMAIN}/og-image-jpg-png.jpg`,
    canonical: `${DOMAIN}/jpg-to-png`,
  },
  PNG_TO_JPG: {
    title: "Convert PNG to JPG Online",
    description:
      "Free browser-based PNG to JPG converter. Your files never leave your device – all conversion happens locally in your browser.",
    keywords: "PNG to JPG, image converter, compression, online tool",
    ogImage: `${DOMAIN}/og-image-png-jpg.jpg`,
    canonical: `${DOMAIN}/png-to-jpg`,
  },
  COMPRESS_IMAGE: {
    title: "Easily compress images at optimal quality in seconds",
    description:
      "Choose multiple JPG, PNG or GIF images and compress them in seconds for free! You can shrink with ease in just a few clicks!",
    keywords: "image compressor, reduce size, optimize images, online tool,Image, compress, resize, crop, convert, jpeg, png, gif, tiff, raw",
    ogImage: `${DOMAIN}/og-image-compress.jpg`,
    canonical: `${DOMAIN}/compress-image`,
  },
  RESIZE_IMAGE: {
    title: "Image Resizer - Resize Images Online Free",
    description:
      "Resize images to custom dimensions. Perfect for thumbnails, social media, and web use. Fast, free, and secure.",
    keywords: "image resizer, resize pictures, resize photos, online tool",
    ogImage: `${DOMAIN}/og-image-resize.jpg`,
    canonical: `${DOMAIN}/resize-image`,
  },
  JPG_TO_PDF: {
    title: "JPG to PDF Converter - Convert Images to PDF",
    description:
      "Convert JPG images to PDF format. Combine multiple images into one PDF. Free and secure conversion.",
    keywords: "JPG to PDF, image to PDF, convert, online tool",
    ogImage: `${DOMAIN}/og-image-jpg-pdf.jpg`,
    canonical: `${DOMAIN}/jpg-to-pdf`,
  },
  WORD_TO_PDF: {
    title: "Word to PDF Converter - Convert DOCX/DOC to PDF",
    description:
      "Convert Microsoft Word documents to PDF format. Preserve formatting and layout. Free and secure conversion.",
    keywords: "Word to PDF, DOCX to PDF, document converter, online tool",
    ogImage: `${DOMAIN}/og-image-word-pdf.jpg`,
    canonical: `${DOMAIN}/word-to-pdf`,
  },
  PDF_TO_WORD: {
    title: "PDF to Word Converter - Convert PDF to DOCX",
    description:
      "Convert PDF files to editable Word documents. Preserve formatting and text. Free and fast conversion.",
    keywords: "PDF to Word, PDF to DOCX, document converter, online tool",
    ogImage: `${DOMAIN}/og-image-pdf-word.jpg`,
    canonical: `${DOMAIN}/pdf-to-word`,
  },
  PDF_TO_JPG: {
    title: "PDF to JPG Converter - Extract Images from PDF",
    description:
      "Convert PDF pages to JPG images. Extract individual pages or convert entire PDF. Free and secure.",
    keywords: "PDF to JPG, PDF to image, extract, convert, online tool",
    ogImage: `${DOMAIN}/og-image-pdf-jpg.jpg`,
    canonical: `${DOMAIN}/pdf-to-jpg`,
  },
  MERGE_PDF: {
    title: "Merge PDF Files - Combine Multiple PDFs Online",
    description:
      "Merge multiple PDF files into one. Rearrange pages, secure, and free. No registration required.",
    keywords: "merge PDF, combine PDF, join PDF, online tool",
    ogImage: `${DOMAIN}/og-image-merge-pdf.jpg`,
    canonical: `${DOMAIN}/merge-pdf`,
  },
  SPLIT_PDF: {
    title: "Split PDF - Extract Pages from PDF Files",
    description:
      "Extract specific pages from PDF files. Split PDF by page range. Free and secure PDF splitting tool.",
    keywords: "split PDF, extract pages, separate PDF, online tool",
    ogImage: `${DOMAIN}/og-image-split-pdf.jpg`,
    canonical: `${DOMAIN}/split-pdf`,
  },
  COMPRESS_PDF: {
    title: "PDF Compressor - Reduce PDF File Size Online",
    description:
      "Reduce PDF file size while preserving quality. Perfect for email and storage. Free and secure compression.",
    keywords: "PDF compressor, reduce size, optimize PDF, online tool",
    ogImage: `${DOMAIN}/og-image-compress-pdf.jpg`,
    canonical: `${DOMAIN}/compress-pdf`,
  },
} as const;

export const DOMAIN_URL = DOMAIN;
