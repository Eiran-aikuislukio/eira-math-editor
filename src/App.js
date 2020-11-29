import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'

import Layout from './components/Layout'
import theme from './theme'

const App = () => (
  <ChakraProvider theme={theme}>
    <Layout />
  </ChakraProvider>
)

export default App
