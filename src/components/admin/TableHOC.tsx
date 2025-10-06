import {
  AiOutlineSortAscending,
  AiOutlineSortDescending,
} from "react-icons/ai";
import {
  Column,
  usePagination,
  useSortBy,
  useTable,
  TableOptions,
  TableState,
  TableInstance,
  UsePaginationInstanceProps,
  UsePaginationState,
} from "react-table";
import React from "react";

function TableHOC<T extends object>(
  columns: Column<T>[],
  data: T[],
  containerClassname: string,
  heading: string,
  showPagination: boolean = false
) {
  return function HOC(): React.ReactElement {
    const options: TableOptions<T> = {
      columns,
      data,
      initialState: {
        pageSize: 10,
      } as Partial<TableState<T>>, // ✅ Fix for pageSize typing
    };

    const tableInstance = useTable<T>(
      options,
      useSortBy,
      usePagination
    ) as TableInstance<T> &
      UsePaginationInstanceProps<T> & {
        state: UsePaginationState<T>;
      };

    const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      page,
      prepareRow,
      nextPage,
      previousPage,
      pageCount,
      canNextPage,
      canPreviousPage,
      state,
    } = tableInstance;

    const pageIndex = state.pageIndex; // ✅ Fix for pageIndex reference

    return (
      <div className={containerClassname}>
        <h2 className="heading">{heading}</h2>

        <table className="table" {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => {
                  const sortProps = (column as any).getSortByToggleProps?.();
                  const isSorted = (column as any).isSorted;
                  const isSortedDesc = (column as any).isSortedDesc;

                  return (
                    <th {...column.getHeaderProps(sortProps)}>
                      {column.render("Header")}
                      {isSorted && (
                        <span>
                          {isSortedDesc ? (
                            <AiOutlineSortDescending />
                          ) : (
                            <AiOutlineSortAscending />
                          )}
                        </span>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>

          {/* <tbody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  ))}
                </tr>
              );
            })}
          </tbody> */}

          <tbody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>

        </table>

        {showPagination && (
          <div className="table-pagination">
            <button disabled={!canPreviousPage} onClick={previousPage}>
              Prev
            </button>
            <span>{`${pageIndex + 1} of ${pageCount}`}</span>
            <button disabled={!canNextPage} onClick={nextPage}>
              Next
            </button>
          </div>
        )}
      </div>
    );
  };
}

export default TableHOC;
