import { JenisPesananTable } from "@/app/component/jenis-pesanan/JenisPesananTable";

export default function JenisPesananPage() {
  return (
    <main className="flex flex-col gap-y-7 p-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-500 dark:text-gray-400">
          Jenis Pesanan
        </h1>
        <p className="text-sm font-light text-gray-500 dark:text-gray-400">
          Menampilkan daftar jenis pesanan
        </p>
      </div>
      <JenisPesananTable />
    </main>
  );
}
