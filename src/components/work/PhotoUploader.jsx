import { useRef } from "react";

export default function PhotoUploader({
  photos = [],
  setPhotos,
  maxFiles = 10,
}) {
  const inputRef = useRef(null);

  function addFiles(files) {
    if (!files || files.length === 0) return;

    const imageFiles = Array.from(files).filter(
      (file) =>
        file.type.startsWith("image/") &&
        file.size > 0
    );

    setPhotos((prev) => {
      const merged = [...prev, ...imageFiles];
      return merged.slice(0, maxFiles);
    });
  }

  function remove(index) {
    setPhotos((prev) =>
      prev.filter((_, i) => i !== index)
    );
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
          📷 Přidat fotografie
        </button>

        <p className="mt-3 text-sm text-slate-500">
          Vyber fotografie z telefonu nebo počítače
        </p>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            addFiles(e.target.files);

            // dovolí znovu vybrat stejnou fotografii
            e.target.value = "";
          }}
        />
      </div>

      {photos.length > 0 && (
        <>
          <div className="text-sm text-slate-600">
            Vybráno {photos.length} / {maxFiles} fotografií
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {photos.map((photo, index) => (
              <div
                key={`${photo.name}-${index}`}
                className="relative overflow-hidden rounded-lg border bg-white shadow-sm"
              >
                <img
                  src={URL.createObjectURL(photo)}
                  alt={photo.name}
                  className="h-40 w-full object-cover"
                />

                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="absolute right-2 top-2 rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white hover:bg-red-700"
                >
                  ✕
                </button>

                <div className="truncate p-2 text-xs">
                  {photo.name}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}