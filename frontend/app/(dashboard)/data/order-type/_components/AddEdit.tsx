"use client";

import BackButton from "@/components/buttons/BackButton";
import type { OrderTypeFormData } from "@/constants/formTypes";
import type { OrderType } from "@/constants/interfaces";
import { showToast } from "@/helpers/toast";
import { orderTypeSchema } from "@/schemas/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Label, Spinner, TextInput } from "flowbite-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface props {
  orderType?: OrderType;
}

export default function OrderTypeAddEdit({ orderType }: props) {
  const isEditMode = !!orderType;
  const router = useRouter();
  const { data: session } = useSession();
  const {
    register,
    handleSubmit,
    setValue,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<OrderTypeFormData>({
    resolver: zodResolver(orderTypeSchema),
  });

  useEffect(() => {
    setFocus("name");
    if (isEditMode && orderType) {
      setValue("name", orderType.name);
      setValue("description", orderType.description);
    }
  }, [orderType]);

  const onSubmit = async (data: OrderTypeFormData) => {
    return !isEditMode ? addHandler(data) : editHandler(orderType!.id, data);
  };

  const addHandler = async (data: OrderTypeFormData) => {
    const res = await fetch("http://localhost:3002/api/order-types", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    showInfo(res, await res.json());
  };

  const editHandler = async (id: number, data: OrderTypeFormData) => {
    const res = await fetch(`http://localhost:3002/api/order-types/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    showInfo(res, await res.json());
  };

  function showInfo(res: Response, orderType: any) {
    if (res.ok) {
      showToast(
        "success",
        `Jenis Pesanan "${orderType.name}" berhasil ${isEditMode ? "disimpan" : "ditambahkan"}.`,
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
        {`${isEditMode ? "Ubah" : "Tambah"} Jenis Pesanan`}
      </h3>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="mb-2 block">
              <Label htmlFor="name" value="Nama" />
            </div>
            <TextInput {...register("name")} id="name" type="text" />
            {errors.name && (
              <p className="mt-2 text-sm font-light text-red-500">
                {errors.name.message}
              </p>
            )}
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="description" value="Keterangan" />
            </div>
            <TextInput {...register("description")} id="name" type="text" />
            {errors.description && (
              <p className="text-sm font-light text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Button color={"blue"} type="submit" disabled={isSubmitting}>
            {isSubmitting && <Spinner size={"sm"} />}
            <span className={isSubmitting ? "pl-3" : ""}>
              {isEditMode ? "Simpan" : "Tambah"}
            </span>
          </Button>
          <Button color="red" onClick={() => router.back()}>
            Batal
          </Button>
        </div>
      </form>
    </div>
  );
}
