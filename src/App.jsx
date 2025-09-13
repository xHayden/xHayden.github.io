import { useState, useEffect, Suspense, lazy } from "react";
import "./style/global.css";
import { photos } from "./data/photos";

const BoringLayout = lazy(() => import("./components/layouts/BoringLayout"));
const DesignLayout = lazy(() => import("./components/layouts/DesignLayout"));

const FallbackLoadingLayout = () => (
  <div className="min-h-screen flex justify-center items-center bg-white">
    <div className="w-64">
      <h1 className="text-xl text-center mb-4">Loading...</h1>
      <div className="relative w-full h-2 bg-gray-200 overflow-hidden rounded">
        <div className="absolute h-full w-1/3 bg-black animate-slide" />
      </div>
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
    window.addEventListener("load", preloadImages);
    return () => window.removeEventListener("load", preloadImages);
  }, []);

  function preloadImages() {
    const portfolioImages = photos.map(photoData => photoData.url);

    Promise.all(
      portfolioImages.map((src) =>
        new Promise((resolve) => {
          const img = new Image();
          img.src = src;
          if (img.complete) {
            resolve();
          } else {
            img.onload = img.onerror = () => resolve();
          }
        })
      )
    ).then(() => {
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