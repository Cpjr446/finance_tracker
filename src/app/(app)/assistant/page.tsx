"use client";

import { useState } from "react";
import AppHeader from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppContext } from "@/context/app-context";
import { getFinancialAdvice, type FinancialAdviceOutput, type FinancialAdviceInput } from "@/ai/flows/financial-assistant";
import { AlertTriangle, BadgeCheck, Bot, Lightbulb, Loader2, TrendingUp } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


export default function AssistantPage() {
    const { state } = useAppContext();
    const [advice, setAdvice] = useState<FinancialAdviceOutput | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGetAdvice = async () => {
        setIsLoading(true);
        setError(null);
        setAdvice(null);
        try {
            const processedInput: FinancialAdviceInput = {
                transactions: state.transactions.map(t => ({
                    id: t.id,
                    type: t.type,
                    amount: t.amount,
                    date: t.date.toISOString(),
                    description: t.description,
                    category: {
                        name: t.category.name,
                        type: t.category.type,
                    }
                })),
                budgets: state.budgets,
                annualSalary: state.annualSalary,
                currentDate: new Date().toISOString()
            };
            const result = await getFinancialAdvice(processedInput);
            setAdvice(result);
        } catch (e) {
            console.error(e);
            setError("Sorry, I couldn't generate financial advice right now. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <AppHeader title="AI Financial Assistant" />
            <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                <Card className="text-center">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                           <Bot className="w-8 h-8"/> Meet Verde, your AI Assistant
                        </CardTitle>
                        <CardDescription>
                           Get personalized financial insights and recommendations based on your recent activity.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={handleGetAdvice} disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Analyzing...
                                </>
                            ) : (
                                "Get My Financial Advice"
                            )}
                        </Button>
                    </CardContent>
                </Card>

                {error && (
                    <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {advice && (
                    <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BadgeCheck className="text-green-500"/> Smart Alerts
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-3 list-disc list-inside">
                                    {advice.smartAlerts.map((item, index) => <li key={index}>{item}</li>)}
                                </ul>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Lightbulb className="text-yellow-500"/> Expense Recommendations
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-3 list-disc list-inside">
                                    {advice.expenseRecommendations.map((item, index) => <li key={index}>{item}</li>)}
                                </ul>
                            </CardContent>
                        </Card>
                        <Card>
                             <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                     <TrendingUp className="text-blue-500"/> Investment Suggestions
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-3 list-disc list-inside">
                                    {advice.investmentSuggestions.map((item, index) => <li key={index}>{item}</li>)}
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </>
    );
}
