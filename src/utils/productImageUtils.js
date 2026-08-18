export function getCloudinaryUrl(url, width) {
  if (!url || url.startsWith('/') || url.startsWith('data:') || url.startsWith('http') || !width) return url;
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}w=${width}&f_auto&q_auto`;
}

export function getPrimaryProductImage(product) {
  return product?.imageUrl || '/placeholder.png';
}
