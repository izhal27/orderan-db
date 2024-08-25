"use client";

import type { User } from "@/constants/interfaces";
import { showToast } from "@/helpers/toast";
import { Table } from "flowbite-react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { HiPencil, HiTrash } from "react-icons/hi";
import ConfirmModal from "@/components/ConfirmModal";

export function UsersTable() {
  const { data: session } = useSession();
  const router = useRouter();
  const pathName = usePathname();
  const [users, setUsers] = useState<User[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("http://localhost:3002/api/users", {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
        cache: "no-store",
      });
      if (res.ok) {
        setUsers(await res.json());
      }
    };
    if (session) {
      fetchData();
    }
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

  return (
    <div>
      <Table hoverable>
        <Table.Head>
          <Table.HeadCell className="text-center">Username</Table.HeadCell>
          <Table.HeadCell className="text-center">Email</Table.HeadCell>
          <Table.HeadCell className="text-center">Nama</Table.HeadCell>
          <Table.HeadCell className="text-center">Blocked</Table.HeadCell>
          <Table.HeadCell className="text-center">Role</Table.HeadCell>
          <Table.HeadCell className="text-center">Aksi</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {users?.map((item: User) => {
            return (
              <Table.Row
                key={item.id}
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                <Table.Cell className="font-medium text-gray-900 dark:text-white">
                  {item.username}
                </Table.Cell>
                <Table.Cell>{item.email}</Table.Cell>
                <Table.Cell>{item.name}</Table.Cell>
                <Table.Cell className="text-center">{item.blocked ? "Ya" : "Tidak"}</Table.Cell>
                <Table.Cell>{item.role && item.role.name}</Table.Cell>
                <Table.Cell>
                  <div className="flex gap-1 justify-center">
                    <HiPencil
                      className="cursor-pointer text-blue-500"
                      onClick={() => router.push(`${pathName}/${item.id}`)}
                    />
                    <HiTrash
                      className="ml-2 cursor-pointer text-red-500"
                      onClick={() => {
                        setDeleteId(item.id);
                        setOpenModal(true);
                      }}
                    />
                  </div>
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
      <ConfirmModal
        text="Anda yakin ingin menghapus data ini?"
        openModal={openModal}
        onCloseHandler={() => {
          setDeleteId(null);
          setOpenModal(false);
        }}
        onYesHandler={() => onRemoveHandler()}
      />
    </div>
  );
}
