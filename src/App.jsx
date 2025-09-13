import { useState, useEffect, Suspense, lazy } from "react";
import "./style/global.css";
import { photos } from "./data/photos";

const BoringLayout = lazy(() => import("./components/layouts/BoringLayout"));
const DesignLayout = lazy(() => import("./components/layouts/DesignLayout"));

const FallbackLoadingLayout = () => (
  <div className="min-h-screen flex justify-center items-center bg-white">
    <div className="flex flex-col items-center gap-3">
      <div className="h-8 w-8 rounded-full border-2 border-black border-t-transparent animate-spin" />
      <p className="text-sm text-black/60">Loading...</p>
    </div>
  </div>
);

function App() {
  const [design, setDesign] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    if (window.location.pathname === "/old") {
      setDesign(1);
    }
  }, []);

  useEffect(() => {
    preloadImages();
  }, []);

  function preloadImages() {
    const uniqueUrls = Array.from(new Set(photos.map((photo) => photo.url)));

    const preloadPromises = uniqueUrls.map((src) =>
      new Promise((resolve) => {
        const img = new Image();
        img.src = src;

        const finalize = () => resolve();

        // If already cached and decoded
        if (img.complete && img.naturalWidth !== 0) {
          finalize();
          return;
        }

        // Prefer decode() for full readiness; fall back to onload/onerror
        if (typeof img.decode === "function") {
          img
            .decode()
            .then(finalize)
            .catch(finalize);
          // In some browsers decode() may not fire if not yet loaded; ensure a fallback
          img.onload = finalize;
          img.onerror = finalize;
        } else {
          img.onload = finalize;
          img.onerror = finalize;
        }
      })
    );

    Promise.all(preloadPromises).then(() => {
      setImagesLoaded(true);
    });
  }

  return (
    <Suspense fallback={<FallbackLoadingLayout />}>
      {imagesLoaded ? (
        design === 0 ? (
          <DesignLayout />
        ) : (
          <BoringLayout />
        )
      ) : (
        <FallbackLoadingLayout />
      )}
    </Suspense>
  );
}

export default App;