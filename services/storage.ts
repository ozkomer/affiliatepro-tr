'use client'

import { useState, useEffect } from 'react';
import { Product, CuratedList, Category, INITIAL_PRODUCTS, INITIAL_LISTS, INITIAL_CATEGORIES } from '@/types';

export const useStore = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [lists, setLists] = useState<CuratedList[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from local storage on mount
  // Keys updated to v6 to force update new products (headphones)
  useEffect(() => {
    const loadedProducts = localStorage.getItem('aff_products_v6');
    const loadedLists = localStorage.getItem('aff_lists_v6');
    const loadedCategories = localStorage.getItem('aff_categories_v6');

    if (loadedProducts) {
      setProducts(JSON.parse(loadedProducts));
    } else {
      setProducts(INITIAL_PRODUCTS);
      localStorage.setItem('aff_products_v6', JSON.stringify(INITIAL_PRODUCTS));
    }

    if (loadedLists) {
      setLists(JSON.parse(loadedLists));
    } else {
      setLists(INITIAL_LISTS);
      localStorage.setItem('aff_lists_v6', JSON.stringify(INITIAL_LISTS));
    }

    if (loadedCategories) {
      setCategories(JSON.parse(loadedCategories));
    } else {
      setCategories(INITIAL_CATEGORIES);
      localStorage.setItem('aff_categories_v6', JSON.stringify(INITIAL_CATEGORIES));
    }

    setIsLoaded(true);
  }, []);

  // Sync helpers
  const saveProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
    localStorage.setItem('aff_products_v6', JSON.stringify(newProducts));
  };

  const saveLists = (newLists: CuratedList[]) => {
    setLists(newLists);
    localStorage.setItem('aff_lists_v6', JSON.stringify(newLists));
  };

  const saveCategories = (newCategories: Category[]) => {
    setCategories(newCategories);
    localStorage.setItem('aff_categories_v6', JSON.stringify(newCategories));
  };

  // Product Actions
  const addProduct = (product: Product) => {
    saveProducts([product, ...products]);
  };

  const updateProduct = (id: string, updatedProduct: Product) => {
    const newProducts = products.map(p => p.id === id ? updatedProduct : p);
    saveProducts(newProducts);
  };

  const deleteProduct = (id: string) => {
    saveProducts(products.filter(p => p.id !== id));
    // Also remove from lists
    const updatedLists = lists.map(list => ({
      ...list,
      productIds: list.productIds.filter(pid => pid !== id)
    }));
    saveLists(updatedLists);
  };

  // List Actions
  const addList = (list: CuratedList) => {
    saveLists([list, ...lists]);
  };

  const updateList = (id: string, updatedList: CuratedList) => {
    const newLists = lists.map(l => l.id === id ? updatedList : l);
    saveLists(newLists);
  };

  const deleteList = (id: string) => {
    saveLists(lists.filter(l => l.id !== id));
  };

  // Category Actions
  const addCategory = (category: Category) => {
    saveCategories([...categories, category]);
  };

  const updateCategory = (id: string, updatedCategory: Category) => {
    const newCategories = categories.map(c => c.id === id ? updatedCategory : c);
    saveCategories(newCategories);
  };

  const deleteCategory = (id: string) => {
    saveCategories(categories.filter(c => c.id !== id));
  };

  return {
    products,
    lists,
    categories,
    addProduct,
    updateProduct,
    deleteProduct,
    addList,
    updateList,
    deleteList,
    addCategory,
    updateCategory,
    deleteCategory,
    isLoaded
  };
};