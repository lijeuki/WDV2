/**
 * Payments Management Component
 * Handle payment processing, history, and outstanding balances
 */

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  CreditCard,
  DollarSign,
  Receipt,
  Printer,
  Mail,
  CheckCircle2,
  AlertCircle,
  Clock,
  TrendingUp,
  Calendar,
  Download,
  Phone
} from 'lucide-react';

interface Payment {
  id: string;
  patientId: string;
  patientName: string;
  amount: number;
  paymentMethod: 'cash' | 'card' | 'transfer' | 'insurance';
  paymentDate: string;
  paymentTime: string;
  status: 'completed' | 'pending' | 'refunded' | 'failed';
  invoiceNumber: string;
  description: string;
  receiptUrl?: string;
}

interface OutstandingBalance {
  patientId: string;
  patientName: string;
  patientPhone: string;
  totalOwed: number;
  lastPayment?: string;
  daysOverdue: number;
  invoices: {
    id: string;
    date: string;
    amount: number;
    paid: number;
    balance: number;
  }[];
}

// Mock data
const mockTodayPayments: Payment[] = [
  {
    id: 'pay-1',
    patientId: 'patient-1',
    patientName: 'Ahmad Rizki',
    amount: 500000,
    paymentMethod: 'card',
    paymentDate: '2025-10-24',
    paymentTime: '09:30',
    status: 'completed',
    invoiceNumber: 'INV-2025-001',
    description: 'Cleaning and checkup'
  },
  {
    id: 'pay-2',
    patientId: 'patient-2',
    patientName: 'Siti Nurhaliza',
    amount: 1200000,
    paymentMethod: 'cash',
    paymentDate: '2025-10-24',
    paymentTime: '11:15',
    status: 'completed',
    invoiceNumber: 'INV-2025-002',
    description: 'Filling - 2 surfaces'
  }
];

const mockOutstandingBalances: OutstandingBalance[] = [
  {
    patientId: 'patient-3',
    patientName: 'Budi Santoso',
    patientPhone: '0821-1111-2222',
    totalOwed: 4500000,
    lastPayment: '2025-09-15',
    daysOverdue: 15,
    invoices: [
      { id: 'INV-2025-045', date: '2025-09-01', amount: 5000000, paid: 500000, balance: 4500000 }
    ]
  },
  {
    patientId: 'patient-4',
    patientName: 'Dewi Lestari',
    patientPhone: '0822-3333-4444',
    totalOwed: 2800000,
    lastPayment: '2025-10-01',
    daysOverdue: 0,
    invoices: [
      { id: 'INV-2025-078', date: '2025-10-01', amount: 3000000, paid: 200000, balance: 2800000 }
    ]
  }
];

