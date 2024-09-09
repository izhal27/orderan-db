import React, { useState } from 'react';
import { Modal, Button, TextInput, Datepicker, Select, Label } from 'flowbite-react';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilter: (filters: FilterState) => void;
}

interface FilterState {
  startDate: string;
  endDate: string;
  orderNumber: string;
  customer: string;
  user: string;
  sortType: string;
}

export default function FilterModal({ isOpen, onClose, onApplyFilter }: FilterModalProps) {
  const [filters, setFilters] = useState<FilterState>({
    startDate: '',
    endDate: '',
    orderNumber: '',
    customer: '',
    user: '',
    sortType: ''
  });

  const handleFilterChange = (name: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleApplyFilter = () => {
    onApplyFilter(filters);
    onClose();
  };

  return (
    <Modal show={isOpen} onClose={onClose}>
      <Modal.Header>Filter Pesanan</Modal.Header>
      <Modal.Body>
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div>
            <Datepicker
              onChange={(date) => handleFilterChange('startDate', date.toString())}
            />
          </div>
          <div>
            <Datepicker
              onChange={(date) => handleFilterChange('endDate', date.toString())}
              maxDate={new Date()}
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
              onChange={(e) => handleFilterChange('orderNumber', e.target.value)}
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
              onChange={(e) => handleFilterChange('customer', e.target.value)}
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
              onChange={(e) => handleFilterChange('user', e.target.value)}
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="sortType" value="Jenis Pengurutan" />
            </div>
            <Select
              id="sortType"
              value={filters.sortType}
              onChange={(e) => handleFilterChange('sortType', e.target.value)}
            >
              <option value="">Pilih Jenis Pengurutan</option>
              <option value="date_asc">Tanggal (Terlama)</option>
              <option value="date_desc">Tanggal (Terbaru)</option>
            </Select>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button size='sm' onClick={handleApplyFilter}>Terapkan Filter</Button>
        <Button size='sm' color="gray" onClick={onClose}>
          Batal
        </Button>
      </Modal.Footer>
    </Modal>
  );
}