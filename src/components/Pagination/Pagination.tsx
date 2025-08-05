interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange
}: PaginationProps) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  // Always show exactly 5 pages
  const getVisiblePages = () => {
    return [1, 2, 3, 4, 5];
  };
  
  const visiblePages = getVisiblePages();

  return (
    <div className="horizontal-pagination">
      <button
        className="pagination-arrow"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        &lt;
      </button>
      
      {visiblePages.map((page) => (
        <button
          key={page}
          className={`pagination-number ${currentPage === page ? 'active' : ''}`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}
      
      <button
        className="pagination-arrow"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        &gt;
      </button>
    </div>
  );
};

export default Pagination;