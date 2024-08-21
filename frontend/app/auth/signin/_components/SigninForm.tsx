'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { Button, Label, Spinner, TextInput } from "flowbite-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/schemas/schemas";
import { LoginFormData } from "@/constants/formTypes";

export default function SigninForm() {
  const router = useRouter();
  const [error, setError] = useState('')
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
      setError('Gagal Log In, periksa username dan password anda.')
    } else {
      setError('');
      router.push("/");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-y-1">
        <div className="mb-2 block">
          <Label htmlFor="username" value="Username anda" className="text-gray-500 dark:text-gray-400" />
        </div>
        <TextInput {...register('username')} id="username" type="text" placeholder="username" />
        {errors.username && <p className="mt-2 text-sm font-light text-red-500">{errors.username.message}</p>}
      </div>
      <div className="flex flex-col gap-y-1">
        <div className="mb-2 block">
          <Label htmlFor="password" value="Password anda" className="text-gray-500 dark:text-gray-400" />
        </div>
        <TextInput {...register('password')} id="password" type="password" placeholder="password" />
        {errors.password && <p className="mt-2 text-sm font-light text-red-500">{errors.password.message}</p>}
        {error && <p className="mt-2 text-sm font-light text-red-500">{error}</p>}
      </div>
      <Button color={'blue'} type="submit" disabled={isSubmitting}>
        {isSubmitting && <Spinner size={'sm'} />}
        <span className="pl-3">Log In</span>
      </Button>
    </form>
  )
}