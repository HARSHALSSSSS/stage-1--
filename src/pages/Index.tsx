import React, { useState, useEffect } from 'react';
import { TransactionForm, Transaction } from '@/components/TransactionForm';
import { TransactionList } from '@/components/TransactionList';
import { MonthlyChart } from '@/components/MonthlyChart';
import { FinancialSummary } from '@/components/FinancialSummary';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { PiggyBank, Plus, BarChart3, List, Home } from 'lucide-react';
import heroImage from '@/assets/finance-hero.jpg';

const Index = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>();
  const [activeTab, setActiveTab] = useState('overview');

  // Load transactions from localStorage on component mount
  useEffect(() => {
    const savedTransactions = localStorage.getItem('financeTransactions');
    if (savedTransactions) {
      try {
        const parsed = JSON.parse(savedTransactions);
        // Convert date strings back to Date objects
        const transactionsWithDates = parsed.map((t: any) => ({
          ...t,
          date: new Date(t.date),
        }));
        setTransactions(transactionsWithDates);
      } catch (error) {
        console.error('Error loading transactions:', error);
      }
    }
  }, []);

  // Save transactions to localStorage whenever transactions change
  useEffect(() => {
    localStorage.setItem('financeTransactions', JSON.stringify(transactions));
  }, [transactions]);

  const handleAddTransaction = (transactionData: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transactionData,
      id: Date.now().toString(),
    };
    
    setTransactions((prev) => [...prev, newTransaction]);
    toast({
      title: 'Transaction Added',
      description: `${transactionData.type === 'income' ? 'Income' : 'Expense'} of $${transactionData.amount.toFixed(2)} has been added.`,
    });
  };

  const handleEditTransaction = (transactionData: Omit<Transaction, 'id'>) => {
    if (!editingTransaction) return;
    
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === editingTransaction.id
          ? { ...transactionData, id: editingTransaction.id }
          : t
      )
    );
    
    setEditingTransaction(undefined);
    toast({
      title: 'Transaction Updated',
      description: 'Transaction has been successfully updated.',
    });
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    toast({
      title: 'Transaction Deleted',
      description: 'Transaction has been successfully deleted.',
      variant: 'destructive',
    });
  };

  const startEditingTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setActiveTab('add');
  };

  const cancelEditing = () => {
    setEditingTransaction(undefined);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 finance-gradient-primary opacity-80" />
        </div>
        <div className="relative container mx-auto px-4 py-16 text-center text-white">
          <div className="flex items-center justify-center gap-3 mb-4">
            <PiggyBank className="h-12 w-12" />
            <h1 className="text-4xl md:text-5xl font-bold">Coin Chronicle</h1>
          </div>
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
            Take control of your finances with intelligent tracking and insights
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold">${(transactions.reduce((sum, t) => t.type === 'income' ? sum + t.amount : sum - t.amount, 0)).toFixed(2)}</p>
              <p className="text-sm text-white/80">Net Balance</p>
            </div>
            <div className="w-px bg-white/30 mx-4" />
            <div className="text-center">
              <p className="text-3xl font-bold">{transactions.length}</p>
              <p className="text-sm text-white/80">Transactions</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8 bg-card finance-shadow-soft">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="add" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              {editingTransaction ? 'Edit' : 'Add'}
            </TabsTrigger>
            <TabsTrigger value="transactions" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              Transactions
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            <FinancialSummary transactions={transactions} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <MonthlyChart transactions={transactions} />
              <TransactionList
                transactions={transactions.slice(-5)} // Show only last 5
                onEdit={startEditingTransaction}
                onDelete={handleDeleteTransaction}
              />
            </div>
          </TabsContent>

          <TabsContent value="add" className="max-w-2xl mx-auto">
            <TransactionForm
              onSubmit={editingTransaction ? handleEditTransaction : handleAddTransaction}
              editingTransaction={editingTransaction}
              onCancel={editingTransaction ? cancelEditing : undefined}
            />
          </TabsContent>

          <TabsContent value="transactions">
            <TransactionList
              transactions={transactions}
              onEdit={startEditingTransaction}
              onDelete={handleDeleteTransaction}
            />
          </TabsContent>

          <TabsContent value="analytics">
            <div className="space-y-8">
              <FinancialSummary transactions={transactions} />
              <MonthlyChart transactions={transactions} />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
