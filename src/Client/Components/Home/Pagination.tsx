'use client';
import React, { useState } from 'react';
import ResponsivePagination from 'react-responsive-pagination';
import 'react-responsive-pagination/themes/classic.css';

export function Pagination(params: any) {
  const [currentPage, setCurrentPage] = useState(params.currentPage);
  const totalPages = Math.ceil(params.totalItems / params.itemsPerPage);

  return (
    <ResponsivePagination
      current={currentPage}
      total={totalPages}
      onPageChange={setCurrentPage}
    />
  );
}