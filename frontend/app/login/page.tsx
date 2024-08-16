
"use client";

import { Button, Label, TextInput } from "flowbite-react";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="w-full min-h-screen grid xl:grid-cols-3 justify-items-center items-center">
      <div className="flex flex-col justify-around items-center h-full">
        <div className="flex flex-col items-center gap-y-14">
          <div className="mx-auto">
            <Image
              src={'/db-image.png'}
              width={150}
              height={150}
              alt="Dunia Baliho logo"
              style={{ objectFit: 'contain' }}
            />
          </div>
          <div className="flex flex-col justify-between gap-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-500 dark:text-gray-400">
                Selamat Datang
              </h1>
              <p className="text-xs font-light text-gray-500 dark:text-gray-400">
                Masukan username dan password anda untuk masuk ke aplikasi
              </p>
            </div>
            <form className="flex flex-col gap-4">
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="email1" value="Username anda" className="text-gray-500 dark:text-gray-400" />
                </div>
                <TextInput id="email1" type="email" placeholder="username" required />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="password1" value="Password anda" className="text-gray-500 dark:text-gray-400" />
                </div>
                <TextInput id="password1" type="password" placeholder="password" required />
              </div>
              <Button color={'blue'} className="mt-3" type="submit">Log In</Button>
            </form>
          </div>
        </div>
        <p className="text-sm font-light text-gray-500 dark:text-gray-400">Created by &copy; Risal Walangadi</p>
      </div>

      <div className="rounded-2xl overflow-hidden col-span-2 w-[95%] relative h-[95%] hidden xl:block">
        <Image
          src={'/login-page-image.png'}
          fill
          alt="Dunia Baliho logo"
          style={{ width: '100%' }}
          objectFit="cover"
          className="object-bottom"
        />
      </div>
    </div>
  )
}