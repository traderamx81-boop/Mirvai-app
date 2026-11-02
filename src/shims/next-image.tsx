import React from 'react';

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  priority?: boolean;
  sizes?: string;
}

export default function Image({
  src,
  alt = '',
  width,
  height,
  fill,
  priority,
  sizes,
  className,
  style,
  ...rest
}: ImageProps) {
  const combinedStyle: React.CSSProperties | undefined = fill
    ? {
        position: 'absolute',
        height: '100%',
        width: '100%',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        objectFit: 'cover',
        ...style,
      }
    : style;

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={combinedStyle}
      loading={priority ? 'eager' : 'lazy'}
      {...rest}
    />
  );
}
