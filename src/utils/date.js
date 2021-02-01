export const formatDate = (timestamp) =>
  new Date(timestamp).toLocaleDateString('fi', {
    hour: '2-digit',
    minute: '2-digit',
  })
