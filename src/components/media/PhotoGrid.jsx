import React from "react";

const PhotoGrid = ({ photos }) => {
  if (!Array.isArray(photos)) {
    console.error("PhotoGrid expects 'photos' prop to be an array.");
    return (
      <div className="text-red-500 p-4">
        Error: Invalid photo data provided.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] auto-rows-auto gap-4 grid-auto-flow-dense">
      {photos.map((photo, index) => {
        const photoWidth = parseInt(photo.width, 10);
        const photoHeight = parseInt(photo.height, 10);

        if (
          !photo ||
          !photo.url ||
          isNaN(photoWidth) ||
          photoWidth <= 0 ||
          isNaN(photoHeight) ||
          photoHeight <= 0
        ) {
          console.warn(
            `Skipping invalid photo data (check width/height) at index ${index}:`,
            photo
          );
          return null;
        }

        const aspectRatio = photoWidth / photoHeight;
        const key = photo.id ? `${photo.id}-${index}` : `photo-${index}`;

        return (
          <div
            key={key}
            className=""
            style={{
            //   aspectRatio: aspectRatio,
            }}
          >
            <img
              src={photo.url}
              alt={photo.name || "Gallery image"}
              className="block w-full h-full object-fit"
              loading="lazy"
              width={photoWidth}
              height={photoHeight}
            />
          </div>
        );
      })}
    </div>
  );
};

export default PhotoGrid;
