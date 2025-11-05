"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { MenuItem, PreOrder } from "@/lib/types";
import {
  Plus,
  Minus,
  Clock,
  Utensils,
  ShoppingCart,
  Trash2,
  Star,
  Leaf,
  Flame
} from "lucide-react";

interface FoodPreorderProps {
  menu: MenuItem[];
  preOrders: PreOrder[];
  onPreOrderAction: (preOrders: PreOrder[]) => void;
}

export function FoodPreorder({ menu, preOrders, onPreOrderAction }: FoodPreorderProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Get unique categories
  const categories = useMemo(() => {
    const cats = ['all', ...Array.from(new Set(menu.map(item => item.category)))];
    return cats;
  }, [menu]);

  // Filter menu items
  const filteredMenu = useMemo(() => {
    return menu.filter(item => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesSearch = searchQuery === '' ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [menu, selectedCategory, searchQuery]);

  // Calculate totals
  const totals = useMemo(() => {
    const totalItems = preOrders.reduce((sum, order) => sum + order.quantity, 0);
    const totalPrice = preOrders.reduce((sum, order) => {
      const item = menu.find(item => item.id === order.menuItemId);
      return sum + (item ? item.price * order.quantity : 0);
    }, 0);
    return { totalItems, totalPrice };
  }, [preOrders, menu]);

  const getItemQuantity = (itemId: string) => {
    const order = preOrders.find(order => order.menuItemId === itemId);
    return order ? order.quantity : 0;
  };

  const updateItemQuantity = (itemId: string, quantity: number) => {
    const updatedOrders = [...preOrders];
    const existingOrderIndex = updatedOrders.findIndex(order => order.menuItemId === itemId);

    if (quantity === 0) {
      // Remove item
      if (existingOrderIndex !== -1) {
        updatedOrders.splice(existingOrderIndex, 1);
      }
    } else {
      // Add or update item
      if (existingOrderIndex !== -1) {
        updatedOrders[existingOrderIndex].quantity = quantity;
      } else {
        updatedOrders.push({
          menuItemId: itemId,
          quantity,
          specialInstructions: ''
        });
      }
    }

    onPreOrderAction(updatedOrders);
  };

  const updateSpecialInstructions = (itemId: string, instructions: string) => {
    const updatedOrders = preOrders.map(order =>
      order.menuItemId === itemId ? { ...order, specialInstructions: instructions } : order
    );
    onPreOrderAction(updatedOrders);
  };

  const clearAllOrders = () => {
    onPreOrderAction([]);
  };

  const getFeatureIcon = (feature: string) => {
    switch (feature.toLowerCase()) {
      case 'vegetarian': return <Leaf className="h-3 w-3 text-green-600" />;
      case 'spicy': return <Flame className="h-3 w-3 text-red-600" />;
      case 'popular': case 'signature': return <Star className="h-3 w-3 text-yellow-600" />;
      default: return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center truncate gap-2">
          <Utensils className="h-5 w-5" />
          Pre-order Food
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Order your meals in advance to have them ready when you arrive.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">

        {/* Search and Categories */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="search">Search Menu</Label>
            <Input
              id="search"
              placeholder="Search for dishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label>Categories</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {categories.map((category) => (
                <Button
                    type="button"
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="text-xs"
                >
                  {category === 'all' ? 'All Items' : category}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredMenu.map((item) => {
            const quantity = getItemQuantity(item.id);
            const hasOrder = quantity > 0;

            return (
              <div
                key={item.id}
                className={cn(
                  "border rounded-lg p-4 transition-all",
                  hasOrder ? "border-tablein-blue bg-tablein-blue/5" : "border-border"
                )}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-2 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{item.name}</h4>
                      {item.features?.map((feature) => (
                        <div key={feature} className="flex items-center">
                          {getFeatureIcon(feature)}
                        </div>
                      ))}
                    </div>
                    <p className="text-sm justify-between text-muted-foreground mb-2">{item.description}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="font-semibold text-tablein-blue">UZS{item.price.toLocaleString()}</span>
                      {item.preparationTime && (
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {item.preparationTime}min
                        </span>
                      )}
                      {item.features && (
                        <div className="flex-1 gap-3">
                          {item.features.map((feature) => (
                            <Badge key={feature} variant="secondary" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Button type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => updateItemQuantity(item.id, Math.max(0, quantity - 1))}
                      disabled={quantity === 0}
                    >
                      <Minus className="h-4 w-4" />
                    </Button >
                    <span className="w-8 text-center font-medium">{quantity}</span>
                    <Button type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => updateItemQuantity(item.id, quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Special instructions for ordered items */}
                {hasOrder && (
                  <div className="mt-3 pt-3 border-t border-tablein-blue/20">
                    <Label htmlFor={`instructions-${item.id}`} className="text-xs">
                      Special Instructions (optional)
                    </Label>
                    <Textarea
                      id={`instructions-${item.id}`}
                      placeholder="Any special requests for this item..."
                      value={preOrders.find(order => order.menuItemId === item.id)?.specialInstructions || ''}
                      onChange={(e) => updateSpecialInstructions(item.id, e.target.value)}
                      className="mt-1 text-sm"
                      rows={2}
                    />
                  </div>
                )}
              </div>
            );
          })}

          {filteredMenu.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Utensils className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No menu items found</p>
            </div>
          )}
        </div>

        {/* Order Summary */}
        {preOrders.length > 0 && (
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                Order Summary
              </h4>
              <Button variant="ghost" size="sm" onClick={clearAllOrders}>
                <Trash2 className="h-4 w-4 mr-1" />
                Clear All
              </Button>
            </div>

            <div className="space-y-2 mb-4">
              {preOrders.map((order) => {
                const item = menu.find(item => item.id === order.menuItemId);
                if (!item) return null;

                return (
                  <div key={order.menuItemId} className="flex justify-between items-center text-sm">
                    <span>{order.quantity}x {item.name}</span>
                    <span className="font-medium">₩{(item.price * order.quantity).toLocaleString()}</span>
                  </div>
                );
              })}
            </div>

            <Separator />

            <div className="flex justify-between items-center pt-4 font-semibold">
              <span>Total ({totals.totalItems} item{totals.totalItems !== 1 ? 's' : ''})</span>
              <span className="text-tablein-blue">₩{totals.totalPrice.toLocaleString()}</span>
            </div>

            <div className="mt-3 p-3 bg-muted/30 rounded-lg text-xs text-muted-foreground">
              <p>💡 Food will be prepared and ready when you arrive at your table. Total preparation time will be calculated based on your longest dish.</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
