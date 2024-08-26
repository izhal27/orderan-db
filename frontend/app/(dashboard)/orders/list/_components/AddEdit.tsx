"use client";

import BackButton from "@/components/buttons/BackButton";
import type { CustomerFormData } from "@/constants/formTypes";
import type { Customer, Order } from "@/constants/interfaces";
import { showToast } from "@/helpers/toast";
import localDate from "@/lib/getLocalDate";
import { customerSchema } from "@/schemas/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Label, Spinner, TextInput } from "flowbite-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

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
        {`${isEditMode ? "Ubah" : "Tambah"} Order`}
      </h3>
      <div className="max-w-xl">
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <label
              htmlFor='tanggal'
              className="font-medium text-gray-500 dark:text-gray-400"
            >
              Tanggal
            </label>
            <TextInput
              disabled
              type='text'
              id='tanggal'
              value={localDate(Date.now(), 'long')}
            />
          </div>
          <div className="flex items-center justify-around">
            <label
              htmlFor='pelanggan'
              className="font-medium text-gray-500 dark:text-gray-400"
            >
              Pelanggan
            </label>
            <div className="flex justify-start">
              <TextInput
                type='text'
                id='pelanggan'
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}