import React from 'react'
import PropTypes from 'prop-types'
import { AnimatePresence } from 'framer-motion'
import { Stack } from '@chakra-ui/react'

import useAnswersStore from '../store/answers'
import AnswerCard from './AnswerCard'

const AnswersList = ({ onClick }) => {
  const answers = useAnswersStore((state) => state.answers)
  const deleteAnswer = useAnswersStore((state) => state.deleteAnswer)
  const selectAnswer = useAnswersStore((state) => state.selectAnswer)

  const handleSelectAnswer = (answer) => {
    onClick()
    selectAnswer(answer.id)
  }

  return (
    <Stack
      as="ul"
      spacing={2}
      flex="1"
      minHeight="0"
      overflowX="hidden"
      overflowY="auto"
    >
      <AnimatePresence initial={false}>
        {answers.map((answer) => (
          <AnswerCard
            key={answer.id}
            answer={answer}
            onDelete={() => deleteAnswer(answer.id)}
            onClick={() => handleSelectAnswer(answer)}
          />
        ))}
      </AnimatePresence>
    </Stack>
  )
}

AnswersList.propTypes = {
  onClick: PropTypes.func.isRequired,
}

export default AnswersList
