'use client';

import React, { useState } from 'react';
import { Card } from '@/types/kanban';
import { Trash2 } from 'lucide-react';
import styles from './CardItem.module.css';

interface CardItemProps {
  card: Card;
  columnId: string;
  onDelete: (cardId: string, columnId: string) => void;
  onCardDrop?: (
    sourceCardId: string,
    sourceColId: string,
    targetCardId: string,
    targetColId: string
  ) => void;
}

export const CardItem: React.FC<CardItemProps> = ({
  card,
  columnId,
  onDelete,
  onCardDrop,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isDropTarget, setIsDropTarget] = useState(false);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    setIsDragging(true);
    const payload = JSON.stringify({ cardId: card.id, sourceColId: columnId });
    e.dataTransfer.setData('application/json', payload);
    e.dataTransfer.setData('text/plain', payload);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDropTarget(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDropTarget(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDropTarget(false);

    const dataString =
      e.dataTransfer.getData('text/plain') ||
      e.dataTransfer.getData('application/json');
    if (!dataString) return;

    try {
      const { cardId: draggedCardId, sourceColId } = JSON.parse(dataString);
      if (draggedCardId && onCardDrop) {
        onCardDrop(draggedCardId, sourceColId, card.id, columnId);
      }
    } catch {
      // Ignore invalid payload
    }
  };

  return (
    <div
      className={`${styles.card} ${isDragging ? styles.dragging : ''} ${
        isDropTarget ? styles.dropTarget : ''
      }`}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      data-testid={`card-${card.id}`}
      data-card-id={card.id}
    >
      <div className={styles.accentBar} />
      <div className={styles.cardTop}>
        <h4 className={styles.cardTitle}>{card.title}</h4>
        <button
          type="button"
          className={styles.deleteButton}
          onClick={(e) => {
            e.stopPropagation();
            onDelete(card.id, columnId);
          }}
          aria-label={`Delete card ${card.title}`}
          title="Delete card"
          data-testid={`delete-card-${card.id}`}
        >
          <Trash2 size={15} />
        </button>
      </div>
      {card.details && <p className={styles.cardDetails}>{card.details}</p>}
    </div>
  );
};
