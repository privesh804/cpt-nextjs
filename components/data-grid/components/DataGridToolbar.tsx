import React from "react";
import { DataGridPagination, useDataGrid } from "..";

const DataGridToolbar = () => {
  const { table, props } = useDataGrid();
  const pageSizes = props.pagination?.sizes || [5, 10, 25, 50];
  return (
    <div className="card-footer justify-center md:justify-between flex-col md:flex-row gap-3 text-gray-600 text-2sm font-medium">
      <div className="flex items-center gap-2">
        {props.pagination?.sizesLabel}
        <select
          className="select select-sm w-16"
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
        >
          {pageSizes &&
            pageSizes.length &&
            pageSizes?.map((size, index) => (
              <option key={index} value={size}>
                {size}
              </option>
            ))}
        </select>{" "}
        {props.pagination?.sizesDescription}
      </div>
      <DataGridPagination />
    </div>
  );
};

export { DataGridToolbar };
