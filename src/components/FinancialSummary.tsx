import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react';
import { Transaction } from './TransactionForm';
import { cn } from '@/lib/utils';

interface FinancialSummaryProps {
  transactions: Transaction[];
}

export const FinancialSummary: React.FC<FinancialSummaryProps> = ({ transactions }) => {
  const summary = useMemo(() => {
    const totalIncome = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const netBalance = totalIncome - totalExpenses;
    
    // Calculate this month's data
    const now = new Date();
    const thisMonth = transactions.filter((t) => {
      const transactionDate = new Date(t.date);
      return (
        transactionDate.getMonth() === now.getMonth() &&
        transactionDate.getFullYear() === now.getFullYear()
      );
    });
    
    const thisMonthIncome = thisMonth
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const thisMonthExpenses = thisMonth
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      totalIncome,
      totalExpenses,
      netBalance,
      thisMonthIncome,
      thisMonthExpenses,
      transactionCount: transactions.length,
    };
  }, [transactions]);

  const summaryCards = [
    {
      title: 'Total Income',
      value: summary.totalIncome,
      icon: TrendingUp,
      color: 'text-finance-income',
      bgColor: 'bg-finance-income/10',
      prefix: '+$',
    },
    {
      title: 'Total Expenses',
      value: summary.totalExpenses,
      icon: TrendingDown,
      color: 'text-finance-expense',
      bgColor: 'bg-finance-expense/10',
      prefix: '-$',
    },
    {
      title: 'Net Balance',
      value: summary.netBalance,
      icon: DollarSign,
      color: summary.netBalance >= 0 ? 'text-finance-income' : 'text-finance-expense',
      bgColor: summary.netBalance >= 0 ? 'bg-finance-income/10' : 'bg-finance-expense/10',
      prefix: summary.netBalance >= 0 ? '+$' : '-$',
      showAbsolute: true,
    },
    {
      title: 'Transactions',
      value: summary.transactionCount,
      icon: Activity,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      prefix: '',
      suffix: ' total',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {summaryCards.map((card, index) => (
        <Card
          key={index}
          className="finance-gradient-card finance-shadow-soft border-0 finance-transition hover:finance-shadow-medium"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <div className={cn('p-2 rounded-full', card.bgColor)}>
              <card.icon className={cn('h-4 w-4', card.color)} />
            </div>
          </CardHeader>
          <CardContent>
            <div className={cn('text-2xl font-bold', card.color)}>
              {card.prefix}
              {card.showAbsolute ? Math.abs(card.value).toFixed(2) : card.value}
              {card.suffix}
            </div>
            {(card.title === 'Total Income' || card.title === 'Total Expenses') && (
              <p className="text-xs text-muted-foreground mt-1">
                This month: $
                {card.title === 'Total Income' 
                  ? summary.thisMonthIncome.toFixed(2)
                  : summary.thisMonthExpenses.toFixed(2)
                }
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};