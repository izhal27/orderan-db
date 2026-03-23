type ConfirmActionModalProps = {
  isOpen: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onClose: () => void;
  onConfirm: () => void;
};

export default function ConfirmActionModal({
  isOpen,
  title,
  description,
  confirmLabel = "Konfirmasi",
  cancelLabel = "Batal",
  onClose,
  onConfirm,
}: ConfirmActionModalProps) {
  if (!isOpen) return null;

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <dialog
      open={isOpen}
      className="fixed inset-0 z-50 flex size-full items-center justify-center bg-gray-900/60 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      <div
        className="w-full max-w-md rounded-2xl border border-gray-700/70 bg-gray-900/90 p-6 text-gray-100 shadow-[0_20px_60px_rgba(0,0,0,0.45)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-2 text-lg font-semibold text-white">{title}</div>
        {description && (
          <div className="mb-6 text-sm text-gray-400">{description}</div>
        )}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-700 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  );
}
