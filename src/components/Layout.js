import React from 'react'
import { AddIcon } from '@chakra-ui/icons'
import { Button, Grid, GridItem, Stack, useDisclosure } from '@chakra-ui/react'
import styled from '@emotion/styled'

import { ReactComponent as EiraLogo } from '../assets/logo/eira.svg'
import ophLogo from '../assets/logo/OPH_rahoittaa_valkoinen.png'
import useAnswersStore from '../store/answers'
import Editor from './Editor'
import UploadIcon from './UploadIcon'
import t from '../i18n'
import FileUploadModal from './FileUploadModal'
import Shortcuts from './Shortcuts'
import AnswersList from './AnswersList'

const StyledLogo = styled(EiraLogo)`
  max-width: 100%;
  max-height: 100%;
`

const StyledImg = styled.img`
  width: auto;
  height: 100%;
`

const Layout = () => {
  const addAnswer = useAnswersStore((state) => state.addAnswer)

  const { isOpen, onOpen, onClose } = useDisclosure()

  const handleFileSubmit = (fileContent) => {
    addAnswer(fileContent)
    onClose()
  }

  return (
    <>
      <Grid
        h="100vh"
        templateAreas={[
          `'header' 'editor' 'footer'`,
          null,
          `'header header' 'sidebar editor' 'footer editor'`,
        ]}
        templateColumns={['1fr', null, '200px auto', '300px auto']}
        templateRows="max-content auto 150px"
      >
        <GridItem
          gridArea="header"
          as="header"
          bg="brand.900"
          p={4}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <StyledLogo height="90px" />
          <Shortcuts />
        </GridItem>

        <GridItem
          display={['none', null, 'flex']}
          gridArea="sidebar"
          bg="brand.800"
          p={3}
          alignItems="stretch"
          flexDirection="column"
          minHeight="0"
        >
          <Stack direction="row" spacing={2} mb={2}>
            <Button leftIcon={<AddIcon />} onClick={() => addAnswer()}>
              {t('NEW_ANSWER')}
            </Button>
            <Button leftIcon={<UploadIcon />} onClick={onOpen}>
              {t('OPEN_FILE')}
            </Button>
          </Stack>

          <AnswersList />
        </GridItem>

        <GridItem
          display="flex"
          alignItems="stretch"
          justifyContent="stretch"
          gridArea="editor"
          bg="brand.700"
          width="100%"
        >
          <Editor />
        </GridItem>

        <GridItem gridArea="footer" bg="brand.900" p={4} alignItems="center">
          <StyledImg src={ophLogo} alt="Opetushallitus rahoittaa hanketta" />
        </GridItem>
      </Grid>

      <FileUploadModal
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={handleFileSubmit}
      />
    </>
  )
}

export default Layout
