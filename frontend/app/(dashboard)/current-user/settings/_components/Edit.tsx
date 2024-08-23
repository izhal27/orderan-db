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
import { User } from "@/constants/interfaces";
import AvatarWithEditButton from "@/components/AvatarWithEditButton";

export default function EditPage() {
  const router = useRouter();
  const { data: session, update } = useSession();
  const [currentUser, setCurrentUser] = useState<User | undefined>()
  const [selectedImage, setSelectedImage] = useState<File | null>();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  });

  useEffect(() => {
    if (session?.user) {
      const fetchData = async () => {
        const res = await fetch(`http://localhost:3002/api/users/${session.user.id}/profile`,
          {
            headers: {
              Authorization: `Bearer ${session?.accessToken}`
            },
            cache: 'no-store',
          }
        )
        const user = await res.json();
        const fetchUser = user || session.user;
        setValue('username', fetchUser.username);
        setValue('email', fetchUser.email);
        setValue('name', fetchUser.name);
        setCurrentUser(fetchUser);
      }
      fetchData();
    }
  }, [session])

  const appendData = (data: UserFormData) => {
    const formData = new FormData();
    formData.append('password', data.password ? data.password : '');
    formData.append('email', data.email ? data.email : '');
    formData.append('name', data.name ? data.name : '');
    selectedImage && formData.append('image', selectedImage);
    return formData;
  }

  const onSubmit = async (data: UserFormData) => {
    const formData = appendData(data);
    const res = await fetch(`http://localhost:3002/api/users/${currentUser?.id}/profile`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${session?.accessToken}`
        },
        body: formData,
      }
    )
    const infoToast = (type: any, content: any) => showToast(
      type,
      content,
      {
        position: 'top-center',
        hideProgressBar: true
      });
    if (res.ok) {
      infoToast('success', 'Perubahan berhasil disimpan');
      router.back();
    }
    else if (res.status == 409) {
      infoToast('error', "Username sudah digunakan, coba dengan nama yang lain.");
    }
    else {
      infoToast('error', "Terjadi kesalahan, coba lagi nanti.");
    }
    const user = await res.json();
    // update data session current user
    session?.user.id === user.id && update({ user });
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <h3 className="text-xl font-medium text-gray-900 dark:text-white">
        Pengaturan User
      </h3>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <div className="flex justify-center items-center">
              <AvatarWithEditButton
                userImage={session?.user?.image}
                onSelectedImageHandler={(img) => setSelectedImage(img)} />
            </div>
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="username" value="Username" />
            </div>
            <TextInput
              {...register('username')}
              id="username"
              type="text" color={errors.username && 'failure'}
              helperText={errors?.username?.message}
              disabled
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="password" value="Password" />
            </div>
            <TextInput
              {...register('password')}
              id="password" type="password"
              color={errors.password && 'failure'}
              helperText={errors?.password?.message}
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="email" value="Email" />
            </div>
            <TextInput
              {...register('email')}
              id="email"
              type="email"
              color={errors.email && 'failure'}
              helperText={errors?.email?.message}
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="name" value="Name" />
            </div>
            <TextInput
              {...register('name')}
              id="name" type="text"
              color={errors.name && 'failure'}
              helperText={errors?.name?.message}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button color={'blue'} type="submit" disabled={isSubmitting}>
            {isSubmitting && <Spinner size={'sm'} />}
            <span className={isSubmitting ? "pl-3" : ''}>
              Simpan
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
