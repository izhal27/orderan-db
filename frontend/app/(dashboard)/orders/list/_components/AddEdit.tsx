"use client";

import BackButton from "@/components/buttons/BackButton";
import type { CustomerFormData } from "@/constants/formTypes";
import { OrderDetail, Order } from "@/constants/interfaces";
import { showToast } from "@/helpers/toast";
import localDate from "@/lib/getLocalDate";
import { customerSchema } from "@/schemas/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Label, TextInput } from "flowbite-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { HiDocumentAdd, HiSave, HiXCircle } from "react-icons/hi";
import TableOrderDetail from "./TableOrderDetail";
import { ModalInput } from "./ModalInput";

interface props {
  order?: Order;
}

export default function OrderAddEdit({ order }: props) {
  const isEditMode = !!order;
  const router = useRouter();
  const { data: session } = useSession();
  const {
    register,
    handleSubmit,
    setValue,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
  });
  const dummy = Array.from({ length: 10 }, (v, k) => ({
    id: k.toString(),
    name: 'FLEXY BANNER 280 gsm',
    width: 200,
    height: 100,
    qty: ++k,
    design: 1,
    eyelets: true,
    shiming: false,
    description: '',
  }));
  const [data, setData] = useState<OrderDetail[]>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // setFocus("name");
    // if (isEditMode && customer) {
    //   setValue("name", customer.name);
    //   setValue("address", customer.address);
    //   setValue("contact", customer.contact);
    //   setValue("email", customer.email);
    //   setValue("description", customer.description);
    // }
  }, [order]);

  const onSubmit = async (data: CustomerFormData) => {
    return !isEditMode ? addHandler(data) : editHandler(order!.id, data);
  };

  const addHandler = async (data: CustomerFormData) => {
    // const res = await fetch("http://localhost:3002/api/orders", {
    //   method: "POST",
    //   headers: {
    //     Authorization: `Bearer ${session?.accessToken}`,
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(data),
    // });
    // showInfo(res, await res.json());
  };

  const editHandler = async (id: string, data: CustomerFormData) => {
    // const res = await fetch(`http://localhost:3002/api/orders/${id}`, {
    //   method: "PATCH",
    //   headers: {
    //     Authorization: `Bearer ${session?.accessToken}`,
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(data),
    // });
    // showInfo(res, await res.json());
  };

  function showInfo(res: Response, customer: any) {
    if (res.ok) {
      showToast(
        "success",
        `Pelanggan "${customer.name}" berhasil ${isEditMode ? "disimpan" : "ditambahkan"}.`,
      );
      router.back();
    } else if (res.status == 409) {
      showToast("error", "Nama sudah digunakan, coba dengan nama yang lain.");
    } else {
      showToast("error", "Terjadi kesalahan, coba lagi nanti.");
    }
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <BackButton />
      <h3 className="text-xl font-medium text-gray-900 dark:text-white">
        {`${isEditMode ? "Ubah" : "Tambah"} Pesanan`}
      </h3>
      <div className="max-w-lg">
        <div className="flex flex-col gap-4">
          <div className="flex items-center">
            <div className="w-1/4">
              <Label
                htmlFor="tanggal"
                value="Tanggal"
                className="text-gray-500 dark:text-gray-400"
              />
            </div>
            <div>
              <p className="font-medium text-gray-500 dark:text-gray-400">{localDate(Date.now(), 'long')}</p>
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-1/4">
              <Label
                htmlFor="pelanggan"
                value="Pelanggan"
                className="text-gray-500 dark:text-gray-400"
              />
            </div>
            <div className="grow">
              <TextInput
                type='text'
                id='pelanggan'
              />
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-1/4">
              <Label
                htmlFor="keterangan"
                value="Keterangan"
                className="text-gray-500 dark:text-gray-400"
              />
            </div>
            <div className="grow">
              <TextInput
                type='text'
                id='keterangan'
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between">
          <div className="flex gap-4 items-center text-gray-500 dark:text-gray-400">
            <div>
              <Button size={"sm"} color={"blue"} onClick={() => setShowModal(true)}>
                <HiDocumentAdd className="mr-2 size-5" />
                Tambah item
              </Button>
            </div>
            <div className="flex gap-4">
              <p>Items : {data.length}</p>
              <p>|</p>
              <p>Total Qty : {data.reduce((acc, od) => acc + od.qty, 0)}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button size={"sm"} color={"green"}>
              <HiSave className="mr-2 size-5" />
              Simpan
            </Button>
            <Button size={"sm"} color={"red"} onClick={router.back}>
              <HiXCircle className="mr-2 size-5" />
              Batal
            </Button>
          </div>
        </div>
        <TableOrderDetail data={data} />
        <ModalInput
          show={showModal}
          onAddHandler={(item) => {
            setData(prevState => [item, ...prevState]);
            setShowModal(false);
          }}
          onCloseHandler={() => setShowModal(false)}
        />
      </div>
    </div>
  );
}