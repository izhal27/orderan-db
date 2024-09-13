import SelectInput from "@/components/SelectInput";
import type { OrderType } from "@/constants";
import { useApiClient } from "@/lib/apiClient";
import { useCallback, useEffect, useState } from "react";

interface props {
  onSelectValueHandler: (value: string) => void;
  value: string | undefined;
}

export default function OrderTypeSelectInput({
  onSelectValueHandler,
  value,
}: props) {
  const [options, setOptions] = useState<OrderType[]>([]);
  const [selectedValue, setSelectedValue] = useState<string>("");
  const { request } = useApiClient();

  const fetchOrderTypes = useCallback(async () => {
    try {
      const response = await request("/order-types");
      setOptions(response);
    } catch (error) {
      console.error(error);
    }
  }, [request]);

  useEffect(() => {
    fetchOrderTypes();
  }, [fetchOrderTypes]);

  useEffect(() => {
    if (value) {
      setSelectedValue(value);
    }
  }, [value]);

  const handleChange = (value: string) => {
    setSelectedValue(value);
    onSelectValueHandler(value);
  };

  return (
    <div>
      <SelectInput
        options={
          options?.length > 0
            ? options.map((opt) => ({ value: opt.name, label: opt.name }))
            : []
        }
        onChange={handleChange}
        value={selectedValue}
        placeholder="-- Pilih Jenis Pesanan --"
      />
    </div>
  );
}
