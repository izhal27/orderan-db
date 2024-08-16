import { PelangganTable } from "@/app/component/pelanggan/PelangganTable";
import { Button } from "flowbite-react";
import { HiDocumentAdd } from "react-icons/hi";

export default function PelangganPage() {
  return (
    <main className="flex flex-col gap-y-3 p-4">
      <h1 className="text-2xl font-bold text-gray-500 dark:text-gray-400">
        Pelanggan
      </h1>
      <div className="mt-2">
        <Button size={"sm"} color={"blue"}>
          <HiDocumentAdd className="mr-2 size-5" />
          Tambah
        </Button>
      </div>
      <PelangganTable />
    </main>
  );
}
