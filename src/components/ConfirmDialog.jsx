export default function ConfirmDialog({
  open,
  title = "Potvrzení",
  message = "Opravdu chcete smazat tuto položku?",
  confirmText = "Smazat",
  cancelText = "Zrušit",
  onConfirm,
  onCancel,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-fadeIn">

        <div className="flex justify-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-3xl">
            🗑️
          </div>
        </div>

        <h2 className="text-center text-2xl font-bold">
          {title}
        </h2>

        <p className="mt-4 text-center text-slate-600">
          {message}
        </p>

        <p className="mt-2 text-center text-sm text-red-600">
          Tuto akci již nelze vrátit.
        </p>

        <div className="mt-8 flex justify-end gap-3">

          <button
            onClick={onCancel}
            className="rounded-lg border border-slate-300 px-5 py-2 font-medium hover:bg-slate-100"
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            className="rounded-lg bg-red-600 px-5 py-2 font-medium text-white hover:bg-red-700"
          >
            {confirmText}
          </button>

        </div>

      </div>
    </div>
  );
}