import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';

interface Props {
  value: string;
  size?: number;
  className?: string;
}

export const QRCodeGenerator: React.FC<Props> = ({
  value,
  size = 80,
  className = ''
}) => {
  const [dataUrl, setDataUrl] = useState<string>('');

  useEffect(() => {
    let isMounted = true;

    if (!value) {
      setDataUrl('');
      return;
    }

    QRCode.toDataURL(
      value,
      {
        width: size * 2,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      },
      (err, url) => {
        if (!err && isMounted && url) {
          setDataUrl(url);
        }
      }
    );

    return () => {
      isMounted = false;
    };
  }, [value, size]);

  if (!dataUrl) {
    return (
      <div
        style={{ width: size, height: size }}
        className={`bg-gray-100 border border-gray-300 rounded flex items-center justify-center text-[9px] text-gray-500 font-mono ${className}`}
      >
        QR Code
      </div>
    );
  }

  return (
    <img
      src={dataUrl}
      alt={`QR Code: ${value}`}
      style={{ width: size, height: size }}
      className={`object-contain ${className}`}
    />
  );
};
