"use client";

import type { Customer } from "@/constants";
import { useApiClient } from "@/lib/useApiClient";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import CustomerAddEdit from "../_components/AddEdit";

export default function EditPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession();
  const [customer, setCustomer] = useState<Customer | undefined>(undefined);
  const { request } = useApiClient();

  useEffect(() => {
    if (session?.accessToken) {
      const fetchData = async () => {
        const customer = await request(`/customers/${params.id}`);
        setCustomer(customer);
      };
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.accessToken, params.id]);

  return <CustomerAddEdit customer={customer} />;
}
