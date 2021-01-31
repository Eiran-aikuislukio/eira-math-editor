import { Box, Link, Stack } from '@chakra-ui/react'
import React from 'react'
import styled from '@emotion/styled'

import ophLogo from '../assets/logo/OPH_rahoittaa_valkoinen.png'

const StyledImg = styled.img`
  width: 100px;
  height: auto;
`

const Footer = () => (
  <Stack as="footer" height="100%" spacing={6}>
    <Box textAlign={['center', null, 'left']}>
      <p>
        <Link href="https://www.eira.fi" isExternal>
          Eiran aikuislukio
        </Link>
      </p>
      <p>
        <Link href="https://www.omaantahtiin.com" isExternal>
          Matematiikan ja fysiikan verkkokirjat
        </Link>
      </p>
    </Box>

    <Stack
      spacing={4}
      direction="row"
      alignItems={['center', null, 'flex-end']}
      justifyContent={['center', null, 'space-between']}
    >
      <StyledImg src={ophLogo} alt="Opetushallitus rahoittaa hanketta" />

      <a href="https://www.netlify.com">
        <StyledImg
          src="https://www.netlify.com/img/global/badges/netlify-dark.svg"
          alt="Deploys by Netlify"
        />
      </a>
    </Stack>
  </Stack>
)

export default Footer
