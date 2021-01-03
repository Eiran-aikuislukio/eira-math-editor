import React from 'react'
import { AnimatePresence } from 'framer-motion'
import { Stack } from '@chakra-ui/react'

import useAnswersStore from '../store/answers'
import AnswerCard from './AnswerCard'

const AnswersList = () => {
  const answers = useAnswersStore((state) => state.answers)
  const deleteAnswer = useAnswersStore((state) => state.deleteAnswer)
  const selectAnswer = useAnswersStore((state) => state.selectAnswer)

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
            onClick={() => selectAnswer(answer.id)}
          />
        ))}
      </AnimatePresence>
    </Stack>
  )
}

export default AnswersList
