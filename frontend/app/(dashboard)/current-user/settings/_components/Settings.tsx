"use client";

import AvatarWithEditButton from "@/components/AvatarWithEditButton";
import type { UserFormData } from "@/constants/formTypes";
import type { User } from "@/constants/interfaces";
import { showToast } from "@/helpers/toast";
import { useApiClient } from "@/lib/useApiClient";
import { userSchema } from "@/schemas/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Label, Spinner, TextInput } from "flowbite-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function SettingsPage() {
  const router = useRouter();
  const { data: session, update } = useSession();
  const [currentUser, setCurrentUser] = useState<User | undefined>();
  const [selectedImage, setSelectedImage] = useState<File | null>();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  });
  const { request } = useApiClient();

  const fetchUser = useCallback(async () => {
    if (!session?.accessToken) return;
    const user = await request(`/users/${session?.user.id}/profile`);
    const currentUser = user || session?.user;
    setValue("username", currentUser.username);
    setValue("email", currentUser.email);
    setValue("name", currentUser.name);
    setCurrentUser(currentUser);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user]);

  useEffect(() => {
    if (session?.user) {
      fetchUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user]);

  const appendData = (data: UserFormData) => {
    const formData = new FormData();
    formData.append("password", data.password ? data.password : "");
    formData.append("email", data.email ? data.email : "");
    formData.append("name", data.name ? data.name : "");
    selectedImage && formData.append("image", selectedImage);
    return formData;
  };

  const onSubmit = useCallback(
    async (data: UserFormData) => {
      if (!session?.accessToken) return;
      const formData = appendData(data);
      try {
        const user = await request(`/users/${currentUser?.id}/profile`, {
          method: "PATCH",
          body: formData,
          isFormData: true,
        });
        // update data session current user
        update({
          user: {
            id: user.id,
            username: user.username,
            name: user.name,
            email: user.email,
            image: user.image,
            role: user.role.name,
          },
        });
        showToast("success", "Perubahan berhasil disimpan");
        router.push("/");
      } catch (error) {
        showToast("error", "Terjadi kesalahan, coba lagi nanti.");
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [session?.accessToken, appendData, currentUser?.id, router],
  );

  return (
    <div className="flex flex-col gap-4 p-4">
      <h3 className="text-xl font-medium text-gray-900 dark:text-white">
        Pengaturan User
      </h3>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <div className="flex items-center justify-center">
              <AvatarWithEditButton
                userImage={session?.user?.image}
                onSelectedImageHandler={(img) => setSelectedImage(img)}
              />
            </div>
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="username" value="Username" />
            </div>
            <TextInput
              {...register("username")}
              id="username"
              type="text"
              color={errors.username && "failure"}
              helperText={errors?.username?.message}
              disabled
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="password" value="Password" />
            </div>
            <TextInput
              {...register("password")}
              id="password"
              type="password"
              color={errors.password && "failure"}
              helperText={errors?.password?.message}
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="email" value="Email" />
            </div>
            <TextInput
              {...register("email")}
              id="email"
              type="email"
              color={errors.email && "failure"}
              helperText={errors?.email?.message}
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="name" value="Name" />
            </div>
            <TextInput
              {...register("name")}
              id="name"
              type="text"
              color={errors.name && "failure"}
              helperText={errors?.name?.message}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button color={"blue"} type="submit" disabled={isSubmitting}>
            {isSubmitting && <Spinner size={"sm"} />}
            <span className={isSubmitting ? "pl-3" : ""}>Simpan</span>
          </Button>
          <Button color="red" onClick={() => router.push("/")}>
            Batal
          </Button>
        </div>
      </form>
    </div>
  );
}
