import { v4 as uuid } from 'uuid'
import create from 'zustand'
import t from '../i18n'

const LOCAL_KEY = 'answers'

const getInitialAnswer = () => ({
  id: uuid(),
  title: t('NEW_ANSWER'),
  date: Date.now(),
})

const getFromLocalStorage = (key, initialValue) => {
  try {
    const item = window.localStorage.getItem(key)

    return item ? JSON.parse(item) : initialValue
  } catch (error) {
    return initialValue
  }
}

const setLocalStorage = (answers) => {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(answers))
  } catch (error) {
    console.warn('Failed to store items in local storage', error)
  }
}

const persistedAnswers = getFromLocalStorage(LOCAL_KEY, [getInitialAnswer()])

const useAnswersStore = create((set, get) => ({
  answers: persistedAnswers,

  selectedAnswerId: persistedAnswers[0]?.id ?? null,

  selectAnswer: (selectedAnswerId) => set({ selectedAnswerId }),

  addAnswer: (file = {}) => {
    const id = uuid()
    const answers = [
      {
        ...file,
        id,
        date: file.date || Date.now(),
        title: file.title || t('NEW_ANSWER'),
      },
      ...get().answers,
    ]

    set({ answers, selectedAnswerId: id })
    setLocalStorage(answers)

    return id
  },

  updateAnswer: (id, answer) => {
    const prevAnswers = get().answers
    const answerIndex = prevAnswers.findIndex((answer) => answer.id === id)

    if (answerIndex > -1) {
      const updatedAnswer = {
        ...prevAnswers[answerIndex],
        ...answer,
      }

      const answers = prevAnswers.map((originalAnswer, i) =>
        i === answerIndex ? updatedAnswer : originalAnswer
      )

      set({ answers })
      setLocalStorage(answers)
    }
  },

  deleteAnswer: (id) => {
    const answers = get().answers.filter((answer) => answer.id !== id)

    if (answers.length === 0) {
      answers.push(getInitialAnswer())
    }

    set({ answers, selectedAnswerId: answers[0]?.id })
    setLocalStorage(answers)
  },
}))

export default useAnswersStore
