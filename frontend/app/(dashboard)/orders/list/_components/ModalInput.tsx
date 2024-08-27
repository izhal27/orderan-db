
"use client";

import { OrderDetail, OrderDetailFormData } from "@/constants";
import { orderDetailSchema } from "@/schemas/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Checkbox, Label, Modal, TextInput } from "flowbite-react";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";

interface props {
  show: boolean;
  onAddHandler(item: OrderDetail): void;
  onCloseHandler(): void;
}

export function ModalInput({ show, onAddHandler, onCloseHandler }: props) {
  const {
    register,
    handleSubmit,
    setValue,
    setFocus,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<OrderDetailFormData>({
    resolver: zodResolver(orderDetailSchema),
  });

  const onSubmit = (data: OrderDetailFormData) => {
    onAddHandler({ ...data } as OrderDetail);
    reset();
  }

  const onClose = () => {
    reset();
    onCloseHandler();
  }

  return (
    <>
      <Modal show={show} size="md" onClose={onClose} popup>
        <Modal.Header />
        <Modal.Body>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">Item Pesanan</h3>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="order-type" value="Jenis Pesanan" />
                </div>
                <TextInput
                  {...register('name')}
                  id="order-type"
                  color={errors.name && 'failure'}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="width" value="Width" />
                  </div>
                  <TextInput
                    {...register('width', { valueAsNumber: true })}
                    id="width"
                    type="number"
                    placeholder="0"
                    color={errors.width && 'failure'}
                    max={100000}
                  />
                </div>
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="height" value="Height" />
                  </div>
                  <TextInput
                    {...register('height', { valueAsNumber: true })}
                    id="heigth"
                    type="number"
                    placeholder="0"
                    color={errors.height && 'failure'}
                    max={100000}
                  />
                </div>
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="qty" value="Qty" />
                  </div>
                  <TextInput
                    {...register('qty', { valueAsNumber: true })}
                    id="qty"
                    type="number"
                    placeholder="0"
                    color={errors.qty && 'failure'}
                    max={10000}
                  />
                </div>
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="design" value="Design" />
                  </div>
                  <TextInput
                    {...register('design', { valueAsNumber: true })}
                    id="design"
                    type="number"
                    placeholder="0"
                    color={errors.design && 'failure'}
                    max={1000}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    {...register('eyelets')}
                    id="eyelets" />
                  <Label htmlFor="eyelets" className="flex">
                    Mata Ayam
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    {...register('shiming')}
                    id="shiming"
                  />
                  <Label htmlFor="shiming" className="flex">
                    Shiming
                  </Label>
                </div>
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="description" value="Keterangan" />
                </div>
                <TextInput
                  {...register('description')}
                  id="description"
                />
              </div>
            </div>
            <div className="w-full flex gap-2">
              <Button size={"sm"} color={"blue"} type="submit">
                Tambah
              </Button>
              <Button size={"sm"} color={"red"} onClick={onClose}>
                Batal
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
}
