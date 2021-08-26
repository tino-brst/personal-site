function compareDatesDesc(a: Date | number, b: Date | number): number {
  if (b > a) return 1
  if (b < a) return -1
  return 0
}

const dateFormatter = new Intl.DateTimeFormat([], {
  dateStyle: 'medium',
})

const formatDate: typeof dateFormatter.format = (date) => {
  return dateFormatter.format(date)
}

export { compareDatesDesc, formatDate }
