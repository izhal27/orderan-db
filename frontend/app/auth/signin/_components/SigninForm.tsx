"use client";

import type { LoginFormData } from "@/constants/formTypes";
import { loginSchema } from "@/schemas/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Label, Spinner, TextInput } from "flowbite-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { HiEye, HiEyeOff, HiKey, HiUser } from "react-icons/hi";

export default function SigninForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const passwordAriaLabel = showPassword
    ? "Sembunyikan password"
    : "Lihat password";
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    const { username, password } = data;
    const res = await signIn("credentials", {
      redirect: false,
      username,
      password,
    });

    if (res?.error) {
      setError("Gagal Log In, periksa username dan password anda.");
    } else {
      setError("");
      router.push("/");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-y-1">
        <div className="mb-2 block">
          <Label
            htmlFor="username"
            value="Username anda"
            className="text-gray-500 dark:text-gray-400"
          />
        </div>
        <TextInput
          {...register("username")}
          id="username"
          type="text"
          placeholder="username"
          icon={HiUser}
        />
        {errors.username && (
          <p className="mt-2 text-sm font-light text-red-500">
            {errors.username.message}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-y-1">
        <div className="mb-2 block">
          <Label
            htmlFor="password"
            value="Password anda"
            className="text-gray-500 dark:text-gray-400"
          />
        </div>
        <div className="relative w-full">
          <HiKey className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            {...register("password")}
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="password"
            className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 pl-10 pr-12 text-sm text-gray-900 focus:border-blue-600 focus:ring-blue-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={passwordAriaLabel}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-gray-400 hover:text-gray-200"
          >
            {showPassword ? <HiEyeOff size={18} /> : <HiEye size={18} />}
          </button>
        </div>
        {errors.password && (
          <p className="mt-2 text-sm font-light text-red-500">
            {errors.password.message}
          </p>
        )}
        {error && (
          <p className="mt-2 text-sm font-light text-red-500">{error}</p>
        )}
      </div>
      <Button color={"blue"} type="submit" disabled={isSubmitting}>
        {isSubmitting && <Spinner size={"sm"} />}
        <span className="pl-3">Log In</span>
      </Button>
    </form>
  );
}
