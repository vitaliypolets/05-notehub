import { useState } from 'react';
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';
import { deleteNote, fetchNotes } from '../../services/noteService';
import Modal from '../Modal/Modal';
import NoteForm from '../NoteForm/NoteForm';
import NoteList from '../NoteList/NoteList';
import Pagination from '../Pagination/Pagination';
import SearchBox from '../SearchBox/SearchBox';
import css from './App.module.css';

const PER_PAGE = 12;

function App() {
  const [page, setPage] = useState<number>(1);
  const [searchValue, setSearchValue] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const queryClient = useQueryClient();

  const debouncedSearch = useDebouncedCallback((value: string): void => {
    setPage(1);
    setSearchQuery(value);
  }, 500);

  const { data, isError, isLoading, isFetching } = useQuery({
    queryKey: ['notes', page, searchQuery],
    queryFn: () =>
      fetchNotes({
        page,
        perPage: PER_PAGE,
        search: searchQuery,
      }),
    placeholderData: keepPreviousData,
  });

  const deleteNoteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 0;

  const handleSearchChange = (value: string): void => {
    setSearchValue(value);
    debouncedSearch(value);
  };

  const handlePageChange = (selectedPage: number): void => {
    setPage(selectedPage);
  };

  const handleOpenModal = (): void => {
    setIsModalOpen(true);
  };

  const handleCloseModal = (): void => {
    setIsModalOpen(false);
  };

  const handleDeleteNote = (noteId: string): void => {
    deleteNoteMutation.mutate(noteId);
  };

  const deletingNoteId = deleteNoteMutation.isPending
    ? deleteNoteMutation.variables
    : null;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={searchValue} onSearch={handleSearchChange} />

        {totalPages > 1 && (
          <Pagination
            pageCount={totalPages}
            currentPage={page}
            onPageChange={handlePageChange}
          />
        )}

        <button className={css.button} type="button" onClick={handleOpenModal}>
          Create note +
        </button>
      </header>

      {isLoading && <p className={css.status}>Loading notes...</p>}

      {isError && (
        <p className={css.error}>Something went wrong. Please try again.</p>
      )}

      {!isLoading && !isError && notes.length > 0 && (
        <NoteList
          notes={notes}
          onDelete={handleDeleteNote}
          deletingNoteId={deletingNoteId}
        />
      )}

      {!isLoading && !isError && notes.length === 0 && (
        <p className={css.status}>No notes found.</p>
      )}

      {isFetching && !isLoading && (
        <p className={css.fetching}>Updating notes...</p>
      )}

      {isModalOpen && (
        <Modal onClose={handleCloseModal}>
          <NoteForm onCancel={handleCloseModal} onSuccess={handleCloseModal} />
        </Modal>
      )}
    </div>
  );
}

export default App;
