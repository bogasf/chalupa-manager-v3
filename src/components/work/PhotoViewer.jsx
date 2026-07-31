export default function PhotoViewer({
  photo,
  onClose,
}) {
  if (!photo) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-full max-w-7xl"
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-3 rounded-full bg-white px-3 py-1 font-bold shadow"
        >
          ✕
        </button>

        <img
          src={photo.url}
          alt={photo.name}
          className="max-h-[90vh] max-w-[90vw] rounded-lg"
        />
      </div>
    </div>
  );
}