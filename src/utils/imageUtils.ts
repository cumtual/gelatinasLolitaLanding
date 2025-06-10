import React from 'react';

/**
 * Verifica si el navegador soporta el formato WebP
 * @returns Promise<boolean>
 */
export const supportsWebP = async (): Promise<boolean> => {
  if (!window.createImageBitmap) return false;

  const webpData = 'data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=';
  try {
    const blob = await fetch(webpData).then(r => r.blob());
    return createImageBitmap(blob).then(() => true, () => false);
  } catch (e) {
    return false;
  }
};

/**
 * Convierte una ruta de imagen a su versión WebP si está disponible
 * @param imagePath Ruta de la imagen original
 * @returns Promise<string> Ruta de la imagen (WebP o la original)
 */
export const getOptimizedImagePath = async (imagePath: string): Promise<string> => {
  const isWebPSupported = await supportsWebP();
  
  if (isWebPSupported) {
    // Convertir la ruta de la imagen a WebP
    return imagePath.replace(/\.(png|jpg|jpeg)$/, '.webp');
  }
  
  return imagePath;
};

/**
 * Componente de imagen optimizada que usa WebP si está disponible
 */
interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({ 
  src, 
  alt, 
  className, 
  style 
}) => {
  const [imageSrc, setImageSrc] = React.useState(src);

  React.useEffect(() => {
    const loadOptimizedImage = async () => {
      const optimizedSrc = await getOptimizedImagePath(src);
      setImageSrc(optimizedSrc);
    };

    loadOptimizedImage();
  }, [src]);

  return React.createElement('picture', null,
    React.createElement('source', {
      srcSet: imageSrc.replace(/\.(png|jpg|jpeg)$/, '.webp'),
      type: 'image/webp'
    }),
    React.createElement('source', {
      srcSet: src,
      type: 'image/png'
    }),
    React.createElement('img', {
      src: imageSrc,
      alt: alt,
      className: className,
      style: style,
      loading: 'lazy' as const
    })
  );
}; 