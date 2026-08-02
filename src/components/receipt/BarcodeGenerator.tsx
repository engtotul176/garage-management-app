import React from 'react';

interface Props {
  value: string;
  width?: number;
  height?: number;
  showText?: boolean;
  className?: string;
}

/**
 * Generates an SVG representation of Code 128 / Code 39 style barcode
 */
export const BarcodeGenerator: React.FC<Props> = ({
  value,
  width = 180,
  height = 40,
  showText = true,
  className = ''
}) => {
  // Simple deterministic pattern generator for clean visual barcode rendering
  const generateBars = (str: string) => {
    const bars: Array<{ x: number; width: number }> = [];
    let currentX = 10;
    const totalBars = 35;
    const step = (width - 20) / totalBars;

    // Fixed start pattern
    bars.push({ x: currentX, width: 2.5 });
    currentX += 4;
    bars.push({ x: currentX, width: 1 });
    currentX += 3;

    // Pattern based on input character ASCII sum
    for (let i = 0; i < str.length; i++) {
      const charCode = str.charCodeAt(i);
      const barWidth = (charCode % 3) + 1;
      const gapWidth = ((charCode * 3) % 4) + 1.5;

      if (currentX + barWidth + gapWidth < width - 15) {
        bars.push({ x: currentX, width: barWidth });
        currentX += barWidth + gapWidth;
      }
    }

    // Stop pattern
    bars.push({ x: width - 18, width: 2.5 });
    bars.push({ x: width - 12, width: 1.5 });

    return bars;
  };

  const bars = generateBars(value || 'RCP-0000');

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="overflow-visible"
      >
        {bars.map((bar, idx) => (
          <rect
            key={idx}
            x={bar.x}
            y={2}
            width={bar.width}
            height={height - (showText ? 12 : 4)}
            fill="#000000"
          />
        ))}
      </svg>
      {showText && (
        <span className="text-[10px] font-mono tracking-widest text-black font-bold -mt-1">
          *{value}*
        </span>
      )}
    </div>
  );
};
