import AddButton from "@/component/buttons/AddButton";
import { JenisPesananTable } from "@/component/jenis-pesanan/JenisPesananTable";

export default async function JenisPesananPage() {
  return (
    <main className="flex flex-col gap-4 p-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-500 dark:text-gray-400">
          Jenis Pesanan
        </h1>
        <p className="text-sm font-light text-gray-500 dark:text-gray-400">
          Menampilkan daftar jenis pesanan
        </p>
      </div>
      <div className="flex justify-end">
        <div className="max-w-32">
          <AddButton />
        </div>
      </div>
      <JenisPesananTable />
    </main>
  );
}
