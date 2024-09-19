import { useState, useEffect } from "react";

type ConfirmPasswordModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (password: string) => void;
};

export default function ConfirmPasswordModal({ isOpen, onClose, onConfirm }: ConfirmPasswordModalProps) {
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (isOpen) {
      setPassword(""); // Clear password when modal opens
    }
  }, [isOpen]);

  const handleConfirm = () => {
    if (password.trim().length < 3) return;
    onConfirm(password);
    setPassword("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={onClose}>
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg" onClick={(e) => e.stopPropagation()}>
        <h2 className="mb-4 text-white">Masukan password untuk melanjutkan.</h2>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 text-black rounded"
        />
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1 text-white bg-red-500 rounded">Batal</button>
          <button disabled={password.trim().length < 3} onClick={handleConfirm} className="px-3 py-1 text-white bg-green-500 rounded disabled:opacity-50 disabled:cursor-not-allowed">Konfirmasi</button>
        </div>
      </div>
    </div>
  );
}