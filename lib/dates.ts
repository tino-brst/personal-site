function compareDatesDesc(a: Date | number, b: Date | number): number {
  if (b > a) return 1
  if (b < a) return -1
  return 0
}

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

function formatDate(value: number | Date): string {
  const date = value instanceof Date ? value : new Date(value)
  const currentDate = new Date()
  const dateString = dateFormatter.format(value)

  // Omit the year if it's the current one
  if (date.getFullYear() === currentDate.getFullYear()) {
    return dateString.split(',')[0]
  }

  return dateString
}

export { compareDatesDesc, formatDate }
