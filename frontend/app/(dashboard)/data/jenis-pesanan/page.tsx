import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { JenisPesananTable } from "@/component/jenis-pesanan/JenisPesananTable";
import { getServerSession } from "next-auth";

export default async function JenisPesananPage() {
  const session = await getServerSession(authOptions);
  const res = await fetch('http://localhost:3002/api/order-types', {
    headers: {
      Authorization: `Bearer ${session?.accessToken}`,
      'Content-Type': 'application/json',
    }
  })
  const orderTypes = await res.json();

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
      <JenisPesananTable data={orderTypes} />
    </main>
  );
}
