"use client";

import BackButton from "@/components/buttons/BackButton";
import type { Customer, CustomerFormData } from "@/constants";
import { isConflict } from "@/helpers";
import { COMMON_ERROR_MESSAGE, showToast } from "@/helpers/toast";
import { useApiClient } from "@/lib/apiClient";
import { customerSchema } from "@/schemas/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Label, Spinner, TextInput } from "flowbite-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";

interface props {
  customer?: Customer;
}

export default function CustomerAddEdit({ customer }: props) {
  const isEditMode = !!customer;
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
  });
  const { request } = useApiClient();

  useEffect(() => {
    setFocus("name");
    if (customer) {
      setValue("name", customer.name);
      setValue("address", customer.address);
      setValue("contact", customer.contact);
      setValue("email", customer.email);
      setValue("description", customer.description);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditMode]);

  const onSubmit = async (data: CustomerFormData) => {
    return isEditMode ? editHandler(customer.id, data) : addHandler(data);
  };

  const addHandler = useCallback(
    async (data: CustomerFormData) => {
      try {
        const customer = await request("/customers", {
          method: "POST",
          body: JSON.stringify(data),
        });
        showToast(
          "success",
          `Pelanggan "${customer.name}" berhasil ditambahkan"`,
        );
        router.back();
      } catch (error) {
        if (isConflict(error as Error)) {
          showToast(
            "error",
            "Nama sudah digunakan, coba dengan nama yang lain.",
          );
        } else {
          showToast("error", COMMON_ERROR_MESSAGE);
        }
      }
    },
    [request, router],
  );

  const editHandler = useCallback(
    async (id: string, data: CustomerFormData) => {
      try {
        const customer = await request(`/customers/${id}`, {
          method: "PATCH",
          body: JSON.stringify(data),
        });
        showToast("success", `Pelanggan "${customer.name}" berhasil disimpan"`);
        router.back();
      } catch (error) {
        if (isConflict(error as Error)) {
          showToast(
            "error",
            "Nama sudah digunakan, coba dengan nama yang lain.",
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
        {`${isEditMode ? "Ubah" : "Tambah"} Pelanggan`}
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
              <Label htmlFor="address" value="Alamat" />
            </div>
            <TextInput {...register("address")} id="address" type="text" />
            {errors.address && (
              <p className="mt-2 text-sm font-light text-red-500">
                {errors.address.message}
              </p>
            )}
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="contact" value="Kontak" />
            </div>
            <TextInput {...register("contact")} id="contact" type="text" />
            {errors.contact && (
              <p className="mt-2 text-sm font-light text-red-500">
                {errors.contact.message}
              </p>
            )}
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="email" value="Email" />
            </div>
            <TextInput {...register("email")} id="email" type="text" />
            {errors.email && (
              <p className="mt-2 text-sm font-light text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="description" value="Keterangan" />
            </div>
            <TextInput
              {...register("description")}
              id="description"
              type="text"
            />
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
