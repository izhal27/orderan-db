import { useEffect, useState } from "react";
import SelectInput from "@/components/SelectInput";
import { OrderType } from "@/constants";
import { useApiClient } from "@/lib/apiClient";

interface props {
    onSelectValueHandler: (value: string) => void;
}

export default function OrderTypeSelectInput({ onSelectValueHandler }: props) {
    const [options, setOptions] = useState<OrderType[]>([]);
    const [selectedValue, setSelectedValue] = useState<string>('');
    const {request} = useApiClient();

    const fetchOrderTypes = async () => {
        try {
            const response = await request("/order-types");
            setOptions(response);
        } catch (error) {
            console.error(error);
        }
    }
    useEffect(() => {
        fetchOrderTypes();
    }, []);
    
    const handleChange = (value: string) => {
        console.log(value);
        setSelectedValue(value);
        onSelectValueHandler(value);
    }   
    
    return (
        <div>
            <SelectInput 
                options={options?.length > 0 ? options.map(opt => ({ value: opt.name, label: opt.name })) : []} 
                onChange={handleChange} 
                value={selectedValue}
                placeholder="-- Pilih Jenis Pesanan --"
            />
        </div>
    );
}
