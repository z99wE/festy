/**
 * Decimal-safe money arithmetic utilities.
 * Handles financial calculations in minor units (cents/basis points)
 * to avoid binary floating point representation issues (e.g. 0.1 + 0.2 != 0.3).
 */

export interface Money {
  cents: bigint;
  currency: string;
}

/**
 * Converts a decimal representation (number or string) into exact Money object in minor units.
 */
export function fromDecimal(amount: number | string | undefined | null, currency = "USD"): Money {
  if (amount === undefined || amount === null || amount === "") {
    return { cents: 0n, currency };
  }
  const str = typeof amount === "number" ? amount.toFixed(2) : String(amount).trim();
  const [whole, fraction = ""] = str.split(".");
  const cleanWhole = whole.replace(/,/g, "");
  const paddedFraction = (fraction + "00").slice(0, 2);
  const sign = cleanWhole.startsWith("-") ? -1n : 1n;
  const absWhole = cleanWhole.replace(/^-/, "");
  const totalCents = (BigInt(absWhole || "0") * 100n + BigInt(paddedFraction)) * sign;
  return { cents: totalCents, currency };
}

/**
 * Converts a Money struct in minor units back into a standard decimal float.
 */
export function toDecimal(money: Money): number {
  return Number(money.cents) / 100;
}

/**
 * Adds two Money values together, validating currency parity.
 */
export function addMoney(a: Money, b: Money): Money {
  if (a.currency !== b.currency) {
    throw new Error(`Currency mismatch: cannot add ${a.currency} and ${b.currency}`);
  }
  return { cents: a.cents + b.cents, currency: a.currency };
}

export function subtractMoney(a: Money, b: Money): Money {
  if (a.currency !== b.currency) {
    throw new Error(`Currency mismatch: cannot subtract ${a.currency} and ${b.currency}`);
  }
  return { cents: a.cents - b.cents, currency: a.currency };
}

export function formatMoney(amount: number | Money | undefined | null, currency = "USD"): string {
  const num = typeof amount === "object" && amount !== null && "cents" in amount
    ? toDecimal(amount)
    : Number(amount || 0);

  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: typeof amount === "object" && amount !== null ? amount.currency : currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(num);
  } catch {
    return `${currency} ${num.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
  }
}

export interface BudgetTotals {
  target: Money;
  estimated: Money;
  quoted: Money;
  committed: Money;
  actual: Money;
  remaining: Money;
  variance: Money; // target - actual
  status: "under" | "on_track" | "warning" | "exceeded";
}

export function calculateBudgetTotals(
  targetAmount: number | undefined,
  currency: string,
  items: Array<{
    likelyEstimate?: number;
    quotedAmount?: number;
    committedAmount?: number;
    actualAmount?: number;
  }>
): BudgetTotals {
  const target = fromDecimal(targetAmount, currency);
  let estimated = fromDecimal(0, currency);
  let quoted = fromDecimal(0, currency);
  let committed = fromDecimal(0, currency);
  let actual = fromDecimal(0, currency);

  for (const item of items) {
    if (item.likelyEstimate !== undefined) {
      estimated = addMoney(estimated, fromDecimal(item.likelyEstimate, currency));
    }
    if (item.quotedAmount !== undefined) {
      quoted = addMoney(quoted, fromDecimal(item.quotedAmount, currency));
    }
    if (item.committedAmount !== undefined) {
      committed = addMoney(committed, fromDecimal(item.committedAmount, currency));
    }
    if (item.actualAmount !== undefined) {
      actual = addMoney(actual, fromDecimal(item.actualAmount, currency));
    }
  }

  // Remaining budget is target - (committed or actual, whichever is committed/spent)
  // Or if target is 0, based on estimate
  const effectiveCommitted = committed.cents > actual.cents ? committed : actual;
  const remaining = subtractMoney(target, effectiveCommitted);
  const variance = subtractMoney(target, actual);

  let status: BudgetTotals["status"] = "on_track";
  if (target.cents > 0n) {
    if (actual.cents > target.cents || committed.cents > target.cents) {
      status = "exceeded";
    } else if (estimated.cents > target.cents) {
      status = "warning";
    } else {
      status = "on_track";
    }
  }

  return {
    target,
    estimated,
    quoted,
    committed,
    actual,
    remaining,
    variance,
    status,
  };
}
