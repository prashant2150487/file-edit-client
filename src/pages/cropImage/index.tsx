import { useState, useRef, useEffect, useCallback } from "react";
import type { ChangeEvent, DragEvent } from "react";
import Header from "../../component/header";
import SEO from "../../component/seo";
import StructuredData from "../../component/seo/StructuredData";
import { SEO_METADATA } from "../../constants/seoMetadata";
import { generateSoftwareApplicationSchema } from "../../utils/structuredData";
import "./cropImage.scss";

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

type AspectRatio = "free" | "1:1" | "16:9" | "9:16" | "4:3" | "3:2";

const ASPECT_RATIOS: { label: string; value: AspectRatio }[] = [
  { label: "Free", value: "free" },
  { label: "1:1", value: "1:1" },
  { label: "16:9", value: "16:9" },
  { label: "9:16", value: "9:16" },
  { label: "4:3", value: "4:3" },
  { label: "3:2", value: "3:2" },
];

const getAspectRatioValue = (ratio: AspectRatio): number | null => {
  switch (ratio) {
    case "1:1":
      return 1;
    case "16:9":
      return 16 / 9;
    case "9:16":
      return 9 / 16;
    case "4:3":
      return 4 / 3;
    case "3:2":
      return 3 / 2;
    default:
      return null;
  }
};

