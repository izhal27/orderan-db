"use client";

import AutoCompleteTextInput from "@/components/AutoCompleteTextInput";
import BackButton from "@/components/buttons/BackButton";
import ConfirmModal from "@/components/ConfirmModal";
import type { Customer, Order, OrderDetail } from "@/constants/interfaces";
import { COMMON_ERROR_MESSAGE, showToast } from "@/helpers/toast";
import { useApiClient } from "@/lib/apiClient";
import { useMoment } from "@/lib/useMoment";
import { Button, Label, TextInput } from "flowbite-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { HiDocumentAdd, HiSave, HiXCircle } from "react-icons/hi";
import ModalInput from "./ModalInput";
import OrderDetailTable from "./OrderDetailTable";

interface props {
  order?: Order;
}

export default function OrderAddEdit({ order }: props) {
  const isEditMode = !!order;
  const router = useRouter();
  const { data: session } = useSession();
  const [orderDetails, setOrderDetails] = useState<OrderDetail[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [showConfirmSaveModal, setShowConfirmSaveModal] = useState(false);
  const [deletedIndex, setDeletedIndex] = useState<number | null>(null);
  const [deletedOrderDetails, setDeletedOrderDetails] = useState<OrderDetail[]>(
    [],
  );
  const modalRef = useRef<{
    setOrderdetailForm: (index: number, data: OrderDetail) => void;
  }>(null);
  const [customer, setCustomer] = useState<string | undefined>("");
  const [description, setDescription] = useState<string | undefined>("");
  const { request } = useApiClient();
  const { moment } = useMoment();

  useEffect(() => {
    if (order) {
      setCustomer(order?.customer);
      setDescription(order?.description);
      setOrderDetails([...order.OrderDetails]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditMode]);

  const isValid = useMemo(() => {
    return (
      (customer?.trim().length ?? 0) >= 3 &&
      orderDetails.length > 0 &&
      orderDetails.every((item) => item.name?.trim().length)
    );
  }, [customer, orderDetails]);

  const onSubmit = useCallback(async () => {
    if (!session || !isValid) {
      return;
    }
    return isEditMode ? editHandler() : addHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditMode, isValid, session, orderDetails]);

  const addHandler = useCallback(async () => {
    try {
      await request("/orders", {
        method: "POST",
        body: JSON.stringify({
          date: new Date().toISOString(),
          customer,
          description,
          orderDetails,
        }),
      });
      showToast(
        "success",
        `Pesanan "${customer?.toUpperCase()}" berhasil ditambahkan"`,
      );
      router.back();
    } catch (error) {
      showToast("error", COMMON_ERROR_MESSAGE);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customer, description, orderDetails]);

  const editHandler = async () => {
    try {
      await request(`/orders/${order?.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          description,
          orderDetails: [...orderDetails, ...deletedOrderDetails],
        }),
      });
      showToast(
        "success",
        `Pesanan "${customer?.toUpperCase()}" berhasil disimpan"`,
      );
      router.back();
    } catch (error) {
      showToast("error", COMMON_ERROR_MESSAGE);
    }
  };

  // update item in array by index
  const updateItemAtIndex = useCallback(
    (index: number, newItem: Partial<OrderDetail>): OrderDetail[] => {
      const updatedData = [
        ...orderDetails.map((item, i) =>
          i === index ? { ...item, ...newItem } : item,
        ),
      ];
      return updatedData;
    },
    [orderDetails],
  );

  const handleSelectCustomer = useCallback((data: Customer | string) => {
    setCustomer(typeof data === "string" ? data : data.name);
  }, []);

  return (
    <div className="flex flex-col gap-4 p-4">
      <BackButton />
      <h3 className="text-xl font-medium text-gray-900 dark:text-white">
        {`${isEditMode ? "Ubah" : "Tambah"} Pesanan`}
      </h3>
      <div className="max-w-lg">
        <div className="flex flex-col gap-4">
          <div className="flex items-center">
            <div className="w-1/4">
              <Label
                htmlFor="tanggal"
                value="Tanggal"
                className="text-gray-500 dark:text-gray-400"
              />
            </div>
            <div>
              <p className="font-medium text-gray-500 dark:text-gray-400">{`${moment(Date.now()).format("dddd")}, ${moment(Date.now()).format("LL")}`}</p>
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-1/4">
              <Label
                htmlFor="pelanggan"
                value="Pelanggan"
                className="text-gray-500 dark:text-gray-400"
              />
            </div>
            <div className="grow">
              <AutoCompleteTextInput<Customer>
                fetchUrl="/customers/filter"
                getDisplayValue={(customer: Customer) => customer.name}
                getKeyValue={(customer: Customer) => customer.id}
                onSelect={handleSelectCustomer}
                onEmptyQueryHandler={() => setCustomer("")}
                value={isEditMode ? customer : ""}
                onChange={(newValue) => setCustomer(newValue)}
              />
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-1/4">
              <Label
                htmlFor="keterangan"
                value="Keterangan"
                className="text-gray-500 dark:text-gray-400"
              />
            </div>
            <div className="grow">
              <TextInput
                type="text"
                id="keterangan"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between">
          <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400">
            <div>
              <Button
                size={"sm"}
                color={"blue"}
                onClick={() => setShowModal(true)}
              >
                <HiDocumentAdd className="mr-2 size-5" />
                Tambah item
              </Button>
            </div>
            <div className="flex gap-4">
              <p>Items : {orderDetails.length}</p>
              <p>|</p>
              <p>
                Total Qty : {orderDetails.reduce((acc, od) => acc + od.qty, 0)}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              size={"sm"}
              color={"green"}
              disabled={!isValid}
              onClick={() => setShowConfirmSaveModal(true)}
            >
              <HiSave className="mr-2 size-5" />
              Simpan
            </Button>
            <Button size={"sm"} color={"red"} onClick={router.back}>
              <HiXCircle className="mr-2 size-5" />
              Batal
            </Button>
          </div>
        </div>
        <OrderDetailTable
          data={orderDetails}
          onEditHandler={(index) => {
            if (modalRef.current) {
              modalRef.current.setOrderdetailForm(index, orderDetails[index]);
            }
            setShowModal(true);
          }}
          onRemoveHandler={(index) => {
            setDeletedIndex(index);
            setShowConfirmDeleteModal(true);
          }}
        />
        <ModalInput
          show={showModal}
          onAddHandler={(item) => {
            setOrderDetails((prevState) => [...prevState, item]);
            setShowModal(false);
          }}
          onEditHandler={(index, data) => {
            setOrderDetails([...updateItemAtIndex(index, data)]);
            setShowModal(false);
          }}
          onCloseHandler={() => setShowModal(false)}
          ref={modalRef}
        />
        <ConfirmModal
          text="Anda yakin ingin menghapus data ini?"
          openModal={showConfirmDeleteModal}
          onCloseHandler={() => setShowConfirmDeleteModal(false)}
          onYesHandler={() => {
            if (isEditMode && deletedIndex !== null) {
              const deletedOd = orderDetails[deletedIndex];
              deletedOd.deleted = true;
              setDeletedOrderDetails((prevState) => [...prevState, deletedOd]);
            }
            const updatedData = orderDetails.filter(
              (_, i) => i !== deletedIndex,
            );
            setOrderDetails([...updatedData]);
            setShowConfirmDeleteModal(false);
          }}
        />
        <ConfirmModal
          yesButtonColor="success"
          text="Anda yakin ingin menyimpan data ini?"
          openModal={showConfirmSaveModal}
          onCloseHandler={() => setShowConfirmSaveModal(false)}
          onYesHandler={() => {
            onSubmit();
          }}
        />
      </div>
    </div>
  );
}
