import React from 'react'
import PropTypes from 'prop-types'
import { DeleteIcon, DownloadIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  ButtonGroup,
  Checkbox,
  Heading,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
} from '@chakra-ui/react'
import { motion } from 'framer-motion'

import t from '../i18n'
import { handleDownload, TYPE } from '../utils/download'
import { formatDate } from '../utils/date'
import ConfirmDelete from './ConfirmDelete'

const DownloadButton = ({ onDownload }) => (
  <Menu>
    <MenuButton
      as={IconButton}
      title={t('DOWNLOAD')}
      aria-label={t('DOWNLOAD')}
      icon={<DownloadIcon />}
      borderRadius="200px"
    />
    <MenuList>
      <MenuItem onClick={() => onDownload(TYPE.FILE)}>
        {t('DOWNLOAD_FILE')}
      </MenuItem>
      <MenuItem onClick={() => onDownload(TYPE.IMAGE)}>
        {t('SAVE_IMAGE')}
      </MenuItem>
      <MenuItem onClick={() => onDownload(TYPE.PDF)}>{t('SAVE_PDF')}</MenuItem>
    </MenuList>
  </Menu>
)

const MOTION = {
  INITIAL: { opacity: 0 },
  VISIBLE: { opacity: 1 },
}

const AnswerCard = ({ answer, onDelete, onClick, onCheck, isSelected }) => (
  <Box
    as={motion.li}
    layout
    bgColor="rgba(255, 255, 255, 0.5)"
    p={3}
    initial={MOTION.INITIAL}
    animate={MOTION.VISIBLE}
    exit={MOTION.INITIAL}
    listStyleType="none"
  >
    <Stack direction="row" justifyContent="space-between">
      <Checkbox
        mr={2}
        isChecked={isSelected}
        onChange={(e) => onCheck(e.target.checked)}
      />
      <Button
        variant="unstyled"
        onClick={onClick}
        display="flex"
        flexDirection="column"
        alignItems="flex-start"
        justifyContent="center"
        flex="1"
        minWidth="0"
        textAlign="left"
      >
        <Heading
          title={answer.title || t('NEW_ANSWER')}
          as="p"
          size="sm"
          width="100%"
          isTruncated
        >
          {answer.title || t('NEW_ANSWER')}
        </Heading>

        <Heading as="p" size="xs" fontWeight="medium" width="100%" isTruncated>
          {formatDate(answer.date)}
        </Heading>
      </Button>
      <ButtonGroup spacing="0" variant="ghost">
        <DownloadButton onDownload={(type) => handleDownload(type, answer)} />
        <ConfirmDelete onConfirmDelete={onDelete}>
          <IconButton
            title={t('DELETE')}
            aria-label={t('DELETE')}
            icon={<DeleteIcon />}
            isRound
          />
        </ConfirmDelete>
      </ButtonGroup>
    </Stack>
  </Box>
)

AnswerCard.propTypes = {
  answer: PropTypes.shape().isRequired,
  onDelete: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  onCheck: PropTypes.func.isRequired,
  isSelected: PropTypes.bool,
}

export default AnswerCard
