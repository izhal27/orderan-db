"use client";

import AvatarWithEditButton from "@/components/AvatarWithEditButton";
import BackButton from "@/components/buttons/BackButton";
import type { UserFormData } from "@/constants/formTypes";
import type { User } from "@/constants/interfaces";
import { isConflict } from "@/helpers";
import { COMMON_ERROR_MESSAGE, showToast } from "@/helpers/toast";
import { useApiClient } from "@/lib/useApiClient";
import { userSchema } from "@/schemas/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Label,
  Spinner,
  TextInput,
  ToggleSwitch,
} from "flowbite-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { RoleSelectInput } from "./RoleSelectInput";

interface props {
  user?: User;
}

export default function UsersAddEdit({ user }: props) {
  const isEditMode = !!user;
  const router = useRouter();
  const { data: session, update } = useSession();
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

  const { request } = useApiClient();

  useEffect(() => {
    setFocus("username");
    if (user) {
      setValue("username", user.username);
      setValue("email", user.email);
      setValue("name", user.name);
      setRoleId(user.roleId);
      setBlocked(user.blocked);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditMode]);

  const onSubmit = async (data: UserFormData) => {
    if (!roleId || roleId === 0) {
      setError("roleId", {
        type: "required",
        message: "User harus memiliki role",
      });
      return;
    }

    return isEditMode ? editHandler(user.id, data) : addHandler(data);
  };

  const appendData = useCallback(
    async (data: UserFormData) => {
      const formData = new FormData();
      formData.append("username", data.username);
      formData.append("password", data.password ? data.password : "");
      formData.append("email", data.email ? data.email : "");
      formData.append("name", data.name ? data.name : "");
      formData.append("blocked", JSON.stringify(blocked));
      roleId && formData.append("roleId", roleId.toString());
      selectedImage && formData.append("image", selectedImage);
      return formData;
    },
    [blocked, roleId, selectedImage],
  );

  const addHandler = useCallback(
    async (data: UserFormData) => {
      // password harus ada, jika tidak ada tampilkan error
      if (!data.password) {
        setError("password", {
          type: "required",
          message: "Anda belum memasukkan password",
        });
        return;
      }

      try {
        const formData = await appendData(data);
        const res = await request("/users", {
          method: "POST",
          body: formData,
          isFormData: true,
        });
        showToast("success", `User "${res.username}" berhasil ditambahkan"`);
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
    [appendData, request, router, setError],
  );

  const editHandler = useCallback(
    async (id: string, data: UserFormData) => {
      try {
        // jika user admin diganti role selain admin, tampilkan error
        if (
          (user?.id === "1" ||
            (user?.username === "admin" && user?.role.name === "admin")) &&
          roleId !== 1
        ) {
          showToast("error", "Admin user harus memiliki role admin");
        } else {
          const formData = await appendData(data);
          const res = await request(`/users/${id}`, {
            method: "PATCH",
            body: formData,
            isFormData: true,
          });
          // update data session current user
          session?.user.id === res.id &&
            update({
              user: {
                id: res.id,
                username: res.username,
                name: res.name,
                email: res.email,
                image: res.image,
                role: res.role.name,
              },
            });
          showToast("success", `User "${res.username}" berhasil disimpan"`);
        }
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
    [appendData, request, router, session, user, roleId, update],
  );

  return (
    <div className="flex flex-col gap-4 p-4">
      <BackButton />
      <h3 className="text-xl font-medium text-gray-900 dark:text-white">
        {`${isEditMode ? "Ubah" : "Tambah"} User`}
      </h3>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <div className="flex items-center justify-center">
              <AvatarWithEditButton
                userImage={user?.image}
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
          <div className="max-w-fit">
            <RoleSelectInput
              onSelectHandler={(id) => setRoleId(id === 0 ? null : id)}
              selectedUserRoleId={roleId}
            />
            {errors.roleId && (
              <p className="mt-2 text-sm font-light text-red-500">
                {errors.roleId.message}
              </p>
            )}
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="blocked" value="Blocked" />
            </div>
            <ToggleSwitch
              id="blocked"
              checked={blocked}
              label={blocked ? "Ya" : "Tidak"}
              onChange={() => setBlocked((prevState) => !prevState)}
            />
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
