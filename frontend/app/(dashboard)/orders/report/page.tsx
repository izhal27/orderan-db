'use client';

import React, { useState } from 'react';
import { Button } from 'flowbite-react';
import FilterModal from '../list/_components/FilterModal';

export default function ReportPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState({});

  const handleApplyFilter = (filters: any) => {
    setAppliedFilters(filters);
    // Di sini Anda dapat menerapkan filter ke data atau melakukan permintaan API
    console.log('Filter diterapkan:', filters);
  };

  return (
    <div>
      <h1>Report Page</h1>
      <Button onClick={() => setIsOpen(true)}>Buka Filter</Button>

      <FilterModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onApplyFilter={handleApplyFilter}
      />

      {/* Tampilkan data laporan di sini */}
    </div>
  );
}