const noop = () => {}

/**
 * Chakra UI uses popperjs under the hood to handle popover positioning.
 * Mock this out in our tests to avoid an "act" warning
 */
export const createPopper = () => {
  return { state: null, forceUpdate: noop, destroy: noop, setOptions: noop }
}
