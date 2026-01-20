import Home from "../pages/home";
import JpgToPng from "../pages/jpgToPng";
import PngToJpg from "../pages/pngToJpg";
import CompressImage from "../pages/compressImage";
import ResizeImage from "../pages/resizeImage";
import JpgToPdf from "../pages/jpgToPdf";
import MergePdf from "../pages/mergePdf";
import SplitPdf from "../pages/splitPdf";
import PdfToJpg from "../pages/pdfToJpg";
import WordToPdf from "../pages/wordToPdf";
import PdfToWord from "../pages/pdfToWord";
import { ROUTES } from "./routePaths";
import { Routes, Route } from "react-router-dom";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<Home />} />
      <Route path={ROUTES.JPG_TO_PNG} element={<JpgToPng />} />
      <Route path={ROUTES.PNG_TO_JPG} element={<PngToJpg />} />
      <Route path={ROUTES.COMPRESS_IMAGE} element={<CompressImage />} />
      <Route path={ROUTES.RESIZE_IMAGE} element={<ResizeImage />} />
      <Route path={ROUTES.JPG_TO_PDF} element={<JpgToPdf />} />
      <Route path={ROUTES.MERGE_PDF} element={<MergePdf />} />
      <Route path={ROUTES.SPLIT_PDF} element={<SplitPdf />} />
      <Route path={ROUTES.PDF_TO_JPG} element={<PdfToJpg />} />
      <Route path={ROUTES.WORD_TO_PDF} element={<WordToPdf />} />
      <Route path={ROUTES.PDF_TO_WORD} element={<PdfToWord />} />
    </Routes>
  );
};
export default AppRoutes;
