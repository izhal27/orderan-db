"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { Button, Label, Spinner, TextInput } from "flowbite-react";
import { OrderTypeFormData, UserFormData } from '@/constants/formTypes';
import { userSchema } from "@/schemas/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { showToast } from "@/helpers/toast";
import BackButton from '@/components/buttons/BackButton';
import { User } from "@/constants/interfaces";

interface props {
  orderType?: User
}

export default function UsersAddEdit({ orderType }: props) {
  let isEditMode = !!orderType;
  const router = useRouter();
  const { data: session } = useSession();
  const {
    register,
    handleSubmit,
    setValue,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  });

  useEffect(() => {
    setFocus('name');
    if (isEditMode && orderType) {
      setValue('username', orderType.username);
      setValue('name', orderType.name);
    }
  }, [orderType]);

  const onSubmit = async (data: UserFormData) => {
    return !isEditMode ? addHandler(data) : editHandler(orderType!.id, data);
  }

  const addHandler = async (data: UserFormData) => {
    const res = await fetch('http://localhost:3002/api/users',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }
    )
    showInfo(res, await res.json());
  }

  const editHandler = async (id: number, data: UserFormData) => {
    const res = await fetch(`http://localhost:3002/api/users/${id}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }
    )
    showInfo(res, await res.json());
  }

  function showInfo(res: Response, orderType: any) {
    if (res.ok) {
      showToast('success', `User "${orderType.name}" berhasil ${isEditMode ? 'disimpan' : 'ditambahkan'}.`);
      router.back();
    }
    else if (res.status == 409) {
      showToast('error', "Username sudah digunakan, coba dengan nama yang lain.");
    }
    else {
      showToast('error', "Terjadi kesalahan, coba lagi nanti.");
    }
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <BackButton />
      <h3 className="text-xl font-medium text-gray-900 dark:text-white">
        {`${isEditMode ? 'Ubah' : 'Tambah'} User`}
      </h3>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="mb-2 block">
              <Label htmlFor="username" value="Username" />
            </div>
            <TextInput {...register('username')} id="username" type="text" />
            {errors.username && <p className="mt-2 text-sm font-light text-red-500">{errors.username.message}</p>}
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="password" value="Password" />
            </div>
            <TextInput {...register('password')} id="password" type="password" />
            {errors.password && <p className="text-sm font-light text-red-500">{errors.password.message}</p>}
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="email" value="Email" />
            </div>
            <TextInput {...register('email')} id="email" type="email" />
            {errors.email && <p className="mt-2 text-sm font-light text-red-500">{errors.email.message}</p>}
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="name" value="Name" />
            </div>
            <TextInput {...register('name')} id="name" type="text" />
            {errors.name && <p className="mt-2 text-sm font-light text-red-500">{errors.name.message}</p>}
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
