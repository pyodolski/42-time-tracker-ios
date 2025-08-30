const fs = require('fs');
const path = require('path');

// 간단한 PNG 아이콘 생성 (base64 인코딩된 작은 아이콘)
const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];

// 간단한 TimeTracker 아이콘을 Canvas API 없이 생성
const generateSimpleIcon = (size) => {
  // 간단한 1x1 픽셀 파란색 PNG (실제로는 SVG를 사용하는 것이 좋지만, 임시로 생성)
  const canvas = `<svg width="${size}" height="${size}" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <circle cx="256" cy="256" r="240" fill="#3b82f6" stroke="#1e40af" stroke-width="8"/>
    <circle cx="256" cy="256" r="180" fill="white" stroke="#3b82f6" stroke-width="4"/>
    <g fill="#1e40af" font-family="Arial, sans-serif" font-size="24" font-weight="bold" text-anchor="middle">
      <text x="256" y="110" dominant-baseline="middle">12</text>
      <text x="370" y="266" dominant-baseline="middle">3</text>
      <text x="256" y="420" dominant-baseline="middle">6</text>
      <text x="142" y="266" dominant-baseline="middle">9</text>
    </g>
    <line x1="256" y1="256" x2="220" y2="180" stroke="#1e40af" stroke-width="8" stroke-linecap="round"/>
    <line x1="256" y1="256" x2="320" y2="140" stroke="#1e40af" stroke-width="6" stroke-linecap="round"/>
    <circle cx="256" cy="256" r="12" fill="#1e40af"/>
    <g fill="#10b981" stroke="#10b981" stroke-width="3">
      <polyline points="180,320 195,335 220,310" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <polyline points="290,320 305,335 330,310" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    </g>
  </svg>`;
  
  return canvas;
};

// 각 크기별로 SVG 파일 생성 (PNG 변환은 브라우저나 별도 도구 필요)
iconSizes.forEach(size => {
  const svgContent = generateSimpleIcon(size);
  const filename = `public/icons/icon-${size}x${size}.svg`;
  fs.writeFileSync(filename, svgContent);
  console.log(`Generated ${filename}`);
});

console.log('아이콘 생성 완료! SVG 파일들이 생성되었습니다.');
console.log('실제 PWA에서는 PNG 파일이 필요하므로, 온라인 SVG to PNG 변환기를 사용하거나');
console.log('브라우저에서 SVG를 PNG로 변환하는 과정이 필요합니다.');
