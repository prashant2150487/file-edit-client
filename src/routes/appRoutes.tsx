import Home from "../pages/home";
import JpgToPng from "../pages/jpgToPng";
import { ROUTES } from "./routePaths";
import { Routes, Route } from "react-router-dom";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<Home />} />
      <Route path={ROUTES.JPG_TO_PNG} element={<JpgToPng />} />
    </Routes>
  );
};
export default AppRoutes;
