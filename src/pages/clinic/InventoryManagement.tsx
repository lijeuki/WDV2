import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Package,
  Plus,
  Search,
  AlertTriangle,
  TrendingDown,
  Edit,
  Trash2,
  BarChart3,
  Download,
  Upload,
} from 'lucide-react';

interface InventoryItem {
  id: string;
  name: string;
  category: 'consumable' | 'equipment' | 'medication' | 'instrument';
  sku: string;
  quantity: number;
  unit: string;
  minStock: number;
  maxStock: number;
  reorderPoint: number;
  unitPrice: number;
  supplier: string;
  lastRestocked: string;
  expiryDate?: string;
  location: string;
}

// Mock inventory data
const mockInventory: InventoryItem[] = [
  {
    id: '1',
    name: 'Dental Gloves (Medium)',
    category: 'consumable',
    sku: 'GLV-M-001',
    quantity: 450,
    unit: 'boxes',
    minStock: 100,
    maxStock: 1000,
    reorderPoint: 200,
    unitPrice: 45000,
    supplier: 'MediSupply Co.',
    lastRestocked: '2025-10-15',
    expiryDate: '2026-12-31',
    location: 'Storage Room A',
  },
  {
    id: '2',
    name: 'Face Masks',
    category: 'consumable',
    sku: 'MSK-001',
    quantity: 180,
    unit: 'boxes',
    minStock: 200,
    maxStock: 800,
    reorderPoint: 250,
    unitPrice: 35000,
    supplier: 'MediSupply Co.',
    lastRestocked: '2025-10-10',
    expiryDate: '2027-06-30',
    location: 'Storage Room A',
  },
  {
    id: '3',
    name: 'Composite Resin (A2)',
    category: 'consumable',
    sku: 'CMP-A2-001',
    quantity: 24,
    unit: 'syringes',
    minStock: 10,
    maxStock: 50,
    reorderPoint: 15,
    unitPrice: 285000,
    supplier: 'DentalPro Supplies',
    lastRestocked: '2025-10-20',
    expiryDate: '2026-08-31',
    location: 'Treatment Room 1',
  },
  {
    id: '4',
    name: 'Anesthetic (Lidocaine 2%)',
    category: 'medication',
    sku: 'MED-LID-001',
    quantity: 48,
    unit: 'cartridges',
    minStock: 30,
    maxStock: 100,
    reorderPoint: 40,
    unitPrice: 12000,
    supplier: 'PharmaDent',
    lastRestocked: '2025-10-18',
    expiryDate: '2026-03-31',
    location: 'Refrigerator',
  },
  {
    id: '5',
    name: 'Dental Mirror',
    category: 'instrument',
    sku: 'INS-MIR-001',
    quantity: 35,
    unit: 'pieces',
    minStock: 20,
    maxStock: 50,
    reorderPoint: 25,
    unitPrice: 45000,
    supplier: 'InstruMed',
    lastRestocked: '2025-09-05',
    location: 'Sterilization Room',
  },
  {
    id: '6',
    name: 'High-Speed Handpiece',
    category: 'equipment',
    sku: 'EQP-HSH-001',
    quantity: 4,
    unit: 'units',
    minStock: 3,
    maxStock: 6,
    reorderPoint: 3,
    unitPrice: 8500000,
    supplier: 'DentalTech Inc.',
    lastRestocked: '2025-08-01',
    location: 'Treatment Rooms',
  },
  {
    id: '7',
    name: 'Syringe Needles (27G)',
    category: 'consumable',
    sku: 'NDL-27G-001',
    quantity: 85,
    unit: 'boxes',
    minStock: 50,
    maxStock: 200,
    reorderPoint: 75,
    unitPrice: 95000,
    supplier: 'MediSupply Co.',
    lastRestocked: '2025-10-12',
    expiryDate: '2027-12-31',
    location: 'Storage Room B',
  },
  {
    id: '8',
    name: 'Dental Floss',
    category: 'consumable',
    sku: 'FLS-001',
    quantity: 120,
    unit: 'pieces',
    minStock: 50,
    maxStock: 200,
    reorderPoint: 75,
    unitPrice: 15000,
    supplier: 'OralCare Supplies',
    lastRestocked: '2025-10-22',
    location: 'Reception Area',
  },
];