export default function Payments() {
  const [showNewPayment, setShowNewPayment] = useState(false);
  const [payments] = useState<Payment[]>(mockTodayPayments);
  const [outstandingBalances] = useState<OutstandingBalance[]>(mockOutstandingBalances);

  // New payment form state
  const [newPayment, setNewPayment] = useState({
    patientName: '',
    amount: '',
    paymentMethod: 'cash' as const,
    description: ''
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatTime = (time: string) => {
    return time;
  };

  const todayTotal = payments.reduce((sum, p) => sum + p.amount, 0);
  const totalOutstanding = outstandingBalances.reduce((sum, b) => sum + b.totalOwed, 0);

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'cash':
        return <DollarSign className="size-4" />;
      case 'card':
        return <CreditCard className="size-4" />;
      case 'transfer':
        return <TrendingUp className="size-4" />;
      case 'insurance':
        return <Receipt className="size-4" />;
      default:
        return <DollarSign className="size-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      refunded: 'bg-gray-100 text-gray-800',
      failed: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const handleProcessPayment = () => {
    // In real app, process payment through payment gateway
    console.log('Processing payment:', newPayment);
    
    // Reset form
    setNewPayment({
      patientName: '',
      amount: '',
      paymentMethod: 'cash',
      description: ''
    });
    setShowNewPayment(false);
    
    alert('✅ Payment processed successfully!');
  };

  const handlePrintReceipt = (payment: Payment) => {
    console.log('Printing receipt:', payment);
    window.print();
  };

  const handleEmailReceipt = (payment: Payment) => {
    console.log('Emailing receipt:', payment);
    alert(`📧 Receipt sent to patient`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Payments</h1>
            <p className="text-gray-600">Process payments and manage outstanding balances</p>
          </div>
          <Button onClick={() => setShowNewPayment(true)}>
            <CreditCard className="size-4 mr-2" />
            New Payment
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="size-5 text-green-600" />
              </div>
              <span className="text-sm text-gray-600">Today's Payments</span>
            </div>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(todayTotal)}</p>
            <p className="text-sm text-gray-500 mt-1">{payments.length} transactions</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="size-5 text-red-600" />
              </div>
              <span className="text-sm text-gray-600">Outstanding</span>
            </div>
            <p className="text-2xl font-bold text-red-600">{formatCurrency(totalOutstanding)}</p>
            <p className="text-sm text-gray-500 mt-1">{outstandingBalances.length} patients</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Clock className="size-5 text-blue-600" />
              </div>
              <span className="text-sm text-gray-600">Pending</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">{formatCurrency(0)}</p>
            <p className="text-sm text-gray-500 mt-1">0 pending</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="size-5 text-purple-600" />
              </div>
              <span className="text-sm text-gray-600">This Month</span>
            </div>
            <p className="text-2xl font-bold text-purple-600">{formatCurrency(45000000)}</p>
            <p className="text-sm text-gray-500 mt-1">+18% vs last month</p>
          </Card>
        </div>

        {/* New Payment Form */}
        {showNewPayment && (
          <Card className="p-6 border-blue-500">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Process New Payment</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNewPayment(false)}
              >
                Cancel
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Patient Name</label>
                <Input
                  placeholder="Enter patient name"
                  value={newPayment.patientName}
                  onChange={(e) => setNewPayment({ ...newPayment, patientName: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Amount (IDR)</label>
                <Input
                  type="number"
                  placeholder="0"
                  value={newPayment.amount}
                  onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Payment Method</label>
                <select
                  className="w-full px-3 py-2 border rounded-md"
                  value={newPayment.paymentMethod}
                  onChange={(e) => setNewPayment({ ...newPayment, paymentMethod: e.target.value as any })}
                >
                  <option value="cash">Cash</option>
                  <option value="card">Credit/Debit Card</option>
                  <option value="transfer">Bank Transfer</option>
                  <option value="insurance">Insurance</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <Input
                  placeholder="e.g., Cleaning, Root Canal"
                  value={newPayment.description}
                  onChange={(e) => setNewPayment({ ...newPayment, description: e.target.value })}
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-6">
              <Button variant="outline" onClick={() => setShowNewPayment(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleProcessPayment}
                disabled={!newPayment.patientName || !newPayment.amount}
              >
                <CheckCircle2 className="size-4 mr-2" />
                Process Payment
              </Button>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Payments */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Today's Payments</h2>
                <Button variant="outline" size="sm">
                  <Download className="size-4 mr-2" />
                  Export
                </Button>
              </div>

              {payments.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Receipt className="size-16 mx-auto mb-4 text-gray-300" />
                  <p>No payments recorded today</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {payments.map((payment) => (
                    <div
                      key={payment.id}
                      className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                              payment.paymentMethod === 'cash' ? 'bg-green-100' :
                              payment.paymentMethod === 'card' ? 'bg-blue-100' :
                              'bg-purple-100'
                            }`}>
                              {getPaymentMethodIcon(payment.paymentMethod)}
                            </div>
                            <div>
                              <h3 className="font-semibold">{payment.patientName}</h3>
                              <p className="text-sm text-gray-600">{payment.description}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Clock className="size-3" />
                              {formatTime(payment.paymentTime)}
                            </div>
                            <div className="flex items-center gap-1">
                              <Receipt className="size-3" />
                              {payment.invoiceNumber}
                            </div>
                            <Badge className={getStatusColor(payment.status)}>
                              {payment.status}
                            </Badge>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-xl font-bold text-green-600">
                            {formatCurrency(payment.amount)}
                          </p>
                          <div className="flex gap-2 mt-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handlePrintReceipt(payment)}
                            >
                              <Printer className="size-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEmailReceipt(payment)}
                            >
                              <Mail className="size-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Payment Methods Breakdown */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Payment Methods (Today)</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <DollarSign className="size-5 text-green-600" />
                    <span className="font-medium">Cash</span>
                  </div>
                  <span className="font-semibold">{formatCurrency(1200000)}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CreditCard className="size-5 text-blue-600" />
                    <span className="font-medium">Card</span>
                  </div>
                  <span className="font-semibold">{formatCurrency(500000)}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="size-5 text-purple-600" />
                    <span className="font-medium">Transfer</span>
                  </div>
                  <span className="font-semibold">{formatCurrency(0)}</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Outstanding Balances */}
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Outstanding Balances</h2>

              {outstandingBalances.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle2 className="size-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-sm">All accounts settled!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {outstandingBalances.map((balance) => (
                    <div
                      key={balance.patientId}
                      className={`p-4 rounded-lg border-2 ${
                        balance.daysOverdue > 0
                          ? 'bg-red-50 border-red-200'
                          : 'bg-yellow-50 border-yellow-200'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold">{balance.patientName}</h3>
                          <p className="text-sm text-gray-600">{balance.patientPhone}</p>
                        </div>
                        {balance.daysOverdue > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {balance.daysOverdue}d overdue
                          </Badge>
                        )}
                      </div>

                      <div className="mb-3">
                        <p className="text-lg font-bold text-red-600">
                          {formatCurrency(balance.totalOwed)}
                        </p>
                        <p className="text-xs text-gray-600">
                          Last payment: {balance.lastPayment || 'Never'}
                        </p>
                      </div>

                      <div className="space-y-1 mb-3">
                        {balance.invoices.map((invoice) => (
                          <div key={invoice.id} className="text-xs text-gray-600">
                            {invoice.id} - {formatCurrency(invoice.balance)} owed
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1">
                          <CreditCard className="size-3 mr-1" />
                          Collect
                        </Button>
                        <Button size="sm" variant="outline">
                          <Phone className="size-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="size-4 mr-2" />
                  View Payment History
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="size-4 mr-2" />
                  Generate Report
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Mail className="size-4 mr-2" />
                  Send Payment Reminders
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
