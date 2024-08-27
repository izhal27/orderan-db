import { forwardRef, useImperativeHandle, useState } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { Button, Checkbox, Label, Modal, TextInput } from "flowbite-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { OrderDetail, OrderDetailFormData, OrderType } from "@/constants";
import { orderDetailSchema } from "@/schemas/schemas";
import AutoCompleteTextInput from "@/components/AutoCompleteTextInput";

interface props {
  show: boolean;
  onAddHandler(item: OrderDetail): void;
  onEditHandler(index: number, item: Partial<OrderDetail>): void;
  onCloseHandler(): void;
}

const ModalInput = forwardRef(({ show, onAddHandler, onEditHandler, onCloseHandler }: props, ref) => {
  const { data: session } = useSession();
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
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [orderTypeName, setOrderTypeName] = useState('');

  const onSubmit = (data: OrderDetailFormData) => {
    if (selectedIndex === null) {
      onAddHandler({ ...data } as OrderDetail);
    } else {
      onEditHandler(selectedIndex, data);
    }
    setSelectedIndex(null);
    reset();
  }

  const onClose = () => {
    reset();
    setSelectedIndex(null);
    onCloseHandler();
  }

  useImperativeHandle(ref, () => ({
    setOrderdetailForm(index: number, data: OrderDetail) {
      const { name, width, height, qty, design, eyelets, shiming, description } = data;
      setSelectedIndex(index);
      setValue('name', name);
      setValue('width', width);
      setValue('height', height);
      setValue('qty', qty);
      setValue('design', design);
      setValue('eyelets', eyelets);
      setValue('shiming', shiming);
      setValue('description', description);
    }
  }));

  const handleSelectOrderType = (orderType: OrderType) => {
    setOrderTypeName(orderType.name);
  };


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
                <AutoCompleteTextInput<OrderType>
                  fetchUrl="http://localhost:3002/api/order-types/filter"
                  getDisplayValue={(customer: OrderType) => customer.name}
                  getKeyValue={(customer: OrderType) => customer.id}
                  onSelect={handleSelectOrderType}
                  accessToken={session?.accessToken}
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
                    color={errors.width && 'failure'}
                    min={1}
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
                    color={errors.height && 'failure'}
                    min={1}
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
                    color={errors.qty && 'failure'}
                    min={1}
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
                {selectedIndex === null ? 'Tambah' : 'Simpan'}
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
});

export default ModalInput;
