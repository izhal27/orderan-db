"use client";

import BackButton from "@/components/buttons/BackButton";
import type { OrderType, OrderTypeFormData } from "@/constants";
import { isConflict } from "@/helpers";
import { COMMON_ERROR_MESSAGE, showToast } from "@/helpers/toast";
import { useApiClient } from "@/lib/useApiClient";
import { orderTypeSchema } from "@/schemas/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Label, Spinner, TextInput } from "flowbite-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";

interface props {
  orderType?: OrderType;
}

export default function OrderTypeAddEdit({ orderType }: props) {
  const isEditMode = !!orderType;
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<OrderTypeFormData>({
    resolver: zodResolver(orderTypeSchema),
  });
  const { request } = useApiClient();

  useEffect(() => {
    setFocus("name");
    if (orderType) {
      setValue("name", orderType.name);
      setValue("description", orderType.description);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditMode]);

  const onSubmit = async (data: OrderTypeFormData) => {
    return isEditMode ? editHandler(orderType.id, data) : addHandler(data);
  };

  const addHandler = useCallback(
    async (data: OrderTypeFormData) => {
      try {
        const orderType = await request("/order-types", {
          method: "POST",
          body: JSON.stringify(data),
        });
        showToast(
          "success",
          `Jenis Pesanan "${orderType.name}" berhasil ditambahkan"}.`,
        );
        router.back();
      } catch (error) {
        if (isConflict(error as Error)) {
          showToast(
            "error",
            "Nama sudah digunakan, coba dengan nama yang lain",
          );
        } else {
          showToast("error", COMMON_ERROR_MESSAGE);
        }
      }
    },
    [request, router],
  );

  const editHandler = useCallback(
    async (id: number, data: OrderTypeFormData) => {
      try {
        const orderType = await request(`/order-types/${id}`, {
          method: "PATCH",
          body: JSON.stringify(data),
        });
        showToast(
          "success",
          `Jenis Pesanan "${orderType.name}" berhasil disimpan.`,
        );
        router.back();
      } catch (error) {
        if (isConflict(error as Error)) {
          showToast(
            "error",
            "Nama sudah digunakan, coba dengan nama yang lain",
          );
        } else {
          showToast("error", COMMON_ERROR_MESSAGE);
        }
      }
    },
    [request, router],
  );

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
