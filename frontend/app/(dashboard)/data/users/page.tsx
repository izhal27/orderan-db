'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { User } from "@/constants/interfaces";
import AddButton from "@/components/buttons/AddButton";
import { UsersTable } from "./_components/Table";
import SkeletonTable from "@/components/SkeletonTable";
import { showToast } from "@/helpers";
import ConfirmModal from "@/components/ConfirmModal";
import { useApiClient } from "@/lib/apiClient";

export default function UsersPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const pathName = usePathname();
  const [users, setUsers] = useState<User[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>();
  const [loading, setLoading] = useState(true);
  const fetchedRef = useRef(false);
  const { request } = useApiClient();

  const fetchUsers = useCallback(async () => {
    if (!session?.accessToken) {
      return;
    }
    setLoading(true);
    try {
      const data = await request('/users');
      setUsers(data);
    } catch (error) {
      showToast("error", "Terjadi kesalahan saat memuat data, coba lagi nanti");
    }
    setLoading(false);
  }, [session?.accessToken]);

  useEffect(() => {
    if (session && session.accessToken && !fetchedRef.current) {
      fetchUsers();
      fetchedRef.current = true;
    }
  }, [session]);

  const onRemoveHandler = useCallback(async () => {
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
      try {
        const url = `/users/${deleteId}`;
        const deletedObject = await request(`${url}`, { method: "DELETE", body: "" });
        setUsers(prevState => prevState.filter(
          (item) => item.id !== deletedObject.id,
        ));
        showToast("success", `User "${deletedObject.username}" berhasil dihapus.`,
        );
      } catch (error) {
        showToast("error", "Gagal menghapus data, coba lagi nanti.");
      }
      setOpenModal(false);
    }
  }, [session?.accessToken, deleteId]);

  const table = useMemo(() => {
    if (loading) {
      return (
        <SkeletonTable
          columnsName={["Username", "Email", "Nama", "Blocked", "Role", ""]}
        />
      );
    } else {
      return (
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
  }, [loading, users, pathName, router]);

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
