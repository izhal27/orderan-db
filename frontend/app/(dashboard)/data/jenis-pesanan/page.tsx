import { Button } from "flowbite-react";
import { HiDocumentAdd } from "react-icons/hi";
import { JenisPesananTable } from "@/app/component/jenis-pesanan/JenisPesananTable";

export default function JenisPesananPage() {
  return (
    <main className="p-4 flex flex-col gap-y-7">
      <div>
        <h1 className="text-2xl font-bold text-gray-500 dark:text-gray-400">Jenis Pesanan</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm font-light">Menampilkan daftar jenis pesanan</p>
      </div>
      <JenisPesananTable />
    </main>
  );
}