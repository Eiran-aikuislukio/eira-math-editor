import { Kbd, SimpleGrid, Text } from '@chakra-ui/react'
import React from 'react'

const Label = ({ children }) => (
  <div>
    <Text fontSize="sm" color="gray.200">
      {children}
    </Text>
  </div>
)

const Plus = () => (
  <Text fontSize="sm" color="gray.200" as="span">
    +
  </Text>
)

const Shortcuts = () => (
  <SimpleGrid columns={2} spacing={8} alignItems="flex-start">
    <SimpleGrid
      templateColumns="repeat(2, max-content)"
      spacingX={4}
      spacingY={0}
    >
      <Label>Liitä kuva leikepöydältä</Label>
      <div>
        <Kbd>ctrl</Kbd> <Plus /> <Kbd>V</Kbd>
      </div>
      <Label>Kirjoita kaava</Label>
      <div>
        <Kbd>ctrl</Kbd> <Plus /> <Kbd>E</Kbd>
      </div>
    </SimpleGrid>

    <SimpleGrid
      templateColumns="repeat(2, max-content)"
      spacingX={4}
      spacingY={0}
    >
      <Label>Jakoviiva</Label>
      <div>
        <Kbd>/</Kbd>
      </div>
      <Label>Kertomerkki</Label>
      <div>
        <Kbd>*</Kbd>
      </div>
      <Label>Eksponentti</Label>
      <div>
        <Kbd>^</Kbd>
      </div>
      <Label>Sulje kaava</Label>
      <div>
        <Kbd>esc</Kbd>
      </div>
      <Label>Siirry seuraavalle riville</Label>
      <div>
        <Kbd>enter</Kbd>
      </div>
    </SimpleGrid>
  </SimpleGrid>
)

export default Shortcuts
