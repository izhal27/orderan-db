import { Button } from "flowbite-react";
import { HiDocumentAdd } from "react-icons/hi";
import { JenisPesananTable } from "@/app/component/jenis-pesanan/JenisPesananTable";

export default function JenisPesananPage() {
  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold text-gray-500 dark:text-gray-400">Jenis Pesanan</h1>
      <JenisPesananTable />
    </main>
  );
}