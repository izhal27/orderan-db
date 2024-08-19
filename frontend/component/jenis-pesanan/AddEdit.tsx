"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { Button, Label, Modal, Spinner, Textarea, TextInput } from "flowbite-react";
import { OrderTypeFormData } from '../../types/formTypes';
import { orderTypeSchema } from "@/schemas/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { showToast } from "@/helpers/toast";
import BackButton from '@/component/buttons/BackButton';

interface props {
  orderType?: any
}

export default function AddEdit({ orderType }: props) {
  const isEditMode = !!orderType;
  console.log(isEditMode);

  const router = useRouter();
  const { data: session } = useSession();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<OrderTypeFormData>({
    resolver: zodResolver(orderTypeSchema),
  });

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
      showToast('success', "Jenis Pesanan berhasil disimpan.");
      reset();
    }
    else if (res.status == 409) {
      showToast('error', "Nama sudah digunakan, coba dengan nama yang lain.");
    }
    else {
      showToast('error', "Terjadi kesalahan, coba lagi nanti.");
    }
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <BackButton />
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          <h3 className="text-xl font-medium text-gray-900 dark:text-white">
            Jenis Pesanan
          </h3>
          <div className="flex flex-col gap-4 max-w-md">
            <div>
              <div className="mb-2 block">
                <Label htmlFor="name" value="Nama" />
              </div>
              <TextInput {...register('name')} id="name" type="text" />
              {errors.name && <p className="mt-2 text-sm font-light text-red-500">{errors.name.message}</p>}
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="description" value="Keterangan" />
              </div>
              <Textarea {...register('description')} id="description" rows={4} />
              {errors.description && <p className="text-sm font-light text-red-500">{errors.description.message}</p>}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button color={'blue'} type="submit" disabled={isSubmitting}>
            {isSubmitting && <Spinner size={'sm'} />}
            <span className={isSubmitting ? "pl-3" : ''}>Simpan</span>
          </Button>
          <Button color="red" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
