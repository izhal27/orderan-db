"use client";

import { Button, Modal } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";

interface props {
  text: string;
  openModal: boolean;
  onCloseHandler(): void;
  onYesHandler(): void;
}

export default function ConfirmModal({
  text,
  openModal,
  onCloseHandler,
  onYesHandler,
}: props) {
  return (
    <>
      <Modal show={openModal} size="md" onClose={() => onCloseHandler()} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 size-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              {text}
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={() => onYesHandler()}>
                "Ya, lanjutkan"
              </Button>
              <Button color="gray" onClick={() => onCloseHandler()}>
                Tidak, batal
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
