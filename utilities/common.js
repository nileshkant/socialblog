export const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })

export const cloudinarytransformUrl = (fullUrl, parameters) => {
  const staticUrl = 'https://res.cloudinary.com/dec1s4jip/image'
  if (fullUrl.includes(staticUrl)) {
    const publicId = fullUrl.split('/').pop(-1)
    const transform = `${staticUrl}/upload/${parameters}/${publicId}`
    return transform
  }
  return `${staticUrl}/fetch/${parameters}/${fullUrl}`
}

export const lightOrDark = (color) => {
  if (!color) return 'noColor'
  // Variables for red, green, blue values
  let r
  let g
  let b
  let hsp = null

  // Check the format of the color, HEX or RGB?
  if (color.startsWith('rgb')) {
    // If HEX --> store the red, green, blue values in separate variables
    color = color.match(
      /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/
    )

    r = color[1]
    g = color[2]
    b = color[3]
  } else {
    // If RGB --> Convert it to HEX: http://gist.github.com/983661
    color = +('0x' + color.slice(1).replace(color.length < 5 && /./g, '$&$&'))

    r = color >> 16
    g = (color >> 8) & 255
    b = color & 255
  }

  // HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
  hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b))

  // Using the HSP value, determine whether the color is light or dark
  if (hsp > 180.5) {
    return 'light'
  } else {
    return 'dark'
  }
}
