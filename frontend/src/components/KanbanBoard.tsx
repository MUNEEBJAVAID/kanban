'use client';

import React, { useState } from 'react';
import { BoardData } from '@/types/kanban';
import { INITIAL_BOARD_DATA } from '@/data/initialData';
import { ColumnItem } from './ColumnItem';
import { KanbanSquare, RotateCcw } from 'lucide-react';
import styles from './KanbanBoard.module.css';

export const KanbanBoard: React.FC = () => {
  const [boardData, setBoardData] = useState<BoardData>(INITIAL_BOARD_DATA);

  const handleRenameColumn = (columnId: string, newTitle: string) => {
    setBoardData((prev) => ({
      ...prev,
      columns: prev.columns.map((col) =>
        col.id === columnId ? { ...col, title: newTitle } : col
      ),
    }));
  };

  const handleAddCard = (columnId: string, title: string, details: string) => {
    const newCardId = `card-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const newCard = {
      id: newCardId,
      title,
      details,
    };

    setBoardData((prev) => ({
      cards: {
        ...prev.cards,
        [newCardId]: newCard,
      },
      columns: prev.columns.map((col) =>
        col.id === columnId
          ? { ...col, cardIds: [...col.cardIds, newCardId] }
          : col
      ),
    }));
  };

  const handleDeleteCard = (cardId: string, columnId: string) => {
    setBoardData((prev) => {
      const nextCards = { ...prev.cards };
      delete nextCards[cardId];

      const nextColumns = prev.columns.map((col) =>
        col.id === columnId
          ? { ...col, cardIds: col.cardIds.filter((id) => id !== cardId) }
          : col
      );

      return {
        cards: nextCards,
        columns: nextColumns,
      };
    });
  };

  const handleMoveCard = (
    cardId: string,
    sourceColId: string,
    targetColId: string,
    targetCardId?: string
  ) => {
    setBoardData((prev) => {
      const sourceCol = prev.columns.find((c) => c.id === sourceColId);
      const targetCol = prev.columns.find((c) => c.id === targetColId);

      if (!sourceCol || !targetCol) return prev;

      // Handle reordering within the same column
      if (sourceColId === targetColId) {
        if (!sourceCol.cardIds.includes(cardId)) return prev;

        const currentIds = [...sourceCol.cardIds];
        const sourceIndex = currentIds.indexOf(cardId);
        if (sourceIndex === -1) return prev;

        // If dropped onto itself, no-op
        if (targetCardId === cardId) return prev;

        // Remove card from current position
        currentIds.splice(sourceIndex, 1);

        if (targetCardId) {
          const targetIndex = currentIds.indexOf(targetCardId);
          if (targetIndex !== -1) {
            currentIds.splice(targetIndex, 0, cardId);
          } else {
            currentIds.push(cardId);
          }
        } else {
          // Dropped on column container: move to bottom of the column
          currentIds.push(cardId);
        }

        return {
          ...prev,
          columns: prev.columns.map((col) =>
            col.id === sourceColId ? { ...col, cardIds: currentIds } : col
          ),
        };
      }

      // Moving across different columns
      const sourceCardIds = sourceCol.cardIds.filter((id) => id !== cardId);
      const targetCardIds = [...targetCol.cardIds];

      if (targetCardId) {
        const targetIndex = targetCardIds.indexOf(targetCardId);
        if (targetIndex !== -1) {
          targetCardIds.splice(targetIndex, 0, cardId);
        } else {
          targetCardIds.push(cardId);
        }
      } else {
        targetCardIds.push(cardId);
      }

      return {
        ...prev,
        columns: prev.columns.map((col) => {
          if (col.id === sourceColId) {
            return {
              ...col,
              cardIds: sourceCardIds,
            };
          }
          if (col.id === targetColId) {
            return {
              ...col,
              cardIds: targetCardIds,
            };
          }
          return col;
        }),
      };
    });
  };

  const handleResetBoard = () => {
    setBoardData(INITIAL_BOARD_DATA);
  };

  const totalCardsCount = Object.keys(boardData.cards).length;

  return (
    <div className={styles.boardWrapper} data-testid="kanban-board">
      <header className={styles.header}>
        <div className={styles.headerAccent} />
        <div className={styles.headerContent}>
          <div className={styles.brandGroup}>
            <div className={styles.brandMark}>
              <KanbanSquare size={22} />
            </div>
            <div className={styles.titleArea}>
              <h1 className={styles.mainHeading}>Project Management Board</h1>
              <p className={styles.subHeading}>
                Single board with 5 custom workflow columns
              </p>
            </div>
          </div>

          <div className={styles.actionsGroup}>
            <div className={styles.statsBadge} data-testid="board-stats">
              <span>Total Cards:</span>
              <span className={styles.statsHighlight}>{totalCardsCount}</span>
            </div>
            <button
              type="button"
              className={styles.resetButton}
              onClick={handleResetBoard}
              title="Reset board to initial dummy data"
              data-testid="reset-board-button"
            >
              <RotateCcw size={14} />
              <span>Reset Board</span>
            </button>
          </div>
        </div>
      </header>

      <main className={styles.boardContainer}>
        <div className={styles.columnsTrack} data-testid="columns-track">
          {boardData.columns.map((column) => {
            const columnCards = column.cardIds
              .map((id) => boardData.cards[id])
              .filter(Boolean);

            return (
              <ColumnItem
                key={column.id}
                column={column}
                cards={columnCards}
                onRenameColumn={handleRenameColumn}
                onAddCard={handleAddCard}
                onDeleteCard={handleDeleteCard}
                onMoveCard={handleMoveCard}
              />
            );
          })}
        </div>
      </main>
    </div>
  );
};
