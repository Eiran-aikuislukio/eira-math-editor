import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { css, Global } from '@emotion/react'
import styled from '@emotion/styled'

import Layout from './components/Layout'
import theme from './theme'

const globalStyles = css`
  body {
    margin: 0;
  }

  .rich-text-editor-tools {
    z-index: 4;
  }
`

const DownloadWrapper = styled.div`
  position: absolute;
  z-index: -1000;
  top: 0;
  left: 0;
  width: 800px;
`

const DownloadContainer = styled.div`
  background: white;
`

export const Providers = ({ children }) => (
  <ChakraProvider theme={theme}>
    <Global styles={globalStyles} />
    {children}
  </ChakraProvider>
)

const App = () => (
  <Providers>
    <Layout />
    <DownloadWrapper>
      <DownloadContainer id="download-container" />
    </DownloadWrapper>
  </Providers>
)

export default App
