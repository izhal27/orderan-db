import type { KeyboardEvent } from "react";
import { useEffect, useRef, useState } from "react";

type ConfirmPasswordModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (password: string) => void;
};

export default function ConfirmPasswordModal({
  isOpen,
  onClose,
  onConfirm,
}: ConfirmPasswordModalProps) {
  const [password, setPassword] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setPassword(""); // Clear password when modal opens
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  }, [isOpen]);

  const handleConfirm = () => {
    if (password.trim().length < 3) return;
    onConfirm(password);
    setPassword("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDialogElement>) => {
    if (e.key === "Enter") {
      handleConfirm();
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <dialog
      open={isOpen}
      className="fixed inset-0 z-50 flex size-full items-center justify-center bg-gray-900/50 dark:bg-gray-900/80"
      onClick={onClose}
      onKeyDown={handleKeyDown}
    >
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      <div
        className="rounded-lg bg-white p-6 shadow dark:bg-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-4 text-black dark:text-white">
          Masukan password untuk melanjutkan.
        </h2>
        <input
          ref={inputRef}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 w-full rounded p-2 text-black"
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded bg-red-500 px-3 py-1 text-white"
          >
            Batal
          </button>
          <button
            disabled={password.trim().length < 3}
            onClick={handleConfirm}
            className="rounded bg-green-500 px-3 py-1 text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Konfirmasi
          </button>
        </div>
      </div>
    </dialog>
  );
}
