import { describe, it, expect } from "vitest";

interface TamagotchiState {
  hype: number;
  vibe: number;
  snacks: number;
  hearts: number;
  mood: "vibing" | "eating" | "dancing" | "budgetGuru" | "sleepy";
}

function feedMascot(prev: TamagotchiState): TamagotchiState {
  return {
    ...prev,
    snacks: Math.min(100, prev.snacks + 15),
    hearts: prev.hearts + 1,
    mood: "eating",
  };
}

function boostHype(prev: TamagotchiState): TamagotchiState {
  return {
    ...prev,
    hype: Math.min(100, prev.hype + 10),
    hearts: prev.hearts + 2,
    mood: "dancing",
  };
}

function performVibeCheck(prev: TamagotchiState): TamagotchiState {
  return {
    ...prev,
    vibe: Math.min(100, prev.vibe + 8),
    hearts: prev.hearts + 1,
    mood: "budgetGuru",
  };
}

function getMoodAscii(mood: TamagotchiState["mood"]): string {
  switch (mood) {
    case "eating":
      return "(っ˘ڡ˘ς) 🍬";
    case "dancing":
      return "(⌐■_■) 🎧";
    case "budgetGuru":
      return "(◕‿◕) 💎";
    case "sleepy":
      return "(∪｡∪)｡｡zZ";
    default:
      return "(◕ᴥ◕) 🦊✨";
  }
}

describe("Tamagotchi Mascot Companion State Machine", () => {
  const initialState: TamagotchiState = {
    hype: 85,
    vibe: 90,
    snacks: 70,
    hearts: 10,
    mood: "vibing",
  };

  it("feeds snack and increments level hearts", () => {
    const fed = feedMascot(initialState);
    expect(fed.snacks).toBe(85);
    expect(fed.hearts).toBe(11);
    expect(fed.mood).toBe("eating");
    expect(getMoodAscii(fed.mood)).toContain("🍬");
  });

  it("caps snacks and hype at 100", () => {
    const nearMax: TamagotchiState = {
      hype: 98,
      vibe: 95,
      snacks: 95,
      hearts: 20,
      mood: "vibing",
    };
    const fed = feedMascot(nearMax);
    expect(fed.snacks).toBe(100);

    const hyped = boostHype(nearMax);
    expect(hyped.hype).toBe(100);
    expect(hyped.hearts).toBe(22);
    expect(hyped.mood).toBe("dancing");
  });

  it("runs financial vibe check and updates mood to budgetGuru", () => {
    const checked = performVibeCheck(initialState);
    expect(checked.vibe).toBe(98);
    expect(checked.mood).toBe("budgetGuru");
    expect(getMoodAscii(checked.mood)).toContain("💎");
  });
});

describe("District Scenes & Skeuomorphic Ticket Specifications", () => {
  const sampleScenes = [
    { id: "s1", category: "raves", title: "Neon Horizon", vibeScore: 99 },
    { id: "s2", category: "rooftop", title: "Aura Sunset Mixer", vibeScore: 96 },
    { id: "s3", category: "furry", title: "Paws & Prosecco", vibeScore: 98 },
    { id: "s4", category: "brunch", title: "Pastel Matcha Brunch", vibeScore: 95 },
  ];

  it("filters scenes by category accurately", () => {
    const raves = sampleScenes.filter((s) => s.category === "raves");
    expect(raves.length).toBe(1);
    expect(raves[0].title).toBe("Neon Horizon");

    const furry = sampleScenes.filter((s) => s.category === "furry");
    expect(furry.length).toBe(1);
    expect(furry[0].vibeScore).toBeGreaterThanOrEqual(95);
  });

  it("formats skeuomorphic barcode serial numbers correctly", () => {
    const formatBarcode = (id: string) => `#FESTI-${id.slice(-4).toUpperCase()}`;
    expect(formatBarcode("scene_cyber_rave")).toBe("#FESTI-RAVE");
    expect(formatBarcode("scene_furry_social")).toBe("#FESTI-CIAL");
  });
});
