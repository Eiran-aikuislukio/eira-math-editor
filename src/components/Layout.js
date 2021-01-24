import React from 'react'
import { AddIcon, HamburgerIcon } from '@chakra-ui/icons'
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  Grid,
  GridItem,
  IconButton,
  Stack,
  useDisclosure,
} from '@chakra-ui/react'
import styled from '@emotion/styled'

import { ReactComponent as Logo } from '../assets/logo/logo.svg'
import ophLogo from '../assets/logo/OPH_rahoittaa_valkoinen.png'
import useAnswersStore from '../store/answers'
import Editor from './Editor'
import UploadIcon from './UploadIcon'
import t from '../i18n'
import FileUploadModal from './FileUploadModal'
import Shortcuts from './Shortcuts'
import AnswersList from './AnswersList'

const StyledLogo = styled(Logo)`
  height: 90px;
  max-width: 100%;
  max-height: 100%;
`

const StyledImg = styled.img`
  width: auto;
  height: 100%;
`

const Layout = () => {
  const addAnswer = useAnswersStore((state) => state.addAnswer)

  const {
    isOpen: isModalOpen,
    onOpen: openModal,
    onClose: closeModal,
  } = useDisclosure()

  const {
    isOpen: isMenuOpen,
    onOpen: openMenu,
    onClose: closeMenu,
  } = useDisclosure()

  const handleAddAnswer = () => {
    addAnswer()
    closeMenu()
  }

  const handleFileSubmit = (fileContent) => {
    addAnswer(fileContent)
    closeModal()
    closeMenu()
  }

  const sidebarContent = (
    <>
      <Stack direction="row" spacing={2} mb={2}>
        <Button leftIcon={<AddIcon />} onClick={handleAddAnswer}>
          {t('NEW_ANSWER')}
        </Button>
        <Button leftIcon={<UploadIcon />} onClick={openModal}>
          {t('OPEN_FILE')}
        </Button>
      </Stack>

      <AnswersList onClick={closeMenu} />
    </>
  )

  return (
    <>
      <Grid
        h="100vh"
        templateAreas={[
          `'header' 'editor' 'footer'`,
          null,
          `'header header' 'sidebar editor' 'footer editor'`,
        ]}
        templateColumns={['1fr', null, '300px auto', '350px auto']}
        templateRows="max-content auto 150px"
      >
        <GridItem
          gridArea="header"
          as="header"
          bg="gray.600"
          p={4}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <StyledLogo />
          <Shortcuts />
          <IconButton
            aria-label={t('OPEN_MENU')}
            variant="ghost"
            display={['block', null, 'none']}
            size="lg"
            icon={<HamburgerIcon boxSize={8} color="white" />}
            onClick={openMenu}
          />
        </GridItem>

        <GridItem
          display={['none', null, 'flex']}
          gridArea="sidebar"
          bg="gray.500"
          p={4}
          alignItems="stretch"
          flexDirection="column"
        >
          {sidebarContent}
        </GridItem>

        <GridItem
          display="flex"
          flexDirection="column"
          gridArea="editor"
          bg="gray.400"
          width="100%"
          overflowY="auto"
          p={[2, 4]}
        >
          <Editor />
        </GridItem>

        <GridItem gridArea="footer" bg="gray.600" p={4}>
          <Stack
            height="100%"
            spacing={4}
            direction="row"
            alignItems="flex-end"
            justifyContent="space-between"
          >
            <StyledImg src={ophLogo} alt="Opetushallitus rahoittaa hanketta" />

            <a href="https://www.netlify.com">
              <img
                src="https://www.netlify.com/img/global/badges/netlify-dark.svg"
                alt="Deploys by Netlify"
              />
            </a>
          </Stack>
        </GridItem>
      </Grid>

      <FileUploadModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleFileSubmit}
      />

      <Drawer isOpen={isMenuOpen} placement="left" onClose={closeMenu}>
        <DrawerOverlay>
          <DrawerContent bg="gray.500" pt={14}>
            <DrawerCloseButton size="lg" color="white" />
            <DrawerBody
              display="flex"
              p={4}
              alignItems="stretch"
              flexDirection="column"
            >
              {sidebarContent}
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </>
  )
}

export default Layout
