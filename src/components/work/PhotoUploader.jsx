import { useRef } from "react";

export default function PhotoUploader({
  photos = [],
  setPhotos,
  maxFiles = 10,
}) {
  const inputRef = useRef(null);

  function addFiles(files) {
    const imageFiles = Array.from(files).filter((file) =>
      file.type.startsWith("image/")
    );

    const merged = [...photos, ...imageFiles].slice(0, maxFiles);

    setPhotos(merged);
  }

  function remove(index) {
    const updated = photos.filter((_, i) => i !== index);
    setPhotos(updated);
  }

  function handleDrop(e) {
    e.preventDefault();
    addFiles(e.dataTransfer.files);
  }

  function handleDragOver(e) {
    e.preventDefault();
  }

  return (
    <div className="space-y-4 md:col-span-2">
      <label className="block text-sm font-semibold">
        Fotografie
      </label>

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="rounded-xl border-2 border-dashed border-slate-300 p-6 text-center"
      >
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
        >
          📷 Vybrat fotografie
        </button>

        <p className="mt-3 text-sm text-slate-500">
          nebo sem fotografie přetáhni
        </p>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          capture="environment"
          multiple
          hidden
          onChange={(e) => addFiles(e.target.files)}
        />
      </div>

      {photos.length > 0 && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {photos.map((photo, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-lg border"
            >
              <img
                src={URL.createObjectURL(photo)}
                alt=""
                className="h-40 w-full object-cover"
              />

              <button
                type="button"
                onClick={() => remove(index)}
                className="absolute right-2 top-2 rounded-full bg-red-600 px-2 py-1 text-xs text-white"
              >
                ✕
              </button>

              <div className="truncate p-2 text-xs">
                {photo.name}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}