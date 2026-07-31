import { useState } from "react";
import PhotoViewer from "./PhotoViewer";

export default function PhotoGallery({ photos = [] }) {
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  if (!photos.length) return null;

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {photos.map((photo, index) => (
          <button
            key={photo.name || photo.url || index}
            type="button"
            onClick={() => setSelectedPhoto(photo)}
            className="overflow-hidden rounded-lg border bg-white shadow-sm transition hover:shadow-md"
          >
            <img
              src={photo.url}
              alt={`Foto ${index + 1}`}
              className="h-20 w-20 object-cover sm:h-24 sm:w-24"
              loading="lazy"
            />
          </button>
        ))}
      </div>

      {selectedPhoto && (
        <PhotoViewer
          photo={selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
        />
      )}
    </>
  );
}