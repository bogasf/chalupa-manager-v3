import { useState } from "react";
import PhotoViewer from "./PhotoViewer";

export default function PhotoGallery({
  photos = [],
}) {
  const [selected, setSelected] = useState(null);

  if (!photos.length) {
    return (
      <p className="text-sm text-slate-400">
        Bez fotografií
      </p>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {photos.map((photo, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setSelected(photo)}
            className="overflow-hidden rounded-lg border transition hover:shadow-lg"
          >
            <img
              src={photo.url}
              alt={photo.name}
              className="h-32 w-full object-cover"
            />
          </button>
        ))}
      </div>

      <PhotoViewer
        photo={selected}
        onClose={() => setSelected(null)}
      />
    </>
  );
}