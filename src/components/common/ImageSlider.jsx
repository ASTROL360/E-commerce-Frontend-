import { useState, useEffect, useCallback } from 'react';
import { getCloudinaryUrl } from '../../utils/productImageUtils';
import './ImageSlider.css';

export default function ImageSlider({ images = [], alt = '' }) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const total = images.length;

  const next = useCallback(() => {
    setCurrent((i) => (i + 1) % total);
  }, [total]);

  const prev = useCallback(() => {
    setCurrent((i) => (i - 1 + total) % total);
  }, [total]);

  useEffect(() => {
    if (paused || total <= 1) return;
    const id = setInterval(next, 4000);
    return () => clearInterval(id);
  }, [paused, next, total]);

  useEffect(() => {
    setCurrent(0);
  }, [images.map(i => i.src).join(',')]);

  if (!total) return null;

  const img = images[current];

  return (
    <div
      className="image-slider"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="image-slider-main">
        <img
          src={getCloudinaryUrl(img.src, 800)}
          alt={alt ? `${alt} - ${img.label || current + 1}` : img.label}
          className="image-slider-img"
        />
        {total > 1 && (
          <>
            <button className="image-slider-arrow image-slider-arrow--left" onClick={prev} aria-label="Previous image">
              &#8249;
            </button>
            <button className="image-slider-arrow image-slider-arrow--right" onClick={next} aria-label="Next image">
              &#8250;
            </button>
          </>
        )}
        {img.label && (
          <span className="image-slider-label">{img.label}</span>
        )}
      </div>
      {total > 1 && (
        <div className="image-slider-dots">
          {images.map((_, idx) => (
            <button
              key={idx}
              className={`image-slider-dot ${idx === current ? 'image-slider-dot--active' : ''}`}
              onClick={() => setCurrent(idx)}
              aria-label={`Go to image ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
