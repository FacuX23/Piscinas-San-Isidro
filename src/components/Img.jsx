import { useState } from 'react'

// <img> con respaldo: si la foto no carga, se muestra el mosaico de venecitas.
export default function Img({ src, alt, className = '', style, ...rest }) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return <div role="img" aria-label={alt} className={`venecitas ${className}`} style={style} />
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
      style={style}
      {...rest}
    />
  )
}
