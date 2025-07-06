import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon, Plus, Edit3 } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: Date;
  type: 'income' | 'expense';
}

interface TransactionFormProps {
  onSubmit: (transaction: Omit<Transaction, 'id'>) => void;
  editingTransaction?: Transaction;
  onCancel?: () => void;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  onSubmit,
  editingTransaction,
  onCancel,
}) => {
  const [amount, setAmount] = useState(editingTransaction?.amount?.toString() || '');
  const [description, setDescription] = useState(editingTransaction?.description || '');
  const [date, setDate] = useState<Date>(editingTransaction?.date || new Date());
  const [type, setType] = useState<'income' | 'expense'>(editingTransaction?.type || 'expense');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount greater than 0';
    }

    if (!description.trim()) {
      newErrors.description = 'Please enter a description';
    }

    if (!date) {
      newErrors.date = 'Please select a date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({
        amount: Number(amount),
        description: description.trim(),
        date,
        type,
      });
      
      // Reset form if not editing
      if (!editingTransaction) {
        setAmount('');
        setDescription('');
        setDate(new Date());
        setType('expense');
      }
    }
  };

  return (
    <Card className="finance-gradient-card finance-shadow-medium border-0">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          {editingTransaction ? (
            <>
              <Edit3 className="h-5 w-5 text-primary" />
              Edit Transaction
            </>
          ) : (
            <>
              <Plus className="h-5 w-5 text-primary" />
              Add New Transaction
            </>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Transaction Type Toggle */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Transaction Type</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={type === 'expense' ? 'default' : 'outline'}
                className={cn(
                  'flex-1 finance-transition',
                  type === 'expense' 
                    ? 'bg-finance-expense hover:bg-finance-expense/90' 
                    : 'hover:bg-finance-expense/10 hover:text-finance-expense hover:border-finance-expense'
                )}
                onClick={() => setType('expense')}
              >
                Expense
              </Button>
              <Button
                type="button"
                variant={type === 'income' ? 'default' : 'outline'}
                className={cn(
                  'flex-1 finance-transition',
                  type === 'income' 
                    ? 'bg-finance-income hover:bg-finance-income/90' 
                    : 'hover:bg-finance-income/10 hover:text-finance-income hover:border-finance-income'
                )}
                onClick={() => setType('income')}
              >
                Income
              </Button>
            </div>
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm font-medium">
              Amount ($)
            </Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={cn(
                'text-lg finance-transition',
                errors.amount && 'border-destructive focus:ring-destructive'
              )}
            />
            {errors.amount && (
              <p className="text-sm text-destructive">{errors.amount}</p>
            )}
          </div>

          {/* Description Input */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>
            <Input
              id="description"
              placeholder="Enter transaction description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={cn(
                'finance-transition',
                errors.description && 'border-destructive focus:ring-destructive'
              )}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description}</p>
            )}
          </div>

          {/* Date Picker */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal finance-transition',
                    !date && 'text-muted-foreground',
                    errors.date && 'border-destructive'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, 'PPP') : 'Pick a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(selectedDate) => selectedDate && setDate(selectedDate)}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            {errors.date && (
              <p className="text-sm text-destructive">{errors.date}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              className="flex-1 finance-gradient-primary border-0 finance-transition finance-shadow-soft hover:finance-shadow-medium"
            >
              {editingTransaction ? 'Update Transaction' : 'Add Transaction'}
            </Button>
            {editingTransaction && onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="flex-1 finance-transition"
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};