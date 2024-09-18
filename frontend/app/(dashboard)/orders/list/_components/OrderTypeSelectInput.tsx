import SelectInput from "@/components/SelectInput";
import type { OrderType } from "@/constants";
import { COMMON_ERROR_MESSAGE } from "@/helpers";
import { useApiClient } from "@/lib/apiClient";
import { useCallback, useEffect, useRef, useState } from "react";

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
  const fetchedRef = useRef(false);

  const fetchOrderTypes = useCallback(async () => {
    try {
      const response = await request("/order-types");
      setOptions(response);
    } catch (error) {
      console.error(COMMON_ERROR_MESSAGE);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!fetchedRef.current) {
      fetchOrderTypes();
      fetchedRef.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
