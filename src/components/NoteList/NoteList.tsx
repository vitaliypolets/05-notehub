import type { Note } from '../../types/note';
import css from './NoteList.module.css';

interface NoteListProps {
  notes: Note[];
  onDelete: (noteId: string) => void;
  deletingNoteId: string | null | undefined;
}

function NoteList({ notes, onDelete, deletingNoteId }: NoteListProps) {
  const handleDelete = (
    event: React.MouseEvent<HTMLButtonElement>
  ): void => {
    const noteId = event.currentTarget.dataset.noteId;

    if (noteId) {
      onDelete(noteId);
    }
  };

  return (
    <ul className={css.list}>
      {notes.map(note => (
        <li className={css.listItem} key={note.id}>
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>
            <button
              className={css.button}
              type="button"
              data-note-id={note.id}
              onClick={handleDelete}
              disabled={deletingNoteId === note.id}
            >
              {deletingNoteId === note.id ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default NoteList;
