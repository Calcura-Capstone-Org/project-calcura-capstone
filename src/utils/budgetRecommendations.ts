export interface BudgetLineItem {
  name: string;
  amount: number;
}

export interface RecommendedExpenseItem extends BudgetLineItem {
  recommendedAmount: number;
  delta: number;
}

export interface BudgetRecommendationResult {
  incomeMonthly: number;
  currentExpensesMonthly: number;
  debtBalanceTotal: number;
  monthlyDebtTarget: number;
  recommendedExpensesMonthly: number;
  remainingAfterPlan: number;
  shortfallMonthly: number;
  canPayoffIn12Months: boolean;
  recommendedExpenses: RecommendedExpenseItem[];
  message: string;
}

const roundToCents = (value: number): number => Math.round(value * 100) / 100;

const normalizeMoney = (value: number): number => {
  if (!Number.isFinite(value) || value < 0) {
    return 0;
  }
  return roundToCents(value);
};

const reconcileToTarget = (items: number[], target: number): number[] => {
  const rounded = items.map((value) => roundToCents(value));
  let currentTotal = roundToCents(rounded.reduce((sum, value) => sum + value, 0));
  const expectedTotal = roundToCents(target);

  if (Math.abs(currentTotal - expectedTotal) < 0.01 || rounded.length === 0) {
    return rounded;
  }

  const sortable = rounded
    .map((value, index) => ({ value, index }))
    .sort((a, b) => b.value - a.value);

  let differenceInCents = Math.round((expectedTotal - currentTotal) * 100);
  let pointer = 0;

  while (differenceInCents !== 0 && sortable.length > 0) {
    const entry = sortable[pointer % sortable.length];
    const direction = differenceInCents > 0 ? 1 : -1;
    const candidate = roundToCents(rounded[entry.index] + direction * 0.01);

    if (candidate >= 0) {
      rounded[entry.index] = candidate;
      differenceInCents -= direction;
      currentTotal = roundToCents(rounded.reduce((sum, value) => sum + value, 0));

      if (Math.abs(currentTotal - expectedTotal) < 0.01) {
        break;
      }
    }

    pointer += 1;
    if (pointer > 10000) {
      break;
    }
  }

  return rounded;
};

export function calculateBudgetRecommendation(
  incomeInput: number,
  expenseItems: BudgetLineItem[],
  debtItems: BudgetLineItem[]
): BudgetRecommendationResult {
  const incomeMonthly = normalizeMoney(incomeInput);
  const normalizedExpenses = expenseItems
    .map((item) => ({
      name: item.name,
      amount: normalizeMoney(item.amount),
    }))
    .filter((item) => item.amount > 0);

  const normalizedDebts = debtItems
    .map((item) => ({
      name: item.name,
      amount: normalizeMoney(item.amount),
    }))
    .filter((item) => item.amount > 0);

  const currentExpensesMonthly = roundToCents(
    normalizedExpenses.reduce((sum, item) => sum + item.amount, 0)
  );
  const debtBalanceTotal = roundToCents(
    normalizedDebts.reduce((sum, item) => sum + item.amount, 0)
  );
  const monthlyDebtTarget = roundToCents(debtBalanceTotal / 12);
  const availableForExpenses = roundToCents(incomeMonthly - monthlyDebtTarget);

  if (normalizedExpenses.length === 0) {
    const shortfallMonthly = Math.max(0, roundToCents(monthlyDebtTarget - incomeMonthly));
    const remainingAfterPlan = roundToCents(incomeMonthly - monthlyDebtTarget);

    return {
      incomeMonthly,
      currentExpensesMonthly,
      debtBalanceTotal,
      monthlyDebtTarget,
      recommendedExpensesMonthly: 0,
      remainingAfterPlan,
      shortfallMonthly,
      canPayoffIn12Months: shortfallMonthly === 0,
      recommendedExpenses: [],
      message: shortfallMonthly > 0
        ? "Income does not fully cover the debt payoff target. Increase income or extend payoff timeline."
        : "No expense entries found. Put remaining funds toward debt payoff each month.",
    };
  }

  const requiredExpenseReduction = Math.max(0, roundToCents(currentExpensesMonthly - availableForExpenses));
  const reductionRatio = currentExpensesMonthly > 0
    ? Math.min(requiredExpenseReduction / currentExpensesMonthly, 1)
    : 0;

  const unroundedRecommendations = normalizedExpenses.map((item) => {
    const reducedAmount = item.amount * (1 - reductionRatio);
    return Math.max(0, reducedAmount);
  });

  const recommendedTarget = roundToCents(
    Math.max(0, currentExpensesMonthly - requiredExpenseReduction)
  );
  const reconciledRecommendations = reconcileToTarget(unroundedRecommendations, recommendedTarget);

  const recommendedExpenses: RecommendedExpenseItem[] = normalizedExpenses.map((item, index) => {
    const recommendedAmount = reconciledRecommendations[index];
    return {
      name: item.name,
      amount: item.amount,
      recommendedAmount,
      delta: roundToCents(recommendedAmount - item.amount),
    };
  });

  const recommendedExpensesMonthly = roundToCents(
    recommendedExpenses.reduce((sum, item) => sum + item.recommendedAmount, 0)
  );

  const totalPlannedOutflow = roundToCents(recommendedExpensesMonthly + monthlyDebtTarget);
  const shortfallMonthly = Math.max(0, roundToCents(totalPlannedOutflow - incomeMonthly));
  const remainingAfterPlan = roundToCents(incomeMonthly - totalPlannedOutflow);
  const canPayoffIn12Months = shortfallMonthly === 0;

  let message = "Recommended budget is aligned for a 12-month debt payoff timeline.";
  if (debtBalanceTotal === 0) {
    message = "No outstanding debt found in this template. Keep current expenses or redirect surplus to savings.";
  } else if (!canPayoffIn12Months) {
    message = "Debt payoff target is not feasible within 12 months at current income and expenses.";
  }

  return {
    incomeMonthly,
    currentExpensesMonthly,
    debtBalanceTotal,
    monthlyDebtTarget,
    recommendedExpensesMonthly,
    remainingAfterPlan,
    shortfallMonthly,
    canPayoffIn12Months,
    recommendedExpenses,
    message,
  };
}
