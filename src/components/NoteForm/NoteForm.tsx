import { ErrorMessage, Field, Form, Formik, type FormikHelpers } from 'formik';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as Yup from 'yup';
import {
  createNote,
  type CreateNotePayload,
} from '../../services/noteService';
import type { NoteTag } from '../../types/note';
import css from './NoteForm.module.css';

const noteTags: NoteTag[] = [
  'Todo',
  'Work',
  'Personal',
  'Meeting',
  'Shopping',
];

const initialValues: CreateNotePayload = {
  title: '',
  content: '',
  tag: 'Todo',
};

const validationSchema = Yup.object({
  title: Yup.string()
    .min(3, 'Title must be at least 3 characters')
    .max(50, 'Title must be at most 50 characters')
    .required('Title is required'),
  content: Yup.string().max(
    500,
    'Content must be at most 500 characters'
  ),
  tag: Yup.mixed<NoteTag>()
    .oneOf(noteTags, 'Choose a valid tag')
    .required('Tag is required'),
});

interface NoteFormProps {
  onCancel: () => void;
  onSuccess: () => void;
}

function NoteForm({ onCancel, onSuccess }: NoteFormProps) {
  const queryClient = useQueryClient();

  const createNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['notes'] });
      onSuccess();
    },
  });

  const handleSubmit = async (
    values: CreateNotePayload,
    actions: FormikHelpers<CreateNotePayload>
  ): Promise<void> => {
    try {
      await createNoteMutation.mutateAsync(values);
      actions.resetForm();
    } finally {
      actions.setSubmitting(false);
    }
  };

  const handleCancelClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ): void => {
    event.preventDefault();
    onCancel();
  };

  return (
    <Formik<CreateNotePayload>
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className={css.form}>
          <div className={css.formGroup}>
            <label htmlFor="title">Title</label>
            <Field
              id="title"
              type="text"
              name="title"
              className={css.input}
            />
            <ErrorMessage
              name="title"
              component="span"
              className={css.error}
            />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="content">Content</label>
            <Field
              id="content"
              as="textarea"
              name="content"
              rows={8}
              className={css.textarea}
            />
            <ErrorMessage
              name="content"
              component="span"
              className={css.error}
            />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="tag">Tag</label>
            <Field id="tag" as="select" name="tag" className={css.select}>
              {noteTags.map(tag => (
                <option value={tag} key={tag}>
                  {tag}
                </option>
              ))}
            </Field>
            <ErrorMessage
              name="tag"
              component="span"
              className={css.error}
            />
          </div>

          {createNoteMutation.isError && (
            <p className={css.errorMessage}>
              Failed to create note. Please try again.
            </p>
          )}

          <div className={css.actions}>
            <button
              type="button"
              className={css.cancelButton}
              onClick={handleCancelClick}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={css.submitButton}
              disabled={isSubmitting || createNoteMutation.isPending}
            >
              {createNoteMutation.isPending ? 'Creating...' : 'Create note'}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default NoteForm;
