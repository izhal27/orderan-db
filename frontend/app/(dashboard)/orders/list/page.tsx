"use client";

import AddButton from "@/components/buttons/AddButton";
import ConfirmModal from "@/components/ConfirmModal";
import SkeletonTable from "@/components/SkeletonTable";
import type { Order } from "@/constants";
import { Roles } from "@/constants";
import {
  COMMON_ERROR_MESSAGE,
  getStartAndEndOfDay,
  isContain,
  showToast,
} from "@/helpers";
import { useApiClient } from "@/lib/useApiClient";
import { useMoment } from "@/lib/useMoment";
import { useOrderWebSocket } from "@/lib/useOrderWebSocket";
import { Button, Modal, Select } from "flowbite-react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  HiCheckCircle,
  HiClipboardList,
  HiClock,
  HiInformationCircle,
} from "react-icons/hi";
import ConfirmPasswordModal from "./_components/ConfirmPasswordModal";
import OrderTable from "./_components/OrderTable";

export default function ListOrderPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathName = usePathname();
  const { request } = useApiClient();
  const [openModal, setOpenModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const fetchedRef = useRef(false);
  const [initialOrders, setInitialOrders] = useState<Order[]>([]);
  const orders = useOrderWebSocket(initialOrders, session?.user.id);
  const [showDesignModal, setShowDesignModal] = useState(false);
  const { moment } = useMoment();
  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string>("all");

  const fetchOrders = useCallback(async () => {
    if (status === "loading" || !session?.accessToken) return;
    setIsLoading(true);
    try {
      const { start, end } = getStartAndEndOfDay();
      const url = `/orders/filter?startDate=${start.format()}&endDate=${end.format()}`;
      const { data } = await request(url);
      setInitialOrders(data);
    } catch (error) {
      showToast("error", COMMON_ERROR_MESSAGE);
    }
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.accessToken, status]);

  useEffect(() => {
    if (session?.accessToken && !fetchedRef.current) {
      fetchOrders();
      fetchedRef.current = true;
    }
  }, [session?.accessToken, fetchOrders]);

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
    try {
      const deletedObject = await request(`/orders/${deleteId}`, {
        method: "DELETE",
      });
      setInitialOrders((prevOrders) =>
        prevOrders.filter((order) => order.id !== deletedObject.id),
      );
      showToast(
        "success",
        `Pesanan "${deletedObject.customer}" berhasil dihapus.`,
      );
    } catch (error) {
      showToast("error", COMMON_ERROR_MESSAGE);
    }
    setOpenModal(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteId]);

  const calculateUserDesignCounts = () => {
    const counts: { [key: string]: { paid: number; unpaid: number } } = {};
    orders.forEach((order) => {
      const user = order.user.name || "Unknown";
      const designCount = order.OrderDetails.reduce(
        (sum, od) => sum + od.design,
        0,
      );

      if (!counts[user]) {
        counts[user] = { paid: 0, unpaid: 0 };
      }

      if (order.MarkedPay?.status) {
        counts[user].paid += designCount;
      } else {
        counts[user].unpaid += designCount;
      }
    });
    return Object.entries(counts)
      .map(([user, data]) => ({
        user,
        ...data,
        total: data.paid,
      }))
      .filter((item) => item.paid + item.unpaid > 0);
  };

  const usersWithDesign = useMemo(() => {
    const users = new Set<string>();
    orders.forEach((order) => {
      const hasDesign = order.OrderDetails.some((od) => od.design > 0);
      if (hasDesign && order.user.name) {
        users.add(order.user.name);
      }
    });
    return Array.from(users);
  }, [orders]);

  const filteredOrders = useMemo(() => {
    if (selectedUser === "all") return orders;
    return orders.filter((order) => order.user.name === selectedUser);
  }, [orders, selectedUser]);

  const isAdministrator = useMemo(() => {
    if (!session?.user?.role) return false;
    const userRole = session?.user?.role;
    return (
      isContain(userRole, Roles.ADMIN) ||
      isContain(userRole, Roles.ADMINISTRASI)
    );
  }, [session?.user.role]);

  const calculateOrderStatus = useMemo(() => {
    const total = orders.length;
    const done = orders.filter(
      (order) =>
        order.MarkedPay?.status &&
        order.OrderDetails.every((od) => od.MarkedPrinted?.status) &&
        order.MarkedTaken?.status,
    ).length;
    const onProses =
      orders.filter(
        (order) =>
          order.MarkedPay?.status ||
          (order.OrderDetails.some((od) => od.MarkedPrinted?.status) &&
            !order.MarkedTaken?.status),
      ).length - done;
    return { total, done, onProses };
  }, [orders]);

  const table = useMemo(() => {
    if (status === "loading" || isLoading) {
      return (
        <SkeletonTable
          columnsName={[
            "User",
            "Nomor",
            "Tanggal",
            "Pelanggan",
            "Keterangan",
            "Status",
            "",
          ]}
        />
      );
    } else {
      return (
        <OrderTable
          order={filteredOrders}
          onEditHandler={(id) => router.push(`${pathName}/${id}`)}
          onDetailHandler={(id) => router.push(`${pathName}/detail/${id}`)}
          onRemoveHandler={(id) => {
            setDeleteId(id);
            setOpenPasswordModal(true);
          }}
          session={session}
        />
      );
    }
  }, [isLoading, filteredOrders, pathName, router, session, status]);

  return (
    <main className="flex flex-col gap-4 p-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-500 dark:text-gray-400">
          Daftar Pesanan
        </h1>
        <p className="text-sm font-light text-gray-500 dark:text-gray-400">
          Menampilkan daftar pesanan{" "}
          <span className="font-semibold">{`${moment(Date.now()).format("dddd")}, ${moment(Date.now()).format("LL")}`}</span>
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="flex items-center rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="mr-4 rounded-full bg-orange-100 p-3 text-orange-500 dark:bg-orange-600 dark:text-orange-100">
            <HiClipboardList className="size-5" />
          </div>
          <div>
            <p className="mb-1 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Total Pesanan
            </p>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">
              {calculateOrderStatus.total}
            </p>
          </div>
        </div>
        <div className="flex items-center rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="mr-4 rounded-full bg-blue-100 p-3 text-blue-500 dark:bg-blue-600 dark:text-blue-100">
            <HiClock className="size-5" />
          </div>
          <div>
            <p className="mb-1 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
              On Proses
            </p>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">
              {calculateOrderStatus.onProses}
            </p>
          </div>
        </div>
        <div className="flex items-center rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="mr-4 rounded-full bg-green-100 p-3 text-green-500 dark:bg-green-600 dark:text-green- green-100">
            <HiCheckCircle className="size-5" />
          </div>
          <div>
            <p className="mb-1 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Selesai
            </p>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">
              {calculateOrderStatus.done}
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isAdministrator && (
            <>
              <div className="max-w-40">
                <Button
                  gradientMonochrome="info"
                  size={"sm"}
                  onClick={() => setShowDesignModal(true)}
                >
                  <HiInformationCircle className="mr-2 size-5" />
                  Total Design
                </Button>
              </div>
              <Select
                id="designer-filter"
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="w-48"
                sizing="sm"
              >
                <option value="all">Semua</option>
                {usersWithDesign.map((user) => (
                  <option key={user} value={user}>
                    {user}
                  </option>
                ))}
              </Select>
            </>
          )}
        </div>
        <div className="max-w-40">
          <AddButton text="Buat Pesanan" />
        </div>
      </div>
      {table}
      <ConfirmModal
        text="Anda yakin ingin menghapus data ini?"
        openModal={openModal}
        onCloseHandler={() => setOpenModal(false)}
        onYesHandler={() => onRemoveHandler()}
      />
      <Modal show={showDesignModal} onClose={() => setShowDesignModal(false)} size="2xl">
        <Modal.Header className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <HiInformationCircle className="text-blue-500 size-6" />
            <span>Rekapitulasi Design per User</span>
          </div>
        </Modal.Header>
        <Modal.Body className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
              <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-4">User</th>
                  <th scope="col" className="px-6 py-4 text-center">Terbayar</th>
                  <th scope="col" className="px-6 py-4 text-center">Belum Bayar</th>
                  <th scope="col" className="px-6 py-4 text-center">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {calculateUserDesignCounts().length > 0 ? (
                  calculateUserDesignCounts().map(({ user, paid, unpaid, total }) => (
                    <tr key={user} className="bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700">
                      <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">
                        {user}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
                          {paid.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                          {unpaid.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center font-bold text-gray-900 dark:text-white">
                        {total.toLocaleString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-gray-400">
                      Belum ada data design
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Modal.Body>
        <Modal.Footer className="flex justify-end border-t border-gray-200 dark:border-gray-700">
          <Button color="gray" onClick={() => setShowDesignModal(false)}>
            Tutup
          </Button>
        </Modal.Footer>
      </Modal>
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
