import { useRouter } from "next/navigation";
import { HiArrowLeft } from "react-icons/hi";

export function BackButton() {
  const router = useRouter();

  return (
    <div>
      <a className="flex cursor-pointer text-gray-900 dark:text-white text-sm font-light" onClick={() => router.back()}>
        <HiArrowLeft className="mr-2 size-5" />
        Kembali
      </a>
    </div>
  )
}