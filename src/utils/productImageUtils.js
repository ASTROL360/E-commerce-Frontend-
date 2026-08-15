export function fileToDataUrl(file, maxSize = 900, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(img.width * scale));
        canvas.height = Math.max(1, Math.round(img.height * scale));
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
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
