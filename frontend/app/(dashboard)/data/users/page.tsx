import AddButton from "@/components/buttons/AddButton";
import { UsersTable } from "./_components/Table";

export default function UsersPage() {
  return (
    <main className="flex flex-col gap-4 p-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-500 dark:text-gray-400">
          Users
        </h1>
        <p className="text-sm font-light text-gray-500 dark:text-gray-400">
          Menampilkan daftar pengguna applikasi
        </p>
      </div>
      <div className="flex justify-end">
        <div className="max-w-32">
          <AddButton />
        </div>
      </div>
      <UsersTable />
    </main>
  );
}