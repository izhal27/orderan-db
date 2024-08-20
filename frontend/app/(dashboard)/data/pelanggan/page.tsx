import { CustomerTable } from "@/component/customer/Table";
import AddButton from "@/component/buttons/AddButton";

export default function PelangganPage() {
  return (
    <main className="flex flex-col gap-4 p-4"><div>
      <h1 className="text-2xl font-bold text-gray-500 dark:text-gray-400">
        Pelanggan
      </h1>
      <p className="text-sm font-light text-gray-500 dark:text-gray-400">
        Menampilkan daftar pelanggan
      </p>
    </div>
      <div className="flex justify-end">
        <div className="max-w-32">
          <AddButton />
        </div>
      </div>
      <CustomerTable />
    </main>
  );
}
