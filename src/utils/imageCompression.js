const MAX_UPLOAD_IMAGE_SIZE = 900 * 1024
const MAX_IMAGE_DIMENSION = 1400
const IMAGE_COMPRESSION_QUALITY = 0.82

/* Product image upload compression V1 */
export const compressProductImage = (file) => {
  if (!file?.type?.startsWith("image/") || file.size <= MAX_UPLOAD_IMAGE_SIZE) {
    return Promise.resolve(file)
  }

  return new Promise((resolve) => {
    const image = new Image()
    const objectUrl = URL.createObjectURL(file)

    image.onload = () => {
      const scale = Math.min(1, MAX_IMAGE_DIMENSION / Math.max(image.width, image.height))
      const width = Math.max(1, Math.round(image.width * scale))
      const height = Math.max(1, Math.round(image.height * scale))
      const canvas = document.createElement("canvas")
      const context = canvas.getContext("2d")

      canvas.width = width
      canvas.height = height
      context.fillStyle = "#ffffff"
      context.fillRect(0, 0, width, height)
      context.drawImage(image, 0, 0, width, height)

      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(objectUrl)

          if (!blob) {
            resolve(file)
            return
          }

          const compressedFile = new File(
            [blob],
            file.name.replace(/\.[^/.]+$/, ".jpg"),
            { type: "image/jpeg", lastModified: Date.now() }
          )

          resolve(compressedFile.size < file.size ? compressedFile : file)
        },
        "image/jpeg",
        IMAGE_COMPRESSION_QUALITY
      )
    }

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      resolve(file)
    }

    image.src = objectUrl
  })
}

export const isImageUploadTooLarge = (file) => file?.size > MAX_UPLOAD_IMAGE_SIZE
