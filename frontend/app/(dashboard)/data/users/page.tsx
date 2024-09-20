"use client";

import AddButton from "@/components/buttons/AddButton";
import ConfirmModal from "@/components/ConfirmModal";
import SkeletonTable from "@/components/SkeletonTable";
import type { User } from "@/constants/interfaces";
import { showToast } from "@/helpers";
import { useApiClient } from "@/lib/useApiClient";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ConfirmPasswordModal from "../../orders/list/_components/ConfirmPasswordModal";
import { UsersTable } from "./_components/Table";

export default function UsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathName = usePathname();
  const [users, setUsers] = useState<User[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>();
  const [isLoading, setIsLoading] = useState(true);
  const fetchedRef = useRef(false);
  const { request } = useApiClient();
  const [openPasswordModal, setOpenPasswordModal] = useState(false);

  const fetchUsers = useCallback(async () => {
    if (status === "loading" || !session?.accessToken) return;
    setIsLoading(true);
    try {
      const data = await request("/users");
      setUsers(data);
    } catch (error) {
      showToast("error", "Terjadi kesalahan saat memuat data, coba lagi nanti");
    }
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.accessToken, status]);

  useEffect(() => {
    if (session?.accessToken && !fetchedRef.current) {
      fetchUsers();
      fetchedRef.current = true;
    }
  }, [session?.accessToken, fetchUsers]);

  const handleModalConfirm = useCallback(
    async (password: string) => {
      setOpenPasswordModal(false);

      try {
        const valid = await request("/auth/validate-password", {
          method: "POST",
          body: JSON.stringify({ password }),
        });

        if (valid) {
          setOpenModal(true);
        } else {
          showToast("error", "Verifikasi password gagal");
        }
      } catch (error) {
        showToast("error", "Terjadi kesalahan saat memvalidasi password");
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

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
        const deletedObject = await request(`/users/${deleteId}`, {
          method: "DELETE",
          body: "",
        });
        setUsers((prevState) =>
          prevState.filter((item) => item.id !== deletedObject.id),
        );
        showToast(
          "success",
          `User "${deletedObject.username}" berhasil dihapus.`,
        );
      } catch (error) {
        showToast("error", "Gagal menghapus data, coba lagi nanti.");
      }
      setOpenModal(false);
    }
  }, [request, deleteId, users]);

  const table = useMemo(() => {
    if (status === "loading" || isLoading) {
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
            setOpenPasswordModal(true);
          }}
        />
      );
    }
  }, [isLoading, users, pathName, router, status]);

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
      <ConfirmPasswordModal
        isOpen={openPasswordModal}
        onClose={() => {
          setOpenPasswordModal(false);
        }}
        onConfirm={handleModalConfirm}
      />
    </main>
  );
}
