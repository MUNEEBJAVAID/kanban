'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card, Column } from '@/types/kanban';
import { CardItem } from './CardItem';
import { AddCardForm } from './AddCardForm';
import { Plus } from 'lucide-react';
import styles from './ColumnItem.module.css';

interface ColumnItemProps {
  column: Column;
  cards: Card[];
  onRenameColumn: (columnId: string, newTitle: string) => void;
  onAddCard: (columnId: string, title: string, details: string) => void;
  onDeleteCard: (cardId: string, columnId: string) => void;
  onMoveCard: (
    cardId: string,
    sourceColId: string,
    targetColId: string,
    targetCardId?: string
  ) => void;
}

export const ColumnItem: React.FC<ColumnItemProps> = ({
  column,
  cards,
  onRenameColumn,
  onAddCard,
  onDeleteCard,
  onMoveCard,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(column.title);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTitleDraft(column.title);
  }, [column.title]);

  useEffect(() => {
    if (isEditingTitle) {
      titleInputRef.current?.focus();
      titleInputRef.current?.select();
    }
  }, [isEditingTitle]);

  const handleTitleSubmit = () => {
    const trimmed = titleDraft.trim();
    if (trimmed && trimmed !== column.title) {
      onRenameColumn(column.id, trimmed);
    } else {
      setTitleDraft(column.title);
    }
    setIsEditingTitle(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleTitleSubmit();
    } else if (e.key === 'Escape') {
      setTitleDraft(column.title);
      setIsEditingTitle(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const dataString =
      e.dataTransfer.getData('text/plain') ||
      e.dataTransfer.getData('application/json');
    if (!dataString) return;

    try {
      const { cardId, sourceColId } = JSON.parse(dataString);
      if (cardId) {
        onMoveCard(cardId, sourceColId, column.id);
      }
    } catch {
      // Ignore invalid drag payload
    }
  };

  const handleCardDrop = (
    sourceCardId: string,
    sourceColId: string,
    targetCardId: string,
    targetColId: string
  ) => {
    onMoveCard(sourceCardId, sourceColId, targetColId, targetCardId);
  };

  return (
    <section
      className={`${styles.column} ${isDragOver ? styles.dragOver : ''}`}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      data-testid={`column-${column.id}`}
      data-column-id={column.id}
      aria-label={`${column.title} column`}
    >
      <div className={styles.topAccentBar} />

      <header className={styles.columnHeader}>
        <div className={styles.titleArea}>
          {isEditingTitle ? (
            <input
              ref={titleInputRef}
              type="text"
              className={styles.titleInput}
              value={titleDraft}
              onChange={(e) => setTitleDraft(e.target.value)}
              onBlur={handleTitleSubmit}
              onKeyDown={handleTitleKeyDown}
              data-testid={`column-title-input-${column.id}`}
              aria-label="Edit column title"
            />
          ) : (
            <h3
              className={styles.columnTitle}
              onClick={() => setIsEditingTitle(true)}
              title="Click to rename column"
              data-testid={`column-title-${column.id}`}
            >
              {column.title}
            </h3>
          )}
        </div>
        <span
          className={styles.countBadge}
          data-testid={`column-count-${column.id}`}
          title={`${cards.length} cards`}
        >
          {cards.length}
        </span>
      </header>

      <div
        className={styles.cardsContainer}
        data-testid={`cards-container-${column.id}`}
      >
        {cards.length === 0 && !isAddingCard ? (
          <div className={styles.emptyState}>No cards in this column</div>
        ) : (
          cards.map((card) => (
            <CardItem
              key={card.id}
              card={card}
              columnId={column.id}
              onDelete={onDeleteCard}
              onCardDrop={handleCardDrop}
            />
          ))
        )}

        {isAddingCard && (
          <AddCardForm
            columnId={column.id}
            onSubmit={(colId, title, details) => {
              onAddCard(colId, title, details);
              setIsAddingCard(false);
            }}
            onCancel={() => setIsAddingCard(false)}
          />
        )}
      </div>

      <footer className={styles.columnFooter}>
        {!isAddingCard && (
          <button
            type="button"
            className={styles.addCardTrigger}
            onClick={() => setIsAddingCard(true)}
            data-testid={`add-card-button-${column.id}`}
          >
            <Plus size={16} />
            <span>Add Card</span>
          </button>
        )}
      </footer>
    </section>
  );
};
