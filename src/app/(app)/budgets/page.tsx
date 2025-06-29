"use client";

import AppHeader from "@/components/layout/header";
import { AddBudgetDialog } from "@/components/budgets/add-budget-dialog";
import { BudgetCard } from "@/components/budgets/budget-card";
import { useAppContext } from "@/context/app-context";
import { useMemo } from "react";
import type { Transaction } from "@/lib/types";

export default function BudgetsPage() {
  const { state } = useAppContext();

  const spentAmounts = useMemo(() => {
    return state.transactions.reduce((acc, t: Transaction) => {
      if (t.type === 'expense') {
        if (!acc[t.category.name]) {
          acc[t.category.name] = 0;
        }
        acc[t.category.name] += t.amount;
      }
      return acc;
    }, {} as Record<string, number>);
  }, [state.transactions]);

  return (
    <>
      <AppHeader title="Budgets">
        <AddBudgetDialog />
      </AppHeader>
      <div className="flex-1 p-6 overflow-y-auto">
        {state.budgets.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {state.budgets.map(budget => (
              <BudgetCard
                key={budget.id}
                budget={budget}
                spent={spentAmounts[budget.categoryName] || 0}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center border-2 border-dashed rounded-lg bg-muted/50">
            <h2 className="text-xl font-semibold">No Budgets Set</h2>
            <p className="text-muted-foreground">Click "Add Budget" to get started.</p>
          </div>
        )}
      </div>
    </>
  );
}
