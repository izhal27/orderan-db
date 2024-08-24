"use client";

import { Pagination } from "flowbite-react";

interface props {
  currentPage: number;
  totalPages: number;
  onPageChangeHandler(page: number): void;
}

export default function PaginationTable({
  currentPage,
  totalPages,
  onPageChangeHandler,
}: props) {
  return (
    <div className="flex overflow-x-auto sm:justify-center">
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChangeHandler}
        showIcons
      />
    </div>
  );
}
