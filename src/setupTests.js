// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'
import useAnswersStore from './store/answers'

process.env.REACT_APP_SVG_RENDERING = 'client'

// Mock HTMLCanvasElement getContext
HTMLCanvasElement.prototype.getContext = () => {}

const initialState = useAnswersStore.getState()

beforeEach(() => {
  useAnswersStore.setState(initialState)
})
