import { generateCardSvg } from '../colour/card';
import { hexToLab } from '../colour/srgb';
import fs from 'fs';

// Node script to generate synthetic images (10.1)
// We would use `sharp` here to render the SVG, apply lighting, noise, etc.
// For now, this is a skeleton that can output the basic SVG

export async function generateSyntheticFixture(outPath: string) {
  const svg = generateCardSvg();
  fs.writeFileSync(outPath, svg, 'utf-8');
}
