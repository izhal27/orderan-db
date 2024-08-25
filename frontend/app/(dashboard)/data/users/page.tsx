'use client'

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { User } from "@/constants/interfaces";
import AddButton from "@/components/buttons/AddButton";
import { UsersTable } from "./_components/Table";
import SkeletonTable from "@/components/SkeletonTable";
import { showToast } from "@/helpers";
import ConfirmModal from "@/components/ConfirmModal";

export default function UsersPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const pathName = usePathname();
  const [users, setUsers] = useState<User[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      const res = await fetch("http://localhost:3002/api/users", {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
        cache: "no-store",
      });
      if (res.ok) {
        setUsers(await res.json());
      } else {
        showToast("error", "Terjadi kesalahan saat memuat data, coba lagi nanti");
      }
    };
    if (session) {
      fetchData();
    }
    setLoading(false);
  }, [session]);

  const onRemoveHandler = async () => {
    // periksa jika user yang mempunyai role admin masih ada setelah user dihapus
    // jika tidak, tampilkan error
    const filteredUsers = users.filter((user) => user.id !== deleteId);
    const isAdminUserExists = filteredUsers.some(
      (user) => user.role.name === "admin",
    );
    if (!isAdminUserExists) {
      showToast("error", "Minimal harus ada satu admin user.");
      setOpenModal(false);
    } else {
      const res = await fetch(`http://localhost:3002/api/users/${deleteId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      });
      if (res.ok) {
        const deletedObject = await res.json();
        const updatedOrderTypes = users.filter(
          (item) => item.id !== deletedObject.id,
        );
        setUsers(updatedOrderTypes);
        setOpenModal(false);
        showToast(
          "success",
          `User "${deletedObject.username}" berhasil dihapus.`,
        );
      }
    }
  };

  let table = null;
  if (loading) {
    table = (
      <SkeletonTable
        columnsName={["Username", "Email", "Nama", "Blocked", "Role", ""]}
      />
    );
  } else {
    table = (
      <UsersTable
        data={users}
        onEditHandler={(id) => router.push(`${pathName}/${id}`)}
        onRemoveHandler={(id) => {
          setDeleteId(id);
          setOpenModal(true);
        }}
      />
    );
  }

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
      {table}
      <ConfirmModal
        text="Anda yakin ingin menghapus data ini?"
        openModal={openModal}
        onCloseHandler={() => {
          setDeleteId(null);
          setOpenModal(false);
        }}
        onYesHandler={() => onRemoveHandler()}
      />
    </main>
  );
}
