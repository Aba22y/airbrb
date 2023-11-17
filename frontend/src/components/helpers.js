// Check if date is valid
export const isValidAddress = (address) => {
  const addressRegex = /^([^,]+),([^,]+),([^,]+),(\d+),([^,]+)$/;
  return addressRegex.test(address);
}

// Convert image to base64, taken from assignment3
export function getBase64 (file) {
  const validFileTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  const valid = validFileTypes.find(type => type === file.type);
  if (!valid) {
    throw Error('provided file is not a png, jpg or jpeg image.');
  }
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = () => {
      resolve(fileReader.result);
    }
    fileReader.onerror = (err) => {
      reject(err);
    }

    fileReader.readAsDataURL(file);
  })
}

export const getAvgRating = (reviews) => {
  let total = 0;
  for (const review of reviews) {
    total += review.rating;
  }
  return total / reviews.length;
}
