import {
  Button,
  Datepicker,
  Label,
  Modal,
  Select,
  TextInput,
} from "flowbite-react";
import { useState } from "react";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilter: (filters: FilterState) => void;
}

export interface FilterState {
  startDate: Date | undefined;
  endDate: Date | undefined;
  orderNumber: string;
  customer: string;
  user: string;
  sortOrder: string;
}

export default function FilterModal({
  isOpen,
  onClose,
  onApplyFilter,
}: FilterModalProps) {
  const [filters, setFilters] = useState<FilterState>({
    startDate: new Date(),
    endDate: new Date(),
    orderNumber: "",
    customer: "",
    user: "",
    sortOrder: "desc",
  });

  const handleFilterChange = (name: keyof FilterState, value: any) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyFilter = () => {
    onApplyFilter(filters);
    onClose();
  };

  return (
    <Modal show={isOpen} onClose={onClose}>
      <Modal.Header>Filter Pesanan</Modal.Header>
      <Modal.Body>
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div>
            <Datepicker
              onSelectedDateChanged={(date) =>
                handleFilterChange("startDate", date)
              }
              language="id"
              labelTodayButton="Hari ini"
            />
          </div>
          <div>
            <Datepicker
              onSelectedDateChanged={(date) =>
                handleFilterChange("endDate", date)
              }
              maxDate={new Date()}
              language="id"
              labelTodayButton="Hari ini"
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="orderNumber" value="Nomor" />
            </div>
            <TextInput
              id="orderNumber"
              type="text"
              placeholder="Nomor"
              value={filters.orderNumber}
              onChange={(e) =>
                handleFilterChange("orderNumber", e.target.value)
              }
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="customer" value="Pelanggan" />
            </div>
            <TextInput
              id="customer"
              type="text"
              placeholder="Pelanggan"
              value={filters.customer}
              onChange={(e) => handleFilterChange("customer", e.target.value)}
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="user" value="User" />
            </div>
            <TextInput
              id="user"
              type="text"
              placeholder="User"
              value={filters.user}
              onChange={(e) => handleFilterChange("user", e.target.value)}
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="sortBy" value="Jenis Pengurutan" />
            </div>
            <Select
              id="sortType"
              value={filters.sortOrder}
              onChange={(e) => handleFilterChange("sortOrder", e.target.value)}
            >
              <option value="">Pilih Jenis Pengurutan</option>
              <option value="asc">Tanggal (Terlama)</option>
              <option value="desc">Tanggal (Terbaru)</option>
            </Select>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button size="sm" onClick={handleApplyFilter}>
          Terapkan Filter
        </Button>
        <Button size="sm" color="gray" onClick={onClose}>
          Batal
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
