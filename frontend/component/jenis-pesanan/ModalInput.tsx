"use client";

import { useState } from "react";
import { Button, Label, Modal, Spinner, Textarea, TextInput } from "flowbite-react";
import { useForm } from "react-hook-form";
import { OrderTypeFormData } from '../../types/formTypes';
import { orderTypeSchema } from "@/schemas/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";

interface props {
  openModal: boolean;
  setOpenModal(arg: boolean): void;
  onSaveHandler({
    name,
    description
  }: {
    name: string | undefined;
    description: string | undefined;
  }): void;
  error?: any;
}

export default function ModalInput({
  openModal,
  setOpenModal,
  onSaveHandler,
  error,
}: props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<OrderTypeFormData>({
    resolver: zodResolver(orderTypeSchema),
  });
  const { data: session } = useSession();
  const [errorRes, setErrorRes] = useState<null | string>(null);

  const onSubmit = async (data: OrderTypeFormData) => {
    const { name, description } = data;
    const res = await fetch('http://localhost:3002/api/order-types',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, description })
      }
    )
    const result = await res.json();
    if (res.ok) {
      reset();
      onSaveHandler(result);
    }
    else if (res.status == 409) {
      setErrorRes('Nama sudah digunakan, coba dengan nama yang lain');
    }
    else {
      setErrorRes('Terjadi kesalahan, coba lagi nanti.');
    }
  }

  function onCloseHandler() {
    reset();
    setOpenModal(false);
  }

  return (
    <Modal
      show={openModal}
      size="md"
      popup
      onClose={() => onCloseHandler()}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
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
              <TextInput {...register('name')} id="name" type="text" />
              {errors.name && <p className="mt-2 text-sm font-light text-red-500">{errors.name.message}</p>}
              {errorRes && <p className="text-sm font-light text-red-500">{errorRes}</p>}
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="description" value="Keterangan" />
              </div>
              <Textarea {...register('description')} id="description" rows={4} />
              {errors.description && <p className="text-sm font-light text-red-500">{errors.description.message}</p>}
            </div>
            {error && <p className="mt-2 text-sm font-light text-red-500">{error}</p>}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button color={'blue'} type="submit" disabled={isSubmitting}>
            {isSubmitting && <Spinner size={'sm'} />}
            <span className="pl-3">Simpan</span>
          </Button>
          <Button color="red" onClick={() => onCloseHandler()}>
            Cancel
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}
