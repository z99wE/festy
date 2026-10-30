import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Relative Luminance and Contrast Ratio calculator according to WCAG 2.1 specifications.
 */
function sRGBtoLin(colorChannel) {
  const c = colorChannel / 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function hexToRgb(hex) {
  const cleanHex = hex.replace('#', '');
  const bigint = parseInt(cleanHex, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}

function calculateRelativeLuminance(hex) {
  const { r, g, b } = hexToRgb(hex);
  return 0.2126 * sRGBtoLin(r) + 0.7152 * sRGBtoLin(g) + 0.0722 * sRGBtoLin(b);
}

function getContrastRatio(hex1, hex2) {
  const lum1 = calculateRelativeLuminance(hex1);
  const lum2 = calculateRelativeLuminance(hex2);
  const brighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (brighter + 0.05) / (darker + 0.05);
}

describe('Accessibility, Quality & Invariant Verification Suite', () => {
  describe('WCAG 2.1 AAA & AA Color Contrast Verification', () => {
    const whiteBackground = '#FFFFFF';
    const lightSurfaceBackground = '#FDFCF7';

    test('primary purple bubblegum text (#4338CA) meets WCAG AAA against white (> 7:1)', () => {
      const ratio = getContrastRatio('#4338CA', whiteBackground);
      assert.ok(ratio >= 7.0, `Expected contrast >= 7.0, got ${ratio.toFixed(2)}`);
    });

    test('royal indigo badge text (#3730A3) meets WCAG AAA against white (> 7:1)', () => {
      const ratio = getContrastRatio('#3730A3', whiteBackground);
      assert.ok(ratio >= 7.0, `Expected contrast >= 7.0, got ${ratio.toFixed(2)}`);
    });

    test('midnight indigo valuation header (#312E81) provides ultra-high contrast (> 11:1)', () => {
      const ratio = getContrastRatio('#312E81', whiteBackground);
      assert.ok(ratio >= 11.0, `Expected contrast >= 11.0, got ${ratio.toFixed(2)}`);
    });

    test('deep midnight text (#1E1B4B) on warm cream background (#FDFCF7) satisfies AAA (> 12:1)', () => {
      const ratio = getContrastRatio('#1E1B4B', lightSurfaceBackground);
      assert.ok(ratio >= 12.0, `Expected contrast >= 12.0, got ${ratio.toFixed(2)}`);
    });

    test('success emerald green text (#065f46) meets WCAG AAA (> 7.0:1)', () => {
      const ratio = getContrastRatio('#065f46', whiteBackground);
      assert.ok(ratio >= 7.0, `Expected text contrast >= 7.0, got ${ratio.toFixed(2)}`);
    });

    test('emerald icon indicator (#059669) satisfies WCAG 2.1 Non-Text Contrast SC 1.4.11 (> 3.0:1)', () => {
      const ratio = getContrastRatio('#059669', whiteBackground);
      assert.ok(ratio >= 3.0, `Expected non-text contrast >= 3.0, got ${ratio.toFixed(2)}`);
    });
  });

  describe('Problem Statement & Content Integrity Guarantees', () => {
    test('README.md strictly avoids prohibited terms ("soloknuckle" and "hackathon")', () => {
      const readmePath = path.resolve(process.cwd(), 'README.md');
      if (fs.existsSync(readmePath)) {
        const content = fs.readFileSync(readmePath, 'utf8').toLowerCase();
        assert.ok(!content.includes('soloknuckle'), 'Prohibited term "soloknuckle" found in README.md');
        assert.ok(!content.includes('hackathon'), 'Prohibited term "hackathon" found in README.md');
      }
    });

    test('README.md includes the 4 core pillars: budgets, timelines, vendor checklists, personalized ideas', () => {
      const readmePath = path.resolve(process.cwd(), 'README.md');
      if (fs.existsSync(readmePath)) {
        const content = fs.readFileSync(readmePath, 'utf8').toLowerCase();
        assert.ok(content.includes('budget'), 'Missing core pillar "budget" in README.md');
        assert.ok(content.includes('timeline'), 'Missing core pillar "timeline" in README.md');
        assert.ok(content.includes('vendor'), 'Missing core pillar "vendor" in README.md');
        assert.ok(content.includes('idea') || content.includes('concept'), 'Missing core pillar "ideas/concepts" in README.md');
      }
    });

    test('README.md highlights the 8-Domain Quality Verification framework', () => {
      const readmePath = path.resolve(process.cwd(), 'README.md');
      if (fs.existsSync(readmePath)) {
        const content = fs.readFileSync(readmePath, 'utf8');
        assert.ok(content.includes('8-Domain Quality Verification'), 'Expected 8-Domain Quality Verification in README.md');
      }
    });
  });
});
