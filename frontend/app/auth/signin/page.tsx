import Image from "next/image";
import SigninForm from "./_components/SigninForm";

export default function LoginPage() {
  return (
    <div className="grid min-h-screen w-full items-center justify-items-center xl:grid-cols-3">
      <div className="flex h-full flex-col items-center justify-around">
        <div className="flex flex-col items-center gap-y-14">
          <div className="mx-auto">
            <Image
              src={"/db-image.png"}
              width={150}
              height={150}
              alt="Digital Berkah logo"
              style={{ objectFit: "contain" }}
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
            <SigninForm />
          </div>
        </div>
        <p className="text-sm font-light text-gray-500 dark:text-gray-400">
          Created by &copy; Risal Walangadi
        </p>
      </div>
      <div className="relative col-span-2 hidden size-[95%] overflow-hidden rounded-2xl xl:block">
        <Image
          src={"/login-page-image.png"}
          fill
          alt="Digital Berkah logo"
          style={{ width: "100%", objectFit: "cover" }}
          className="object-bottom"
        />
      </div>
    </div>
  );
}
