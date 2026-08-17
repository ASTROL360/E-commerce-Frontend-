export function getCloudinaryUrl(url, width) {
  if (!url || url.startsWith('/') || !width) return url;
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}w=${width}&f_auto&q_auto`;
}

export function getProductImageOptions(product) {
  const variants = (product?.colorVariants || [])
    .map((v) => ({ src: v?.imageUrl, label: v?.colorName || 'Default' }))
    .filter((v) => v.src);

  const options = [];
  const seen = new Set();

  const addOption = (src, label) => {
    if (!src || seen.has(src)) return;
    seen.add(src);
    options.push({ src, label });
  };

  variants.forEach((v) => addOption(v.src, v.label));

  if (!options.length && product?.imageUrl) {
    addOption(product.imageUrl, 'Default');
  }

  if (!options.length) {
    addOption('/placeholder.png', 'Default');
  }

  return options.slice(0, 4);
}

export function getPrimaryProductImage(product) {
  return getProductImageOptions(product)[0]?.src || '/placeholder.png';
}
