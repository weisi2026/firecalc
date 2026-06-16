export interface FIREInput {
  annualIncome: number;        // 年收入
  annualSavings: number;       // 年储蓄额
  currentSavings: number;       // 当前储蓄
  annualReturnRate: number;    // 年化收益率 %
  inflationRate: number;       // 通胀率 %
  withdrawalRate: number;      // 安全提取率 % (默认4%)
  targetAnnualSpending: number; // 退休后年支出
}

export interface FIREResult {
  fireNumber: number;           // FIRE目标金额（需攒多少）
  yearsToFIRE: number;          // 几年能退休
  fireAge: number;              // 几岁能退休（如果输入年龄）
  savingsRate: number;          // 储蓄率 %
  annualBreakdown: AnnualRow[];
}

export interface AnnualRow {
  year: number;
  totalSavings: number;
  annualContributions: number;
  investmentGains: number;
  milestone: string;            // 里程碑标签
}

export function calculateFIRE(input: FIREInput & { currentAge?: number }): FIREResult {
  const {
    annualIncome,
    annualSavings,
    currentSavings,
    annualReturnRate,
    inflationRate,
    withdrawalRate,
    targetAnnualSpending,
    currentAge
  } = input;

  // FIRE Number = 退休年支出 / 安全提取率
  const fireNumber = targetAnnualSpending / (withdrawalRate / 100);
  
  // 储蓄率
  const savingsRate = (annualSavings / annualIncome) * 100;

  // 逐年计算
  const breakdown: AnnualRow[] = [];
  let totalSavings = currentSavings;
  let years = 0;
  const maxYears = 60; // 安全上限

  for (let y = 1; y <= maxYears; y++) {
    const inflationAdjReturn = (1 + annualReturnRate / 100) / (1 + inflationRate / 100) - 1;
    const investmentGains = totalSavings * inflationAdjReturn;
    totalSavings += investmentGains + annualSavings;

    let milestone = '';
    if (totalSavings >= fireNumber && years === 0) {
      years = y;
      milestone = '🎉 FIRE!';
    } else if (totalSavings >= fireNumber * 0.25 && totalSavings < fireNumber * 0.5) {
      milestone = '25% — Quarter Way';
    } else if (totalSavings >= fireNumber * 0.5 && totalSavings < fireNumber * 0.75) {
      milestone = '50% — Halfway!';
    } else if (totalSavings >= fireNumber * 0.75 && totalSavings < fireNumber) {
      milestone = '75% — Almost There!';
    } else if (totalSavings >= fireNumber * 1.5 && totalSavings < fireNumber * 2) {
      milestone = '150% — Fat FIRE';
    } else if (totalSavings >= fireNumber * 2) {
      milestone = '200% — Mega FIRE 🔥';
    }

    breakdown.push({
      year: y,
      totalSavings,
      annualContributions: annualSavings,
      investmentGains,
      milestone
    });

    if (years > 0 && y > years + 5) break; // FIRE后再展示5年
  }

  // 如果60年内都没FIRE
  if (years === 0) years = -1;

  const fireAge = currentAge ? currentAge + years : -1;

  return {
    fireNumber,
    yearsToFIRE: years,
    fireAge,
    savingsRate,
    annualBreakdown: breakdown
  };
}

export function formatCurrency(n: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(n);
}