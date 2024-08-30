'use client'

import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import debounce from 'lodash.debounce';
import { Button, Checkbox, Label, Modal, Spinner, TextInput } from "flowbite-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { OrderDetail, OrderDetailFormData, OrderType } from "@/constants";
import { orderDetailSchema } from "@/schemas/schemas";

interface props {
  show: boolean;
  onAddHandler(item: OrderDetail): void;
  onEditHandler(index: number, item: Partial<OrderDetail>): void;
  onCloseHandler(): void;
}

const ModalInput = forwardRef(({ show, onAddHandler, onEditHandler, onCloseHandler }: props, ref) => {
  const { data: session } = useSession();
  const {
    register,
    handleSubmit,
    setValue,
    setFocus,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<OrderDetailFormData>({
    resolver: zodResolver(orderDetailSchema),
  });
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [orderTypeName, setOrderTypeName] = useState('');
  const [query, setQuery] = useState<string>('');
  const [items, setItems] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [showItems, setShowItems] = useState<boolean>(true);

  const fetchSuggestions = async (searchQuery: string) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3002/api/order-types/filter?query=${searchQuery}`, {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
          'Content-Type': 'application/json',
        }
      });
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchSuggestions = useCallback(
    debounce((searchQuery: string) => {
      if (searchQuery.length >= 3) {
        fetchSuggestions(searchQuery);
      } else {
        setItems([]);
      }
    }, 500), // 500ms debounce delay
    [session]
  );

  useEffect(() => {
    debouncedFetchSuggestions(query);
    return () => {
      debouncedFetchSuggestions.cancel();
    };
  }, [query, debouncedFetchSuggestions]);

  const handleSuggestionClick = (item: OrderType) => {
    setQuery(item.name);
    setShowItems(false);
    setOrderTypeName(item.name);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      setActiveIndex((prevIndex) => (prevIndex < items.length - 1 ? prevIndex + 1 : prevIndex));
    } else if (e.key === 'ArrowUp') {
      setActiveIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0));
    } else if (e.key === 'Enter') {
      if (activeIndex >= 0 && activeIndex < items.length) {
        handleSuggestionClick(items[activeIndex]);
      }
    }
  };

  const onSubmit = (data: OrderDetailFormData) => {
    if (!query) {
      return;
    }
    const orderDetail = { name: orderTypeName, ...data };
    if (selectedIndex === null) {
      onAddHandler(orderDetail as OrderDetail);
    } else {
      onEditHandler(selectedIndex, orderDetail as OrderDetail);
    }
    setSelectedIndex(null);
    setQuery('');
    reset();
  }

  const onClose = () => {
    reset();
    setSelectedIndex(null);
    setQuery('');
    onCloseHandler();
  }

  useImperativeHandle(ref, () => ({
    setOrderdetailForm(index: number, data: OrderDetail) {
      const { name, width, height, qty, design, eyelets, shiming, description } = data;
      setSelectedIndex(index);
      // setValue('name', name);
      setQuery(name);
      setValue('width', width);
      setValue('height', height);
      setValue('qty', qty);
      setValue('design', design);
      setValue('eyelets', eyelets);
      setValue('shiming', shiming);
      setValue('description', description);
    }
  }));

  return (
    <>
      <Modal show={show} size="md" onClose={onClose} popup>
        <Modal.Header />
        <Modal.Body>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">Item Pesanan</h3>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="order-type" value="Jenis Pesanan" />
                </div>

                <div className="relative">
                  <TextInput
                    id="generic-text-input"
                    placeholder="Type to search..."
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      if (query.length === 0) {
                        setShowItems(true)
                      }
                    }}
                    onFocus={() => setShowItems(true)}
                    onKeyDown={handleKeyDown}
                  />
                  {loading && (
                    <div className="absolute right-2 top-2">
                      <Spinner size="sm" />
                    </div>
                  )}
                  {showItems && items.length > 0 && (
                    <ul className="absolute bg-white border rounded mt-2 w-full z-10">
                      {items.map((item, index) => (
                        <li
                          key={item.id}
                          className={`p-2 cursor-pointer ${index === activeIndex ? 'bg-blue-500 text-white' : 'bg-white text-black'
                            }`}
                          onClick={() => handleSuggestionClick(item)}
                          onMouseEnter={() => setActiveIndex(index)}
                        >
                          {item.name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="width" value="Width" />
                  </div>
                  <TextInput
                    {...register('width', { valueAsNumber: true })}
                    id="width"
                    type="number"
                    color={errors.width && 'failure'}
                    min={0}
                    max={100000}
                  />
                </div>
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="height" value="Height" />
                  </div>
                  <TextInput
                    {...register('height', { valueAsNumber: true })}
                    id="heigth"
                    type="number"
                    color={errors.height && 'failure'}
                    min={0}
                    max={100000}
                  />
                </div>
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="qty" value="Qty" />
                  </div>
                  <TextInput
                    {...register('qty', { valueAsNumber: true })}
                    id="qty"
                    type="number"
                    color={errors.qty && 'failure'}
                    min={1}
                    max={10000}
                  />
                </div>
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="design" value="Design" />
                  </div>
                  <TextInput
                    {...register('design', { valueAsNumber: true })}
                    id="design"
                    type="number"
                    color={errors.design && 'failure'}
                    min={0}
                    max={1000}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    {...register('eyelets')}
                    id="eyelets" />
                  <Label htmlFor="eyelets" className="flex">
                    Mata Ayam
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    {...register('shiming')}
                    id="shiming"
                  />
                  <Label htmlFor="shiming" className="flex">
                    Shiming
                  </Label>
                </div>
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="description" value="Keterangan" />
                </div>
                <TextInput
                  {...register('description')}
                  id="description"
                />
              </div>
            </div>
            <div className="w-full flex gap-2">
              <Button size={"sm"} color={"blue"} type="submit">
                {selectedIndex === null ? 'Tambah' : 'Simpan'}
              </Button>
              <Button size={"sm"} color={"red"} onClick={onClose}>
                Batal
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
});

export default ModalInput;
