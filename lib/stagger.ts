function getStaggerProps(index: number = 0) {
  return {
    // Setting it to 'true' makes it render as data-stagger="true", setting it
    // to '' makes it show as just data-stagger 👍
    'data-stagger': '',
    style: {
      '--stagger': index,
    },
  }
}

export { getStaggerProps }
