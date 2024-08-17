'use client'

import { Button, Label, Spinner, TextInput } from "flowbite-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../schemas/loginSchema";
import { FormData } from '../types/formTypes';
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SigninForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(loginSchema),
  });
  const router = useRouter();

  const onSubmit = async (data: FormData) => {
    const { username, password } = data;
    const res = await signIn("credentials", {
      redirect: false,
      username,
      password,
    });

    if (res?.error) {
      console.log(res?.error);
    } else {
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
        {errors.username && <p className="text-sm font-light text-red-500">{errors.username.message}</p>}
      </div>
      <div className="flex flex-col gap-y-1">
        <div className="mb-2 block">
          <Label htmlFor="password" value="Password anda" className="text-gray-500 dark:text-gray-400" />
        </div>
        <TextInput {...register('password')} id="password" type="password" placeholder="password" />
        {errors.password && <p className="text-sm font-light text-red-500">{errors.password.message}</p>}
      </div>
      <Button color={'blue'} type="submit" disabled={isSubmitting}>
        {isSubmitting && <Spinner size={'sm'} />}
        <span className="pl-3">Log In</span>
      </Button>
    </form>
  )
}