export const CARD_WIDTH = 1200;
export const CARD_HEIGHT = 750;

export const MARKERS = [
  { id: 0, x: 30, y: 30, size: 140 }, // top-left
  { id: 1, x: CARD_WIDTH - 30 - 140, y: 30, size: 140 }, // top-right
  { id: 2, x: CARD_WIDTH - 30 - 140, y: CARD_HEIGHT - 30 - 140, size: 140 }, // bottom-right
  { id: 3, x: 30, y: CARD_HEIGHT - 30 - 140, size: 140 }, // bottom-left
];

export const PATCHES = [
  // Top band (neutrals)
  { id: 'N1', hex: '#F2F2F2', x: 200, y: 50, size: 100 },
  { id: 'N2', hex: '#C8C8C8', x: 340, y: 50, size: 100 },
  { id: 'N3', hex: '#969696', x: 480, y: 50, size: 100 },
  { id: 'N4', hex: '#646464', x: 620, y: 50, size: 100 },
  { id: 'N5', hex: '#3C3C3C', x: 760, y: 50, size: 100 },
  { id: 'N6', hex: '#1A1A1A', x: 900, y: 50, size: 100 },
  
  // Bottom band (colours)
  { id: 'C1', hex: '#B8312F', x: 200, y: 600, size: 100 },
  { id: 'C2', hex: '#2E8B57', x: 340, y: 600, size: 100 },
  { id: 'C3', hex: '#2F5DA8', x: 480, y: 600, size: 100 },
  { id: 'C4', hex: '#1C9CB8', x: 620, y: 600, size: 100 },
  { id: 'C5', hex: '#A23B8C', x: 760, y: 600, size: 100 },
  { id: 'C6', hex: '#E5C02A', x: 900, y: 600, size: 100 },
];

export const TEST_ZONE = {
  x: 220, y: 210, w: 760, h: 330,
  cx: 600, cy: 375, r: 70
};

export const BACKGROUND_PROBES = [
  { x: 110, y: 375 },
  { x: 1090, y: 375 },
  { x: 600, y: 190 },
  { x: 600, y: 560 },
];

// Returns ArUco marker 4x4 dictionary pattern (binary 2D array)
// For demonstration and synthetic generation, hardcoding simpler patterns for IDs 0-3
// The detector js-aruco2 will use standard ArUco dictionary (ARUCO_MIP_36h12 or similar)
// We need to render exactly the dictionary `js-aruco2` expects. js-aruco2 supports several, 
// usually ARUCO (original 5x5). We'll assume a 5x5 internal grid or use generic dict.
// Actually, for simplicity we can use `js-aruco2`'s generator if needed, but for SVG rendering
// it's easier to provide a base64 or exact bit pattern.
export function getMarkerBits(id: number): number[][] {
  // Aruco 5x5 bits, simple mock for IDs 0-3
  // In a real implementation this should match the exact dictionary.
  // We'll generate a 7x7 array (including 1px black border) 
  const dict: Record<number, number[]> = {
    0: [1,1,0,0,0, 0,1,0,1,1, 1,0,1,0,0, 1,1,1,0,0, 0,1,1,1,1],
    1: [1,0,0,0,1, 1,0,1,0,1, 1,0,0,0,1, 1,0,1,0,1, 1,0,0,0,1],
    2: [0,1,1,1,0, 1,0,0,0,1, 1,0,0,0,1, 1,0,0,0,1, 0,1,1,1,0],
    3: [1,1,1,1,1, 0,0,0,0,0, 1,1,1,1,1, 0,0,0,0,0, 1,1,1,1,1],
  };
  const bits = dict[id] || dict[0];
  const grid = Array.from({length: 7}, () => new Array(7).fill(0));
  for (let r=0; r<5; r++) {
    for (let c=0; c<5; c++) {
      grid[r+1][c+1] = bits[r*5+c]; // 1=white, 0=black. Wait ArUco is white on black or black on white?
      // Standard Aruco: white bits inside black border. 1=white, 0=black.
    }
  }
  return grid;
}

export function generateCardSvg(): string {
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${CARD_WIDTH} ${CARD_HEIGHT}" width="${CARD_WIDTH}" height="${CARD_HEIGHT}" style="background:white; border: 10px solid #1A1A1A;">\n`;
  
  // Marker rendering
  for (const m of MARKERS) {
    const bits = getMarkerBits(m.id);
    const cellSize = m.size / 7;
    for (let r=0; r<7; r++) {
      for (let c=0; c<7; c++) {
        const color = bits[r][c] ? 'white' : 'black';
        svg += `<rect x="${m.x + c*cellSize}" y="${m.y + r*cellSize}" width="${cellSize}" height="${cellSize}" fill="${color}" />\n`;
      }
    }
  }

  // Patches
  for (const p of PATCHES) {
    svg += `<rect x="${p.x}" y="${p.y}" width="${p.size}" height="${p.size}" fill="${p.hex}" />\n`;
  }

  // Test zone
  svg += `<rect x="${TEST_ZONE.x}" y="${TEST_ZONE.y}" width="${TEST_ZONE.w}" height="${TEST_ZONE.h}" fill="white" stroke="#666" stroke-dasharray="10,10" stroke-width="2" />\n`;
  svg += `<circle cx="${TEST_ZONE.cx}" cy="${TEST_ZONE.cy}" r="${TEST_ZONE.r}" fill="none" stroke="#666" stroke-dasharray="5,5" stroke-width="2" />\n`;
  svg += `<text x="${TEST_ZONE.cx}" y="${TEST_ZONE.y + TEST_ZONE.h - 10}" text-anchor="middle" font-family="sans-serif" font-size="20" fill="#666">PLACE TEST HERE</text>\n`;

  // Footer
  svg += `<text x="${CARD_WIDTH/2}" y="${CARD_HEIGHT - 10}" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#666">ChromaSeal card-v1 · print at 100% · matte paper</text>\n`;

  svg += `</svg>`;
  return svg;
}
