"use client";

import { Button, Label, Modal, Textarea, TextInput } from "flowbite-react";
import { useRef } from "react";

interface props {
  openModal: boolean;
  setOpenModal(arg: boolean): void;
  onSaveHandler({
    name,
    description,
  }: {
    name: string | undefined;
    description: string | undefined;
  }): void;
}

export default function ModalInput({
  openModal,
  setOpenModal,
  onSaveHandler,
}: props) {
  const nameInputRef = useRef<HTMLInputElement>(null);
  const descInputRef = useRef<HTMLTextAreaElement>(null);

  return (
    <Modal
      show={openModal}
      size="md"
      popup
      onClose={() => setOpenModal(false)}
      initialFocus={nameInputRef}
    >
      <Modal.Header />
      <Modal.Body>
        <div className="space-y-6">
          <h3 className="text-xl font-medium text-gray-900 dark:text-white">
            Jenis Pesanan
          </h3>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="name" value="Nama" />
            </div>
            <TextInput id="name" ref={nameInputRef} required />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="description" value="Keterangan" />
            </div>
            <Textarea id="description" ref={descInputRef} rows={4} />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          onClick={() =>
            onSaveHandler({
              name: nameInputRef.current?.value,
              description: descInputRef.current?.value,
            })
          }
        >
          Tambah
        </Button>
        <Button color="red" onClick={() => setOpenModal(false)}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