const CropImage = () => {
  const metadata = SEO_METADATA.CROP_IMAGE;

  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [croppedUrl, setCroppedUrl] = useState<string>("");
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("free");
  const [isDragging, setIsDragging] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawStart, setDrawStart] = useState({ x: 0, y: 0 });
  const [cropArea, setCropArea] = useState<CropArea | null>(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 });

  // For handle-based resizing
  const [activeHandle, setActiveHandle] = useState<string | null>(null);
  const [handleStart, setHandleStart] = useState({ x: 0, y: 0 });
  const [handleCropStart, setHandleCropStart] = useState<CropArea | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Cleanup URLs
  useEffect(() => {
    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
      if (croppedUrl) URL.revokeObjectURL(croppedUrl);
    };
  }, [imageUrl, croppedUrl]);

  const loadFile = (f: File) => {
    if (!f.type.startsWith("image/")) return;
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    if (croppedUrl) URL.revokeObjectURL(croppedUrl);
    setFile(f);
    setImageUrl(URL.createObjectURL(f));
    setCroppedUrl("");
    setCropArea(null);
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      loadFile(e.target.files[0]);
    }
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      loadFile(e.dataTransfer.files[0]);
    }
  };

  const onImageLoad = () => {
    if (!imgRef.current) return;
    const img = imgRef.current;
    setImageSize({ width: img.clientWidth, height: img.clientHeight });
    setNaturalSize({ width: img.naturalWidth, height: img.naturalHeight });

    // Set default crop area (center 80%)
    const defaultW = img.clientWidth * 0.8;
    const defaultH = img.clientHeight * 0.8;
    setCropArea({
      x: (img.clientWidth - defaultW) / 2,
      y: (img.clientHeight - defaultH) / 2,
      width: defaultW,
      height: defaultH,
    });
  };

  // Constrain crop area to aspect ratio
  const constrainToAspect = useCallback(
    (area: CropArea, maxW: number, maxH: number): CropArea => {
      const ratio = getAspectRatioValue(aspectRatio);
      if (!ratio) return area;

      let { x, y, width, height } = area;

      // Constrain by ratio
      const currentRatio = width / height;
      if (currentRatio > ratio) {
        width = height * ratio;
      } else {
        height = width / ratio;
      }

      // Clamp to image bounds
      if (x + width > maxW) x = maxW - width;
      if (y + height > maxH) y = maxH - height;
      if (x < 0) x = 0;
      if (y < 0) y = 0;

      return { x, y, width: Math.max(20, width), height: Math.max(20, height) };
    },
    [aspectRatio],
  );

  // Drawing a new crop rectangle
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!canvasRef.current || activeHandle) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if click is inside existing crop (to drag it)
    if (cropArea) {
      if (
        x >= cropArea.x &&
        x <= cropArea.x + cropArea.width &&
        y >= cropArea.y &&
        y <= cropArea.y + cropArea.height
      ) {
        // Start dragging the crop area
        setActiveHandle("move");
        setHandleStart({ x, y });
        setHandleCropStart({ ...cropArea });
        return;
      }
    }

    setIsDrawing(true);
    setDrawStart({ x, y });
    setCropArea({ x, y, width: 0, height: 0 });
  };

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const mx = Math.max(0, Math.min(e.clientX - rect.left, imageSize.width));
      const my = Math.max(0, Math.min(e.clientY - rect.top, imageSize.height));

      if (isDrawing) {
        let x = Math.min(drawStart.x, mx);
        let y = Math.min(drawStart.y, my);
        let w = Math.abs(mx - drawStart.x);
        let h = Math.abs(my - drawStart.y);

        const ratio = getAspectRatioValue(aspectRatio);
        if (ratio) {
          const currentRatio = w / h;
          if (currentRatio > ratio) {
            w = h * ratio;
          } else {
            h = w / ratio;
          }
          // Re-derive position based on draw direction
          if (mx < drawStart.x) x = drawStart.x - w;
          if (my < drawStart.y) y = drawStart.y - h;
        }

        // Clamp to bounds
        x = Math.max(0, x);
        y = Math.max(0, y);
        if (x + w > imageSize.width) w = imageSize.width - x;
        if (y + h > imageSize.height) h = imageSize.height - y;

        setCropArea({ x, y, width: w, height: h });
      } else if (activeHandle && handleCropStart) {
        const dx = mx - handleStart.x;
        const dy = my - handleStart.y;

        if (activeHandle === "move") {
          let newX = handleCropStart.x + dx;
          let newY = handleCropStart.y + dy;
          newX = Math.max(
            0,
            Math.min(newX, imageSize.width - handleCropStart.width),
          );
          newY = Math.max(
            0,
            Math.min(newY, imageSize.height - handleCropStart.height),
          );
          setCropArea({
            ...handleCropStart,
            x: newX,
            y: newY,
          });
        } else {
          let { x, y, width, height } = handleCropStart;

          if (activeHandle.includes("e")) width = Math.max(20, width + dx);
          if (activeHandle.includes("w")) {
            x = x + dx;
            width = Math.max(20, width - dx);
          }
          if (activeHandle.includes("s")) height = Math.max(20, height + dy);
          if (activeHandle.includes("n")) {
            y = y + dy;
            height = Math.max(20, height - dy);
          }

          // Clamp
          if (x < 0) {
            width += x;
            x = 0;
          }
          if (y < 0) {
            height += y;
            y = 0;
          }
          if (x + width > imageSize.width) width = imageSize.width - x;
          if (y + height > imageSize.height) height = imageSize.height - y;

          const result = constrainToAspect(
            { x, y, width, height },
            imageSize.width,
            imageSize.height,
          );
          setCropArea(result);
        }
      }
    },
    [
      isDrawing,
      drawStart,
      aspectRatio,
      imageSize,
      activeHandle,
      handleStart,
      handleCropStart,
      constrainToAspect,
    ],
  );

  const handleMouseUp = () => {
    setIsDrawing(false);
    setActiveHandle(null);
    setHandleCropStart(null);
  };

  // Handle resize drag
  const handleResizeStart = (e: React.MouseEvent, handleName: string) => {
    e.stopPropagation();
    if (!canvasRef.current || !cropArea) return;
    const rect = canvasRef.current.getBoundingClientRect();
    setActiveHandle(handleName);
    setHandleStart({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setHandleCropStart({ ...cropArea });
  };

  // Perform the crop
  const performCrop = () => {
    if (!file || !cropArea || !imgRef.current) return;

    const scaleX = naturalSize.width / imageSize.width;
    const scaleY = naturalSize.height / imageSize.height;

    const sx = cropArea.x * scaleX;
    const sy = cropArea.y * scaleY;
    const sw = cropArea.width * scaleX;
    const sh = cropArea.height * scaleY;

    const canvas = document.createElement("canvas");
    canvas.width = sw;
    canvas.height = sh;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
      canvas.toBlob((blob) => {
        if (!blob) return;
        if (croppedUrl) URL.revokeObjectURL(croppedUrl);
        setCroppedUrl(URL.createObjectURL(blob));
      }, file.type || "image/png");
    };
  };

  const downloadCropped = () => {
    if (!croppedUrl || !file) return;
    const a = document.createElement("a");
    a.href = croppedUrl;
    const ext = file.name.split(".").pop() || "png";
    a.download = `cropped-${file.name.replace(/\.[^.]+$/, "")}.${ext}`;
    a.click();
  };

  const reset = () => {
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    if (croppedUrl) URL.revokeObjectURL(croppedUrl);
    setFile(null);
    setImageUrl("");
    setCroppedUrl("");
    setCropArea(null);
  };

  // Update crop area when aspect ratio changes
  useEffect(() => {
    if (cropArea && imageSize.width > 0) {
      const ratio = getAspectRatioValue(aspectRatio);
      if (ratio) {
        const constrained = constrainToAspect(
          cropArea,
          imageSize.width,
          imageSize.height,
        );
        setCropArea(constrained);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aspectRatio]);

  const getCropDimensions = () => {
    if (!cropArea) return null;
    const scaleX = naturalSize.width / imageSize.width;
    const scaleY = naturalSize.height / imageSize.height;
    return {
      width: Math.round(cropArea.width * scaleX),
      height: Math.round(cropArea.height * scaleY),
    };
  };

  const cropDims = getCropDimensions();

  return (
    <div
      className="page-wrapper"
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={onDrop}
    >
      <SEO
        title={metadata.title}
        description={metadata.description}
        keywords={metadata.keywords}
        canonical={metadata.canonical}
        ogImage={metadata.ogImage}
      />
      <StructuredData
        data={generateSoftwareApplicationSchema(
          "Image Cropper",
          metadata.description,
          metadata.canonical,
        )}
      />
      <Header />
      <main className="tool-page crop-tool-page">
        <div className="tool-header">
          <h1>Crop Image</h1>
          <p>
            Select the area you want to keep. Drag to create a crop selection,
            then resize or move it to perfection.
          </p>
        </div>

        {!imageUrl ? (
          <div className={`upload-section ${isDragging ? "drag-active" : ""}`}>
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              ref={fileInputRef}
              onChange={handleFileSelect}
            />
            <div className="upload-drop-zone">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                width="64"
                height="64"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="9" y1="3" x2="9" y2="21"></line>
                <line x1="15" y1="3" x2="15" y2="21"></line>
                <line x1="3" y1="9" x2="21" y2="9"></line>
                <line x1="3" y1="15" x2="21" y2="15"></line>
              </svg>
              <button
                className="select-button"
                onClick={() => fileInputRef.current?.click()}
              >
                Select Image
              </button>
              <p className="drop-text">or drag and drop an image here</p>
            </div>
          </div>
        ) : (
          <div className="crop-workspace">
            {/* Aspect Ratio & Controls */}
            <div className="crop-toolbar">
              <div className="ratio-group">
                <span className="toolbar-label">Aspect Ratio:</span>
                <div className="ratio-buttons">
                  {ASPECT_RATIOS.map((r) => (
                    <button
                      key={r.value}
                      className={`ratio-btn ${aspectRatio === r.value ? "active" : ""}`}
                      onClick={() => setAspectRatio(r.value)}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>
              {cropDims && (
                <div className="crop-dimensions">
                  <span>
                    {cropDims.width} × {cropDims.height} px
                  </span>
                </div>
              )}
              <div className="toolbar-actions">
                <button className="toolbar-btn change-btn" onClick={reset}>
                  Change Image
                </button>
                <button
                  className="toolbar-btn crop-btn"
                  onClick={performCrop}
                  disabled={
                    !cropArea || cropArea.width < 10 || cropArea.height < 10
                  }
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    width="16"
                    height="16"
                  >
                    <path d="M6.13 1L6 16a2 2 0 0 0 2 2h15" />
                    <path d="M1 6.13L16 6a2 2 0 0 1 2 2v15" />
                  </svg>
                  Crop Image
                </button>
              </div>
            </div>

            {/* Canvas Area */}
            <div className="crop-canvas-wrapper">
              <div
                className="crop-canvas"
                ref={canvasRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                style={{
                  cursor: isDrawing ? "crosshair" : "default",
                }}
              >
                <img
                  ref={imgRef}
                  src={imageUrl}
                  alt="To crop"
                  onLoad={onImageLoad}
                  draggable={false}
                />

                {/* Dark overlay outside crop area */}
                {cropArea && cropArea.width > 0 && cropArea.height > 0 && (
                  <>
                    <div
                      className="crop-overlay crop-overlay-top"
                      style={{
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: `${cropArea.y}px`,
                      }}
                    />
                    <div
                      className="crop-overlay crop-overlay-bottom"
                      style={{
                        top: `${cropArea.y + cropArea.height}px`,
                        left: 0,
                        width: "100%",
                        height: `${imageSize.height - cropArea.y - cropArea.height}px`,
                      }}
                    />
                    <div
                      className="crop-overlay crop-overlay-left"
                      style={{
                        top: `${cropArea.y}px`,
                        left: 0,
                        width: `${cropArea.x}px`,
                        height: `${cropArea.height}px`,
                      }}
                    />
                    <div
                      className="crop-overlay crop-overlay-right"
                      style={{
                        top: `${cropArea.y}px`,
                        left: `${cropArea.x + cropArea.width}px`,
                        width: `${imageSize.width - cropArea.x - cropArea.width}px`,
                        height: `${cropArea.height}px`,
                      }}
                    />

                    {/* Crop selection border */}
                    <div
                      className="crop-selection"
                      style={{
                        left: `${cropArea.x}px`,
                        top: `${cropArea.y}px`,
                        width: `${cropArea.width}px`,
                        height: `${cropArea.height}px`,
                      }}
                    >
                      {/* Rule of thirds grid */}
                      <div className="crop-grid">
                        <div
                          className="grid-line grid-h"
                          style={{ top: "33.33%" }}
                        />
                        <div
                          className="grid-line grid-h"
                          style={{ top: "66.66%" }}
                        />
                        <div
                          className="grid-line grid-v"
                          style={{ left: "33.33%" }}
                        />
                        <div
                          className="grid-line grid-v"
                          style={{ left: "66.66%" }}
                        />
                      </div>

                      {/* Resize handles */}
                      {["nw", "n", "ne", "w", "e", "sw", "s", "se"].map(
                        (handle) => (
                          <div
                            key={handle}
                            className={`crop-handle crop-handle-${handle}`}
                            onMouseDown={(e) => handleResizeStart(e, handle)}
                          />
                        ),
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Cropped result */}
            {croppedUrl && (
              <div className="crop-result">
                <div className="result-header">
                  <h3>Cropped Result</h3>
                  <button
                    className="toolbar-btn download-btn"
                    onClick={downloadCropped}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      width="16"
                      height="16"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    Download
                  </button>
                </div>
                <div className="result-preview">
                  <img src={croppedUrl} alt="Cropped" />
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default CropImage;
