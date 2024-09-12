"use client";

import type { Customer } from "@/constants";
import { useApiClient } from "@/lib/apiClient";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import CustomerAddEdit from "../_components/AddEdit";

export default function EditPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession();
  const [customer, setCustomer] = useState<Customer | undefined>(undefined);
  const { request } = useApiClient();

  useEffect(() => {
    if (session) {
      const fetchData = async () => {
        const customer = await request(`/customers/${params.id}`);
        setCustomer(customer);
      };
      fetchData();
    }
  }, [session, params.id, request]);

  return <CustomerAddEdit customer={customer} />;
}
