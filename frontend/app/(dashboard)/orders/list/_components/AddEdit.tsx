"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button, Label, TextInput } from "flowbite-react";
import { HiDocumentAdd, HiSave, HiXCircle } from "react-icons/hi";
import { OrderDetail, Order, Customer } from "@/constants/interfaces";
import { COMMON_ERROR_MESSAGE, showToast } from "@/helpers/toast";
import BackButton from "@/components/buttons/BackButton";
import ConfirmModal from "@/components/ConfirmModal";
import localDate from "@/lib/getLocalDate";
import OrderDetailTable from "./OrderDetailTable";
import ModalInput from "./ModalInput";
import AutoCompleteTextInput from '@/components/AutoCompleteTextInput';
import { useApiClient } from "@/lib/apiClient";

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
  const [deletedOrderDetails, setDeletedOrderDetails] = useState<OrderDetail[]>([]);
  const modalRef = useRef<{
    setOrderdetailForm: (index: number, data: OrderDetail) => void
  }>(null);
  const [customer, setCustomer] = useState<string | undefined>('');
  const [description, setDescription] = useState<string | undefined>('');
  const [someEmpty, setSomeEmpty] = useState(true);
  const {request} = useApiClient();

  useEffect(() => {
    if (order) {
      setCustomer(order?.customer);
      setDescription(order?.description);
      setOrderDetails([...order.OrderDetails]);
    }
  }, [order]);

  const onSubmit = async () => {
    if (!session || someEmpty) {
      return;
    }
    return !isEditMode ? addHandler() : editHandler();
  };

  const addHandler = async () => {
    try {
    const res = await request("/orders", {
      method: "POST",
      body: JSON.stringify({ date: new Date().toISOString(), customer, description, orderDetails }),
    });
    showInfo(res);      
    } catch (error) {      
      showToast("error", COMMON_ERROR_MESSAGE);
    }
  };

  const editHandler = async () => {
    try {      
      const res = await request(`/orders/${order?.id}`, {
        method: "PATCH",
        body: JSON.stringify({ description, orderDetails: [...orderDetails, ...deletedOrderDetails] }),
      });
      showInfo(res);
    } catch (error) {
      showToast("error", COMMON_ERROR_MESSAGE);
    }
  };

  function showInfo(res: Response) {
    showToast(
      "success",
      `Pesanan "${customer?.toUpperCase()}" berhasil ${isEditMode ? "disimpan" : "ditambahkan"}.`,
    );
    router.back();
  }

  const updateItemAtIndex = (index: number, newItem: Partial<OrderDetail>): OrderDetail[] => {
    const updatedData = [...orderDetails.map((item, i) =>
      i === index ? { ...item, ...newItem } : item
    )];
    return updatedData;
  };

  const handleSelectCustomer = (data: any) => {
    setCustomer(data)
  };

  useEffect(() => {
    if (customer?.trim().length && orderDetails.some(item => item.name)) {
      setSomeEmpty(false);
    } else {
      setSomeEmpty(true);
    }
  }, [customer, orderDetails])

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
              <p className="font-medium text-gray-500 dark:text-gray-400">{localDate(Date.now(), 'long')}</p>
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
                fetchUrl="http://localhost:3002/api/customers/filter"
                getDisplayValue={(customer: Customer) => customer.name}
                getKeyValue={(customer: Customer) => customer.id}
                onSelect={handleSelectCustomer}
                accessToken={session?.accessToken}
                onEmptyQueryHandler={() => setSomeEmpty(true)}
                value={isEditMode ? customer : ''}
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
                type='text'
                id='keterangan'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between">
          <div className="flex gap-4 items-center text-gray-500 dark:text-gray-400">
            <div>
              <Button size={"sm"} color={"blue"} onClick={() => setShowModal(true)}>
                <HiDocumentAdd className="mr-2 size-5" />
                Tambah item
              </Button>
            </div>
            <div className="flex gap-4">
              <p>Items : {orderDetails.length}</p>
              <p>|</p>
              <p>Total Qty : {orderDetails.reduce((acc, od) => acc + od.qty, 0)}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button size={"sm"} color={"green"} disabled={someEmpty} onClick={() => setShowConfirmSaveModal(true)}>
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
          onEditHandler={index => {
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
            setOrderDetails(prevState => [...prevState, item]);
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
            if (isEditMode && deletedIndex !== -1) {
              const deletedOd = orderDetails[deletedIndex!];
              deletedOd.deleted = true;
              setDeletedOrderDetails(prevState => [...prevState, deletedOd]);
            }
            const updatedData = orderDetails.filter((_, i) => i !== deletedIndex);
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