'use client';

import React, { useState, useRef, useEffect } from 'react';
import styles from './AddCardForm.module.css';

interface AddCardFormProps {
  columnId: string;
  onSubmit: (columnId: string, title: string, details: string) => void;
  onCancel: () => void;
}

export const AddCardForm: React.FC<AddCardFormProps> = ({
  columnId,
  onSubmit,
  onCancel,
}) => {
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleInputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    onSubmit(columnId, trimmedTitle, details.trim());
    setTitle('');
    setDetails('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <form
      className={styles.formContainer}
      onSubmit={handleSubmit}
      onKeyDown={handleKeyDown}
      data-testid="add-card-form"
    >
      <input
        ref={titleInputRef}
        type="text"
        className={styles.inputField}
        placeholder="Card title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        aria-label="Card title"
        required
        data-testid="add-card-title-input"
      />
      <textarea
        className={styles.textareaField}
        placeholder="Card details (optional)..."
        value={details}
        onChange={(e) => setDetails(e.target.value)}
        aria-label="Card details"
        rows={2}
        data-testid="add-card-details-input"
      />
      <div className={styles.buttonRow}>
        <button
          type="button"
          className={styles.cancelButton}
          onClick={onCancel}
          data-testid="add-card-cancel-button"
        >
          Cancel
        </button>
        <button
          type="submit"
          className={styles.submitButton}
          disabled={!title.trim()}
          data-testid="add-card-submit-button"
        >
          Add Card
        </button>
      </div>
    </form>
  );
};
