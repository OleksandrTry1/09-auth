"use client";

import type { ComponentType } from "react";
import ReactPaginateImport from "react-paginate";
import type { ReactPaginateProps } from "react-paginate";
import css from "./Pagination.module.css";

// react-paginate is a CommonJS package: depending on the bundler, the default
// import is either the component itself or an object with a `default` field.
const ReactPaginate = ((
  ReactPaginateImport as unknown as {
    default?: ComponentType<ReactPaginateProps>;
  }
).default ?? ReactPaginateImport) as ComponentType<ReactPaginateProps>;

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({
  totalPages,
  currentPage,
  onPageChange,
}: PaginationProps) => {
  const handlePageChange = ({ selected }: { selected: number }) => {
    onPageChange(selected + 1);
  };

  return (
    <ReactPaginate
      pageCount={totalPages}
      forcePage={currentPage - 1}
      onPageChange={handlePageChange}
      pageRangeDisplayed={3}
      marginPagesDisplayed={1}
      previousLabel="←"
      nextLabel="→"
      containerClassName={css.pagination}
      activeClassName={css.active}
    />
  );
};

export default Pagination;
