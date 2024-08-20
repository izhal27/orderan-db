"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { Button, Label, Spinner, Textarea, TextInput } from "flowbite-react";
import { CustomerFormData } from '@/types/formTypes';
import { customerSchema } from "@/schemas/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { showToast } from "@/helpers/toast";
import BackButton from '@/component/buttons/BackButton';
import { Customer } from "@/types/constant";

interface props {
  customer?: Customer
}

export default function CustomerAddEdit({ customer }: props) {
  let isEditMode = !!customer;
  const router = useRouter();
  const { data: session } = useSession();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
  });

  useEffect(() => {
    if (isEditMode && customer) {
      setValue('name', customer.name);
      setValue('address', customer.address);
      setValue('contact', customer.contact);
      setValue('email', customer.email);
      setValue('description', customer.description);
    }
  }, [customer]);

  const onSubmit = async (data: CustomerFormData) => {
    return !isEditMode ? addHandler(data) : editHandler(customer!.id, data);
  }

  const addHandler = async (data: CustomerFormData) => {
    const { name, description } = data;
    const res = await fetch('http://localhost:3002/api/customers',
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

  const editHandler = async (id: string, data: CustomerFormData) => {
    const { name, description } = data;
    const res = await fetch(`http://localhost:3002/api/customers/${id}`,
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

  function showInfo(res: Response, customer: any) {
    if (res.ok) {
      showToast('success', `Pelanggan "${customer.name}" berhasil ${isEditMode ? 'disimpan' : 'ditambahkan'}.`);
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
      <h3 className="text-xl font-medium text-gray-900 dark:text-white">
        {`${isEditMode ? 'Ubah' : 'Tambah'} Pelanggan`}
      </h3>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="mb-2 block">
              <Label htmlFor="name" value="Nama" />
            </div>
            <TextInput {...register('name')} id="name" type="text" />
            {errors.name && <p className="mt-2 text-sm font-light text-red-500">{errors.name.message}</p>}
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="address" value="Alamat" />
            </div>
            <TextInput {...register('address')} id="name" type="text" />
            {errors.address && <p className="mt-2 text-sm font-light text-red-500">{errors.address.message}</p>}
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="description" value="Keterangan" />
            </div>
            <Textarea {...register('description')} id="description" rows={4} />
            {errors.description && <p className="text-sm font-light text-red-500">{errors.description.message}</p>}
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
