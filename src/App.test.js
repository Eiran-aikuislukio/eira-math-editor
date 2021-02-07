import {
  render,
  screen,
  fireEvent,
  within,
  waitFor,
} from '@testing-library/react'

import App from './App'
import t from './i18n'
import useAnswersStore from './store/answers'

// Mock the Editor to avoid testing rich-text-editor
jest.mock('./components/Editor', () => {
  return {
    __esModule: true,
    default: () => {
      return <div></div>
    },
  }
})

describe('App', () => {
  it('initially renders with one default answer', () => {
    render(<App />)

    expect(screen.getAllByTestId('answer-card')).toHaveLength(1)
  })

  it('adds an answer to the sidebar when clicking the add answer button', () => {
    render(<App />)

    fireEvent.click(
      screen.getByRole('button', {
        label: t('NEW_ANSWER'),
      })
    )

    expect(screen.getAllByTestId('answer-card')).toHaveLength(2)
  })

  it('deletes an answer when clicking delete', async () => {
    const store = useAnswersStore.getState()
    const title = 'Delete me'

    // Add two answers
    store.addAnswer()
    store.addAnswer({ id: 'xyz', title })

    render(<App />)

    // Initially, three answers should be shown in the sidebar
    expect(screen.getAllByTestId('answer-card')).toHaveLength(3)

    // Find and delete an answer
    const card = screen.getByText(title).closest('[data-testid=answer-card]')
    fireEvent.click(within(card).getByLabelText(t('DELETE')))
    await fireEvent.click(within(card).getByTestId('confirm-delete'))

    // Wait for the exit transition to remove the answer card
    await waitFor(() => {
      expect(screen.queryByText(title)).not.toBeInTheDocument()
    })

    expect(screen.getAllByTestId('answer-card')).toHaveLength(2)
  })
})