export default function InventoryManagement() {
  const [inventory, setInventory] = useState<InventoryItem[]>(mockInventory);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const getStockStatus = (item: InventoryItem) => {
    if (item.quantity === 0) return 'out_of_stock';
    if (item.quantity <= item.minStock) return 'critical';
    if (item.quantity <= item.reorderPoint) return 'low';
    return 'normal';
  };

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    
    const status = getStockStatus(item);
    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'low' && (status === 'critical' || status === 'low')) ||
      (filterStatus === 'normal' && status === 'normal') ||
      (filterStatus === 'out' && status === 'out_of_stock');

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const stats = {
    total: inventory.length,
    lowStock: inventory.filter((i) => {
      const status = getStockStatus(i);
      return status === 'low' || status === 'critical';
    }).length,
    outOfStock: inventory.filter((i) => getStockStatus(i) === 'out_of_stock').length,
    totalValue: inventory.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0),
  };

  const getStatusBadge = (item: InventoryItem) => {
    const status = getStockStatus(item);
    switch (status) {
      case 'out_of_stock':
        return <Badge className="bg-red-100 text-red-800">Out of Stock</Badge>;
      case 'critical':
        return <Badge className="bg-orange-100 text-orange-800">Critical</Badge>;
      case 'low':
        return <Badge className="bg-yellow-100 text-yellow-800">Low Stock</Badge>;
      default:
        return <Badge className="bg-green-100 text-green-800">In Stock</Badge>;
    }
  };

  const getCategoryBadge = (category: string) => {
    const colors: Record<string, string> = {
      consumable: 'bg-blue-100 text-blue-800',
      equipment: 'bg-purple-100 text-purple-800',
      medication: 'bg-red-100 text-red-800',
      instrument: 'bg-teal-100 text-teal-800',
    };
    return (
      <Badge className={colors[category] || 'bg-gray-100 text-gray-800'}>
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleAddItem = () => {
    alert('Add inventory item form would open here');
  };

  const handleEditItem = (item: InventoryItem) => {
    alert(`Edit ${item.name} - Form would open here`);
  };

  const handleDeleteItem = (item: InventoryItem) => {
    if (confirm(`Remove ${item.name} from inventory?`)) {
      setInventory(inventory.filter((i) => i.id !== item.id));
    }
  };

  const handleRestock = (item: InventoryItem) => {
    const quantity = prompt(`Enter restock quantity for ${item.name}:`, '50');
    if (quantity) {
      setInventory(
        inventory.map((i) =>
          i.id === item.id
            ? { ...i, quantity: i.quantity + parseInt(quantity), lastRestocked: new Date().toISOString().split('T')[0] }
            : i
        )
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Package className="size-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold">Inventory Management</h1>
              <p className="text-gray-600">Track supplies, equipment, and medications</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline">
              <Upload className="size-4 mr-2" />
              Import
            </Button>
            <Button variant="outline">
              <Download className="size-4 mr-2" />
              Export
            </Button>
            <Button onClick={handleAddItem}>
              <Plus className="size-4 mr-2" />
              Add Item
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Items</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Package className="size-8 text-blue-600" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Low Stock</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.lowStock}</p>
              </div>
              <AlertTriangle className="size-8 text-yellow-600" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Out of Stock</p>
                <p className="text-2xl font-bold text-red-600">{stats.outOfStock}</p>
              </div>
              <TrendingDown className="size-8 text-red-600" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Value</p>
                <p className="text-xl font-bold">{formatCurrency(stats.totalValue)}</p>
              </div>
              <BarChart3 className="size-8 text-green-600" />
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 size-4 text-gray-400" />
              <Input
                placeholder="Search by name or SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="consumable">Consumables</SelectItem>
                <SelectItem value="equipment">Equipment</SelectItem>
                <SelectItem value="medication">Medications</SelectItem>
                <SelectItem value="instrument">Instruments</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="normal">In Stock</SelectItem>
                <SelectItem value="low">Low Stock</SelectItem>
                <SelectItem value="out">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Inventory Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Quantity</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Unit Price</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total Value</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredInventory.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500">{item.supplier}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">{getCategoryBadge(item.category)}</td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm">{item.sku}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div>
                        <p className="font-semibold">{item.quantity} {item.unit}</p>
                        <p className="text-xs text-gray-500">Min: {item.minStock}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">{getStatusBadge(item)}</td>
                    <td className="px-6 py-4 text-right">{formatCurrency(item.unitPrice)}</td>
                    <td className="px-6 py-4 text-right font-semibold">
                      {formatCurrency(item.quantity * item.unitPrice)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleRestock(item)}>
                          <Plus className="size-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleEditItem(item)}>
                          <Edit className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteItem(item)}
                          className="text-red-600"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {filteredInventory.length === 0 && (
          <Card className="p-12 text-center">
            <Package className="size-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No items found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </Card>
        )}
      </div>
    </div>
  );
}
