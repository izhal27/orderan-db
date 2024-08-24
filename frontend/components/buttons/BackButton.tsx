import { useRouter } from "next/navigation";
import { HiArrowLeft } from "react-icons/hi";

export default function BackButton() {
  const router = useRouter();

  return (
    <div>
      <a
        className="flex cursor-pointer text-sm font-light text-gray-900 dark:text-white"
        onClick={() => router.back()}
      >
        <HiArrowLeft className="mr-2 size-5" />
        Kembali
      </a>
    </div>
  );
}
