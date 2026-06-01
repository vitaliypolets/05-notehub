import ReactPaginateDefault from 'react-paginate';
import css from './Pagination.module.css';

const ReactPaginate =
  (
    ReactPaginateDefault as unknown as {
      default?: typeof ReactPaginateDefault;
    }
  ).default ?? ReactPaginateDefault;

interface PaginationProps {
  pageCount: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

interface PageChangeEvent {
  selected: number;
}

function Pagination({
  pageCount,
  currentPage,
  onPageChange,
}: PaginationProps) {
  const handlePageClick = (event: PageChangeEvent): void => {
    onPageChange(event.selected + 1);
  };

  return (
    <ReactPaginate
      pageCount={pageCount}
      pageRangeDisplayed={3}
      marginPagesDisplayed={1}
      onPageChange={handlePageClick}
      forcePage={currentPage - 1}
      previousLabel="<"
      nextLabel=">"
      breakLabel="..."
      containerClassName={css.pagination}
      pageClassName={css.page}
      previousClassName={css.page}
      nextClassName={css.page}
      breakClassName={css.page}
      activeClassName={css.active}
      disabledClassName={css.disabled}
      pageLinkClassName={css.link}
      previousLinkClassName={css.link}
      nextLinkClassName={css.link}
      breakLinkClassName={css.link}
    />
  );
}

export default Pagination;