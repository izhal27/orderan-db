"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { Button, Label, Spinner, Textarea, TextInput } from "flowbite-react";
import { OrderTypeFormData } from '@/types/formTypes';
import { orderTypeSchema } from "@/schemas/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { showToast } from "@/helpers/toast";
import BackButton from '@/component/buttons/BackButton';
import { OrderType } from "@/types/constant";

interface props {
  orderType?: OrderType
}

export default function AddEdit({ orderType }: props) {
  let isEditMode = !!orderType;
  const router = useRouter();
  const { data: session } = useSession();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<OrderTypeFormData>({
    resolver: zodResolver(orderTypeSchema),
  });

  useEffect(() => {
    if (isEditMode && orderType) {
      setValue('name', orderType.name);
      setValue('description', orderType.description);
    }
  }, [orderType]);

  const onSubmit = async (data: OrderTypeFormData) => {
    return !isEditMode ? addHandler(data) : editHandler(orderType!.id, data);
  }

  const addHandler = async (data: OrderTypeFormData) => {
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
    showInfo(res, await res.json());
  }

  const editHandler = async (id: string, data: OrderTypeFormData) => {
    const { name, description } = data;
    const res = await fetch(`http://localhost:3002/api/order-types/${id}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, description })
      }
    )
    showInfo(res, await res.json());
  }

  function showInfo(res: Response, orderType: any) {
    if (res.ok) {
      showToast('success', `Jenis Pesanan "${orderType.name}" berhasil ${isEditMode ? 'disimpan' : 'ditambahkan'}.`);
      router.back();
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
            {`${isEditMode ? 'Ubah' : 'Tambah'} Jenis Pesanan`}
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
            <span className={isSubmitting ? "pl-3" : ''}>
              {isEditMode ? 'Simpan' : 'Tambah'}
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
