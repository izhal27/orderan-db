import { auth } from "@/auth";
import AddButton from "@/component/buttons/AddButton";
import { JenisPesananTable } from "@/component/jenis-pesanan/JenisPesananTable";

export default async function JenisPesananPage() {
  const session = await auth();
  let data = [];

  try {
    const res = await fetch('http://localhost:3002/api/order-types', {
      headers: {
        Authorization: `Bearer ${session?.accessToken}`
      },
      cache: 'no-store'
    });
    data = await res.json();
  } catch (error) {
    console.log(error);
  }

  return (
    <main className="flex flex-col gap-y-5 p-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-500 dark:text-gray-400">
          Jenis Pesanan
        </h1>
        <p className="text-sm font-light text-gray-500 dark:text-gray-400">
          Menampilkan daftar jenis pesanan
        </p>
      </div>
      <div className="max-w-32">
        <AddButton />
      </div>
      <JenisPesananTable data={data} />
    </main>
  );
}
