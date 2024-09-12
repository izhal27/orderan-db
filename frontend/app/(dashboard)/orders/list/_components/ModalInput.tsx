"use client";

import type { OrderDetail, OrderDetailFormData } from "@/constants";
import { orderDetailSchema } from "@/schemas/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Checkbox, Label, Modal, TextInput } from "flowbite-react";
import { forwardRef, useImperativeHandle, useState } from "react";
import { useForm } from "react-hook-form";
import OrderTypeSelectInput from "./OrderTypeSelectInput";

interface props {
  show: boolean;
  onAddHandler(item: OrderDetail): void;
  onEditHandler(index: number, item: Partial<OrderDetail>): void;
  onCloseHandler(): void;
}

const ModalInput = forwardRef(
  ({ show, onAddHandler, onEditHandler, onCloseHandler }: props, ref) => {
    const {
      register,
      handleSubmit,
      setValue,
      reset,
      formState: { errors },
    } = useForm<OrderDetailFormData>({
      resolver: zodResolver(orderDetailSchema),
    });
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [orderTypeName, setOrderTypeName] = useState("");

    const onSubmit = (data: OrderDetailFormData) => {
      if (!orderTypeName) {
        return;
      }
      const orderDetail = { name: orderTypeName, ...data };
      if (selectedIndex === null) {
        onAddHandler(orderDetail as OrderDetail);
      } else {
        onEditHandler(selectedIndex, orderDetail as OrderDetail);
      }
      setSelectedIndex(null);
      reset();
    };

    const onClose = () => {
      reset();
      setSelectedIndex(null);
      setOrderTypeName("");
      onCloseHandler();
    };

    useImperativeHandle(ref, () => ({
      setOrderdetailForm(index: number, data: OrderDetail) {
        const {
          name,
          width,
          height,
          qty,
          design,
          eyelets,
          shiming,
          description,
        } = data;
        setSelectedIndex(index);
        setOrderTypeName(name);
        setValue("width", width);
        setValue("height", height);
        setValue("qty", qty);
        setValue("design", design);
        setValue("eyelets", eyelets);
        setValue("shiming", shiming);
        setValue("description", description);
      },
    }));

    return (
      <>
        <Modal show={show} size="md" onClose={onClose} popup>
          <Modal.Header />
          <Modal.Body>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                  Item Pesanan
                </h3>
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="order-type" value="Jenis Pesanan" />
                  </div>

                  <div className="relative">
                    <OrderTypeSelectInput
                      onSelectValueHandler={(value) => setOrderTypeName(value)}
                      value={orderTypeName}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="mb-2 block">
                      <Label htmlFor="width" value="Width" />
                    </div>
                    <TextInput
                      {...register("width", { valueAsNumber: true })}
                      id="width"
                      type="number"
                      color={errors.width && "failure"}
                      min={0}
                      max={100000}
                    />
                  </div>
                  <div>
                    <div className="mb-2 block">
                      <Label htmlFor="height" value="Height" />
                    </div>
                    <TextInput
                      {...register("height", { valueAsNumber: true })}
                      id="heigth"
                      type="number"
                      color={errors.height && "failure"}
                      min={0}
                      max={100000}
                    />
                  </div>
                  <div>
                    <div className="mb-2 block">
                      <Label htmlFor="qty" value="Qty" />
                    </div>
                    <TextInput
                      {...register("qty", { valueAsNumber: true })}
                      id="qty"
                      type="number"
                      color={errors.qty && "failure"}
                      min={1}
                      max={10000}
                    />
                  </div>
                  <div>
                    <div className="mb-2 block">
                      <Label htmlFor="design" value="Design" />
                    </div>
                    <TextInput
                      {...register("design", { valueAsNumber: true })}
                      id="design"
                      type="number"
                      color={errors.design && "failure"}
                      min={0}
                      max={1000}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox {...register("eyelets")} id="eyelets" />
                    <Label htmlFor="eyelets" className="flex">
                      Mata Ayam
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox {...register("shiming")} id="shiming" />
                    <Label htmlFor="shiming" className="flex">
                      Shiming
                    </Label>
                  </div>
                </div>
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="description" value="Keterangan" />
                  </div>
                  <TextInput {...register("description")} id="description" />
                </div>
              </div>
              <div className="flex w-full gap-2">
                <Button size={"sm"} color={"blue"} type="submit">
                  {selectedIndex === null ? "Tambah" : "Simpan"}
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
  },
);

ModalInput.displayName = "ModalInput";

export default ModalInput;
