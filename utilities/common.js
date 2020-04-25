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
