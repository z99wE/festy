import { describe, it, expect } from "vitest";
import { fromDecimal, toDecimal, addMoney, subtractMoney, calculateBudgetTotals, formatMoney } from "../src/utils/money.ts";

describe("Decimal-safe Money Utilities", () => {
  it("converts decimal dollars to integer cents without floating point drift", () => {
    const m1 = fromDecimal(0.1, "USD");
    const m2 = fromDecimal(0.2, "USD");
    const sum = addMoney(m1, m2);
    expect(sum.cents).toBe(30n);
    expect(toDecimal(sum)).toBe(0.3);
  });

  it("handles high precision and large budgets correctly", () => {
    const large = fromDecimal(4500000.75, "INR");
    expect(large.cents).toBe(450000075n);
    expect(toDecimal(large)).toBe(4500000.75);
  });

  it("subtracts money accurately", () => {
    const target = fromDecimal(10000, "USD");
    const spent = fromDecimal(3450.5, "USD");
    const remaining = subtractMoney(target, spent);
    expect(toDecimal(remaining)).toBe(6549.5);
  });

  it("throws error on currency mismatch", () => {
    const usd = fromDecimal(100, "USD");
    const inr = fromDecimal(100, "INR");
    expect(() => addMoney(usd, inr)).toThrow(/Currency mismatch/);
  });

  it("calculates comprehensive budget totals and variance", () => {
    const items = [
      { likelyEstimate: 5000, committedAmount: 4800, actualAmount: 2000 },
      { likelyEstimate: 3000, quotedAmount: 2900, committedAmount: 2900, actualAmount: 2900 },
      { likelyEstimate: 2000, actualAmount: 0 },
    ];
    const totals = calculateBudgetTotals(10000, "USD", items);
    expect(toDecimal(totals.target)).toBe(10000);
    expect(toDecimal(totals.estimated)).toBe(10000);
    expect(toDecimal(totals.committed)).toBe(7700);
    expect(toDecimal(totals.actual)).toBe(4900);
    expect(toDecimal(totals.remaining)).toBe(2300); // 10000 - 7700
    expect(totals.status).toBe("on_track");
  });

  it("detects when budget is exceeded", () => {
    const items = [{ likelyEstimate: 12000, committedAmount: 11500, actualAmount: 11500 }];
    const totals = calculateBudgetTotals(10000, "USD", items);
    expect(totals.status).toBe("exceeded");
  });

  it("formats currencies cleanly with appropriate symbols", () => {
    const formattedUSD = formatMoney(5200, "USD");
    expect(formattedUSD).toContain("5,200");
  });
});
