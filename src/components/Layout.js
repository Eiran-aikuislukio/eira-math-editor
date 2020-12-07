import { Grid, GridItem, Stack } from '@chakra-ui/react'
import styled from '@emotion/styled'
import React from 'react'

import { ReactComponent as EiraLogo } from '../assets/logo/eira.svg'
import ophLogo from '../assets/logo/OPH_rahoittaa_valkoinen.png'

const StyledIframe = styled.iframe`
  width: 100%;
  min-height: 400px;
`

const StyledLogo = styled(EiraLogo)`
  max-width: 100%;
  max-height: 100%;
`

const StyledImg = styled.img`
  width: auto;
  height: 100%;
`

const Layout = () => {
  return (
    <Grid
      h="100vh"
      templateAreas={[
        `'header' 'editor' 'footer'`,
        null,
        `'header editor' 'sidebar editor' 'footer editor'`,
      ]}
      templateColumns={['1fr', null, '200px auto', '300px auto']}
      templateRows="120px auto 150px"
    >
      <GridItem gridArea="header" bg="brand.900" p={4}>
        <StyledLogo />
      </GridItem>

      <GridItem
        display={['none', null, 'block']}
        gridArea="sidebar"
        bg="brand.800"
      />

      <GridItem
        display="flex"
        alignItems="stretch"
        justifyContent="stretch"
        gridArea="editor"
        bg="brand.700"
        width="100%"
      >
        <StyledIframe title="editor" src="/editor/editor.html" />
      </GridItem>

      <GridItem gridArea="footer" bg="brand.900" p={4} alignItems="center">
        <StyledImg src={ophLogo} alt="Opetushallitus rahoittaa hanketta" />
      </GridItem>
    </Grid>
  )
}

export default Layout
