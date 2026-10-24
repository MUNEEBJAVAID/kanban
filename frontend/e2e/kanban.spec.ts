import { test, expect } from '@playwright/test';

test.describe('Kanban Board E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for the board to mount
    await expect(page.getByTestId('kanban-board')).toBeVisible();
  });

  test('displays single board with exactly 5 columns and initial dummy data', async ({
    page,
  }) => {
    // Heading
    await expect(
      page.getByRole('heading', { name: 'Project Management Board' })
    ).toBeVisible();

    // Verify 5 columns
    const columns = [
      'Backlog',
      'To Do',
      'In Progress',
      'In Review',
      'Done',
    ];

    for (const title of columns) {
      await expect(page.getByText(title, { exact: true })).toBeVisible();
    }

    // Verify initial cards are populated
    await expect(page.getByText('User Authentication Audit')).toBeVisible();
    await expect(page.getByText('Vector Index Optimization')).toBeVisible();
    await expect(page.getByText('Deployment Pipeline Setup')).toBeVisible();

    // Verify total cards indicator
    await expect(page.getByTestId('board-stats')).toContainText('Total Cards:10');
  });

  test('allows renaming a column', async ({ page }) => {
    // Rename 'To Do' column
    const todoTitle = page.getByTestId('column-title-col-2');
    await expect(todoTitle).toHaveText('To Do');

    // Click title to enter editing mode
    await todoTitle.click();

    const titleInput = page.getByTestId('column-title-input-col-2');
    await expect(titleInput).toBeVisible();

    await titleInput.fill('Sprint Queue');
    await titleInput.press('Enter');

    // Verify renamed column
    await expect(page.getByTestId('column-title-col-2')).toHaveText('Sprint Queue');
  });

  test('allows adding a new card to a column', async ({ page }) => {
    // Target 'Backlog' column (col-1)
    const addCardBtn = page.getByTestId('add-card-button-col-1');
    await addCardBtn.click();

    const titleInput = page.getByTestId('add-card-title-input');
    const detailsInput = page.getByTestId('add-card-details-input');
    const submitBtn = page.getByTestId('add-card-submit-button');

    await expect(titleInput).toBeVisible();
    await expect(submitBtn).toBeDisabled();

    await titleInput.fill('Implement Realtime WebSocket');
    await detailsInput.fill('Integrate bidirectional socket connections for live sync.');

    await expect(submitBtn).toBeEnabled();
    await submitBtn.click();

    // Verify new card is displayed
    await expect(page.getByText('Implement Realtime WebSocket')).toBeVisible();
    await expect(
      page.getByText('Integrate bidirectional socket connections for live sync.')
    ).toBeVisible();

    // Verify column counter updated to 3
    await expect(page.getByTestId('column-count-col-1')).toHaveText('3');
    // Total count increased to 11
    await expect(page.getByTestId('board-stats')).toContainText('Total Cards:11');
  });

  test('allows deleting an existing card from a column', async ({ page }) => {
    // Check initial presence
    const cardTitle = page.getByText('API Rate Limiting');
    await expect(cardTitle).toBeVisible();

    // Delete card-3
    const deleteBtn = page.getByTestId('delete-card-card-3');
    await deleteBtn.click();

    // Card should no longer be visible
    await expect(cardTitle).not.toBeVisible();

    // Total count decreased to 9
    await expect(page.getByTestId('board-stats')).toContainText('Total Cards:9');
  });

  test('drags and drops a card to another column', async ({ page }) => {
    await expect(page.getByTestId('column-count-col-1')).toHaveText('2');
    await expect(page.getByTestId('column-count-col-5')).toHaveText('2');

    // Perform HTML5 drag and drop
    await page.evaluate(() => {
      const card = document.querySelector('[data-testid="card-card-1"]');
      const targetColumn = document.querySelector('[data-testid="column-col-5"]');
      if (!card || !targetColumn) return;

      const dataTransfer = new DataTransfer();
      card.dispatchEvent(new DragEvent('dragstart', { bubbles: true, cancelable: true, dataTransfer }));
      targetColumn.dispatchEvent(new DragEvent('dragover', { bubbles: true, cancelable: true, dataTransfer }));
      targetColumn.dispatchEvent(new DragEvent('drop', { bubbles: true, cancelable: true, dataTransfer }));
      card.dispatchEvent(new DragEvent('dragend', { bubbles: true, cancelable: true, dataTransfer }));
    });

    // Verify card is now in Done column
    const doneContainer = page.getByTestId('cards-container-col-5');
    await expect(doneContainer.getByText('User Authentication Audit')).toBeVisible();

    // Verify column count updates
    await expect(page.getByTestId('column-count-col-1')).toHaveText('1');
    await expect(page.getByTestId('column-count-col-5')).toHaveText('3');
  });

  test('reorders cards within the same column', async ({ page }) => {
    // In Backlog, check initial card order
    const col1Cards = page.getByTestId('cards-container-col-1').locator('[data-testid^="card-"]');
    await expect(col1Cards.nth(0)).toContainText('User Authentication Audit');
    await expect(col1Cards.nth(1)).toContainText('Vector Index Optimization');

    // Drag card-2 and drop onto card-1
    await page.evaluate(() => {
      const card1 = document.querySelector('[data-testid="card-card-1"]');
      const card2 = document.querySelector('[data-testid="card-card-2"]');
      if (!card1 || !card2) return;

      const dataTransfer = new DataTransfer();
      card2.dispatchEvent(new DragEvent('dragstart', { bubbles: true, cancelable: true, dataTransfer }));
      card1.dispatchEvent(new DragEvent('dragover', { bubbles: true, cancelable: true, dataTransfer }));
      card1.dispatchEvent(new DragEvent('drop', { bubbles: true, cancelable: true, dataTransfer }));
      card2.dispatchEvent(new DragEvent('dragend', { bubbles: true, cancelable: true, dataTransfer }));
    });

    // Verify the order has reversed
    await expect(col1Cards.nth(0)).toContainText('Vector Index Optimization');
    await expect(col1Cards.nth(1)).toContainText('User Authentication Audit');
  });
});
