import { useState, useMemo } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Pagination from "../../components/Pagination";

interface TableProps {
  columns: any[];
  rows: any[];
  properties: Properties;
}

interface Properties {
  checkboxSelection: boolean;
  hideFooter: boolean;
  className: string;
  initialPageSize?: number;
}

const Table = ({ columns, rows, properties }:TableProps) => {
  const { 
    checkboxSelection, 
    hideFooter, 
    className, 
    initialPageSize = 10
  } = properties;
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = initialPageSize;
  
  // Calculate pagination
  const totalItems = rows.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedRows = useMemo(() => rows.slice(startIndex, endIndex), [rows, startIndex, endIndex]);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  

  
  return (
    <Paper className={`datagrid-wrapper ${className}`}>
      <DataGrid
        rows={paginatedRows}
        columns={columns}
        rowHeight={40}
        checkboxSelection={checkboxSelection}
        sx={{ 
          border: 0,
          outline: 'none',
          '& .MuiDataGrid-row': {
            outline: 'none !important',
            border: 'none !important',
            '&:focus': {
              outline: 'none !important',
              border: 'none !important',
            },
            '&.Mui-selected': {
              outline: 'none !important',
              border: 'none !important',
              backgroundColor: 'transparent !important',
            },
            '&:hover': {
              outline: 'none !important',
              border: 'none !important',
            },
          },
          '& .MuiDataGrid-cell': {
            outline: 'none !important',
            border: 'none !important',
            '&:focus': {
              outline: 'none !important',
              border: 'none !important',
            },
            '&:focus-within': {
              outline: 'none !important',
              border: 'none !important',
            },
          },
          '& .MuiCheckbox-root': {
            outline: 'none !important',
            '&:focus': {
              outline: 'none !important',
            },
          },
          '& .MuiDataGrid-footerContainer': {
            borderTop: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-color-secondary)',
            minHeight: '52px',
          },
          '& .MuiTablePagination-root': {
            color: 'var(--font-color-primary)',
          },
          '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
            fontSize: '14px',
            color: 'var(--font-color-light)',
          },
          '& .MuiTablePagination-select': {
            fontSize: '14px',
            color: 'var(--font-color-primary)',
            backgroundColor: 'var(--bg-color-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: '4px',
            outline: 'none',
            '&:focus': {
              backgroundColor: 'var(--bg-color-secondary)',
              borderColor: 'var(--border-color)',
              outline: 'none',
              boxShadow: 'none',
            },
            '&:hover': {
              backgroundColor: 'var(--bg-hover)',
            },
            '&:active': {
              backgroundColor: 'var(--bg-color-secondary)',
              outline: 'none',
              boxShadow: 'none',
            }
          },
          '& .MuiSelect-icon': {
            color: 'var(--font-color-primary)',
          },
          '& .MuiMenuItem-root': {
            fontSize: '14px',
            color: 'var(--font-color-primary)',
            backgroundColor: 'var(--bg-color-secondary)',
            outline: 'none',
            '&:hover': {
              backgroundColor: 'var(--bg-hover)',
            },
            '&:focus': {
              backgroundColor: 'var(--bg-color-secondary)',
              outline: 'none',
            },
            '&.Mui-selected': {
              backgroundColor: 'var(--bg-color-secondary)',
              color: 'var(--font-color-primary)',
              '&:hover': {
                backgroundColor: 'var(--bg-hover)',
              },
              '&:focus': {
                backgroundColor: 'var(--bg-color-secondary)',
                outline: 'none',
              }
            },
            '&.Mui-focusVisible': {
              backgroundColor: 'var(--bg-color-secondary)',
              outline: 'none',
            }
          },
          '& .MuiPaper-root': {
            backgroundColor: 'var(--bg-color-secondary)',
            border: '1px solid var(--border-color)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
          },
          '& .MuiTablePagination-actions': {
            '& .MuiIconButton-root': {
              color: 'var(--font-color-primary)',
              transition: 'all 0.2s ease',
              '&:hover:not(.Mui-disabled)': {
                backgroundColor: 'var(--bg-hover)',
              },
              '&.Mui-disabled': {
                color: 'var(--font-color-disabled)',
                cursor: 'not-allowed',
                opacity: 0.5,
                '& svg': {
                  fill: 'var(--font-color-disabled)',
                },
                '&:hover': {
                  backgroundColor: 'transparent',
                }
              }
            }
          }
        }}
        hideFooter={true}
        disableColumnMenu={true}
        disableColumnResize={true}
        scrollbarSize={0}
      />
      
      {!hideFooter && (
        <Pagination
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      )}
    </Paper>
  );
  
}

export default Table;
