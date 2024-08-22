"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { Button, Label, Spinner, TextInput, ToggleSwitch } from "flowbite-react";
import { UserFormData } from '@/constants/formTypes';
import { userSchema } from "@/schemas/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { showToast } from "@/helpers/toast";
import BackButton from '@/components/buttons/BackButton';
import { User } from "@/constants/interfaces";
import { RoleSelectInput } from "./RoleSelectInput";
import AvatarWithEditButton from "@/components/AvatarWithEditButton";

interface props {
  user?: User
}

export default function UsersAddEdit({ user }: props) {
  let isEditMode = !!user;
  const router = useRouter();
  const { data: session } = useSession();
  const [roleId, setRoleId] = useState<number | null>(null);
  const [blocked, setBlocked] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<File | null>();
  const {
    register,
    handleSubmit,
    setValue,
    setFocus,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  });

  useEffect(() => {
    setFocus('username');
    if (isEditMode && user) {
      setValue('username', user.username);
      setValue('email', user.email);
      setValue('name', user.name);
      setRoleId(user.roleId);
      setBlocked(user.blocked);
    }
  }, [user]);

  const onSubmit = async (data: UserFormData) => {
    // set undefined jika user tidak memasukkan email
    data.email = data.email === '' ? undefined : data.email;
    // jika bukan dalam edit mode password harus ada
    if (!isEditMode && !data.password) {
      setError('password', {
        type: 'required',
        message: 'Anda belum memasukkan password'
      });
      return;
    }
    return !isEditMode ? addHandler(data) : editHandler(user!.id, data);
  }

  const addHandler = async (data: UserFormData) => {
    const formData = new FormData();
    formData.append('username', data.username);
    formData.append('password', data.password!);
    // formData.append('body', JSON.stringify({ ...data, roleId, blocked, image: selectedImage }));
    selectedImage && formData.append('image', selectedImage);
    const res = await fetch('http://localhost:3002/api/users',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session?.accessToken}`
        },
        body: formData,
      }
    )
    showInfo(res, await res.json());
  }

  const editHandler = async (id: number, data: UserFormData) => {
    // jika user admin diganti role selain admin, tampilkan error
    if ((user?.id === 1 || user?.username === 'admin') && user?.role.name === 'admin' && roleId !== 1) {
      showToast('error', 'Admin user harus memiliki role admin.');
    } else {
      const res = await fetch(`http://localhost:3002/api/users/${id}`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ ...data, roleId, blocked, })
        }
      )
      showInfo(res, await res.json());
    }
  }

  function showInfo(res: Response, user: User) {
    if (res.ok) {
      showToast('success', `User "${user.username}" berhasil ${isEditMode ? 'disimpan' : 'ditambahkan'}.`);
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
          <div className="col-span-2">
            <div className="flex justify-center items-center">
              <AvatarWithEditButton
                userImage={user?.image}
                onSelectedImageHandler={(img) => setSelectedImage(img)} />
            </div>
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="username" value="Username" />
            </div>
            <TextInput {...register('username')} id="username" type="text" color={errors.username && 'failure'} />
            {errors.username && <p className="mt-2 text-sm font-light text-red-500">{errors.username.message}</p>}
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="password" value="Password" />
            </div>
            <TextInput {...register('password')} id="password" type="password" color={errors.password && 'failure'} />
            {errors.password && <p className="text-sm font-light text-red-500">{errors.password.message}</p>}
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="email" value="Email" />
            </div>
            <TextInput {...register('email')} id="email" type="email" color={errors.email && 'failure'} />
            {errors.email && <p className="mt-2 text-sm font-light text-red-500">{errors.email.message}</p>}
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="name" value="Name" />
            </div>
            <TextInput {...register('name')} id="name" type="text" color={errors.name && 'failure'} />
            {errors.name && <p className="mt-2 text-sm font-light text-red-500">{errors.name.message}</p>}
          </div>
          <div className="max-w-fit">
            <RoleSelectInput
              onSelectHandler={(id) => setRoleId(id === 0 ? null : id)}
              selectedUserRoleId={roleId}
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="blocked" value="Blocked" />
            </div>
            <ToggleSwitch
              id="blocked"
              checked={blocked}
              label={blocked ? 'Ya' : 'Tidak'}
              onChange={() => setBlocked(prevState => !prevState)}
            />
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
