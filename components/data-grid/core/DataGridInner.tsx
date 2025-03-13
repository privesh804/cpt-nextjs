import { Fragment } from "react";
import {
  useDataGrid,
  DataGridLoader,
  DataGridTable,
  DataGridTableBody,
  DataGridTableBodyCell,
  DataGridTableBodyRow,
  DataGridTableHead,
  DataGridTableHeadCell,
  DataGridTableEmpty,
  DataGridToolbar,
} from ".."; // Ensure these imports are correct
import { flexRender, Row, Cell } from "@tanstack/react-table"; // Import Row and Cell types

const DataGridInner = <TData extends object>() => {
  const { loading, table } = useDataGrid();

  return (
    <Fragment>
      <div className="grid min-w-full">
        <div className="scrollable-x-auto static">
          <DataGridTable>
            <DataGridTableHead>
              {table
                .getHeaderGroups()
                .map((headerGroup: { headers: any[] }) =>
                  headerGroup.headers.map((header, index) => (
                    <DataGridTableHeadCell key={index} header={header} />
                  ))
                )}
            </DataGridTableHead>
            <DataGridTableBody>
              {/* <div className="flex flex-col justify-center w-full"> */}
              {table.getRowModel().rows.length > 0 ? (
                table
                  .getRowModel()
                  .rows.map((row: Row<TData>, rowIndex: number) => (
                    <DataGridTableBodyRow key={rowIndex} id={row.id}>
                      {row
                        .getVisibleCells()
                        .map((cell: Cell<TData, any>, cellIndex: number) => (
                          <DataGridTableBodyCell
                            key={cellIndex}
                            id={cell.id}
                            className={
                              // @ts-ignore
                              cell.column.columnDef.meta?.cellClassName || ""
                            }
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </DataGridTableBodyCell>
                        ))}
                    </DataGridTableBodyRow>
                  ))
              ) : (
                <DataGridTableEmpty />
              )}
              {/* </div> */}
            </DataGridTableBody>
          </DataGridTable>
          {loading && <DataGridLoader />} {/* Show loader if loading */}
        </div>
        <DataGridToolbar />
      </div>
    </Fragment>
  );
};

export { DataGridInner };
