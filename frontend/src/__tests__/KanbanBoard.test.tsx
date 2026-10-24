import { render, screen, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { describe, it, expect } from 'vitest';
import { KanbanBoard } from '@/components/KanbanBoard';
import { INITIAL_BOARD_DATA } from '@/data/initialData';

describe('KanbanBoard Component', () => {
  it('renders the board with exactly 5 columns and initial dummy data', () => {
    render(<KanbanBoard />);

    expect(screen.getByTestId('kanban-board')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Project Management Board'
    );

    // Verify 5 columns are rendered
    const defaultColumnTitles = [
      'Backlog',
      'To Do',
      'In Progress',
      'In Review',
      'Done',
    ];
    defaultColumnTitles.forEach((title) => {
      expect(screen.getByText(title)).toBeInTheDocument();
    });

    // Verify initial cards exist
    expect(screen.getByText('User Authentication Audit')).toBeInTheDocument();
    expect(screen.getByText('Vector Index Optimization')).toBeInTheDocument();

    // Verify total cards counter matches initial dummy data count
    const totalCount = Object.keys(INITIAL_BOARD_DATA.cards).length;
    expect(screen.getByTestId('board-stats')).toHaveTextContent(
      `Total Cards:${totalCount}`
    );
  });

  it('allows renaming a column', () => {
    render(<KanbanBoard />);

    const backlogTitle = screen.getByTestId('column-title-col-1');
    expect(backlogTitle).toHaveTextContent('Backlog');

    // Click to edit
    fireEvent.click(backlogTitle);

    const input = screen.getByTestId('column-title-input-col-1');
    expect(input).toBeInTheDocument();

    // Change value and submit via Enter
    fireEvent.change(input, { target: { value: 'Ideas & Discovery' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    // Verify new title is displayed
    expect(screen.getByTestId('column-title-col-1')).toHaveTextContent(
      'Ideas & Discovery'
    );
  });

  it('allows adding a new card with title and details to a column', () => {
    render(<KanbanBoard />);

    // Open add card form in Backlog column
    const addCardBtn = screen.getByTestId('add-card-button-col-1');
    fireEvent.click(addCardBtn);

    const titleInput = screen.getByTestId('add-card-title-input');
    const detailsInput = screen.getByTestId('add-card-details-input');
    const submitBtn = screen.getByTestId('add-card-submit-button');

    expect(submitBtn).toBeDisabled();

    // Fill form
    fireEvent.change(titleInput, { target: { value: 'New Test Feature' } });
    expect(submitBtn).not.toBeDisabled();

    fireEvent.change(detailsInput, {
      target: { value: 'Detailed description of the new feature.' },
    });
    fireEvent.click(submitBtn);

    // Verify card is now visible
    expect(screen.getByText('New Test Feature')).toBeInTheDocument();
    expect(
      screen.getByText('Detailed description of the new feature.')
    ).toBeInTheDocument();

    // Verify card counter in column-1 increased
    const colCountBadge = screen.getByTestId('column-count-col-1');
    expect(colCountBadge).toHaveTextContent('3');
  });

  it('allows deleting an existing card from a column', () => {
    render(<KanbanBoard />);

    expect(screen.getByText('User Authentication Audit')).toBeInTheDocument();

    const deleteBtn = screen.getByTestId('delete-card-card-1');
    fireEvent.click(deleteBtn);

    // Verify card has been removed
    expect(
      screen.queryByText('User Authentication Audit')
    ).not.toBeInTheDocument();

    // Verify column counter decremented
    const colCountBadge = screen.getByTestId('column-count-col-1');
    expect(colCountBadge).toHaveTextContent('1');
  });

  it('moves a card between columns using drag and drop event simulation', () => {
    render(<KanbanBoard />);

    const cardToMove = screen.getByTestId('card-card-1');
    const targetColumn = screen.getByTestId('column-col-3'); // In Progress

    // Simulate drag start on card
    const dataTransfer = {
      data: {} as Record<string, string>,
      setData: function (format: string, data: string) {
        this.data[format] = data;
      },
      getData: function (format: string) {
        return this.data[format];
      },
      dropEffect: 'none',
      effectAllowed: 'all',
    };

    fireEvent.dragStart(cardToMove, { dataTransfer });

    // Simulate drag over and drop on target column
    fireEvent.dragOver(targetColumn, { dataTransfer });
    fireEvent.drop(targetColumn, { dataTransfer });

    // Verify card is now inside In Progress container
    const inProgressContainer = screen.getByTestId('cards-container-col-3');
    expect(
      within(inProgressContainer).getByText('User Authentication Audit')
    ).toBeInTheDocument();

    // Verify column counts updated
    expect(screen.getByTestId('column-count-col-1')).toHaveTextContent('1');
    expect(screen.getByTestId('column-count-col-3')).toHaveTextContent('3');
  });

  it('reorders cards within the same column when dropped onto another card', () => {
    render(<KanbanBoard />);

    // In Backlog (col-1), card-1 is first and card-2 is second
    const card1 = screen.getByTestId('card-card-1');
    const card2 = screen.getByTestId('card-card-2');

    const cardsContainer = screen.getByTestId('cards-container-col-1');
    const initialCards = within(cardsContainer).getAllByRole('heading', { level: 4 });
    expect(initialCards[0]).toHaveTextContent('User Authentication Audit');
    expect(initialCards[1]).toHaveTextContent('Vector Index Optimization');

    // Drag card-2 and drop onto card-1 to place card-2 above card-1
    const dataTransfer = {
      data: {} as Record<string, string>,
      setData: function (format: string, data: string) {
        this.data[format] = data;
      },
      getData: function (format: string) {
        return this.data[format];
      },
      dropEffect: 'none',
      effectAllowed: 'all',
    };

    fireEvent.dragStart(card2, { dataTransfer });
    fireEvent.dragOver(card1, { dataTransfer });
    fireEvent.drop(card1, { dataTransfer });

    // Verify order is now changed
    const reorderedCards = within(cardsContainer).getAllByRole('heading', { level: 4 });
    expect(reorderedCards[0]).toHaveTextContent('Vector Index Optimization');
    expect(reorderedCards[1]).toHaveTextContent('User Authentication Audit');
  });

  it('resets board to initial dummy data when reset button is clicked', () => {
    render(<KanbanBoard />);

    // Delete a card
    fireEvent.click(screen.getByTestId('delete-card-card-1'));
    expect(
      screen.queryByText('User Authentication Audit')
    ).not.toBeInTheDocument();

    // Click Reset
    fireEvent.click(screen.getByTestId('reset-board-button'));

    // Card should be restored
    expect(screen.getByText('User Authentication Audit')).toBeInTheDocument();
    expect(screen.getByTestId('column-count-col-1')).toHaveTextContent('2');
  });
});
