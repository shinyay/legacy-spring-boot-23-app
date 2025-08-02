import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const I18nContext = createContext();

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};

export const I18nProvider = ({ children }) => {
  const [messages, setMessages] = useState({});
  const [locale, setLocale] = useState('ja');
  const [loading, setLoading] = useState(true);

  const loadMessages = async (lang = locale) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/v1/i18n/messages`, {
        headers: {
          'Accept-Language': lang === 'en' ? 'en' : 'ja'
        }
      });
      setMessages(response.data);
      setLocale(lang);
      // Store preference
      localStorage.setItem('preferredLanguage', lang);
    } catch (error) {
      console.error('Failed to load messages:', error);
      // Fallback to hardcoded messages
      setMessages(getDefaultMessages(lang));
    } finally {
      setLoading(false);
    }
  };

  const switchLanguage = async (lang) => {
    await loadMessages(lang);
    // Also call backend to set cookie
    try {
      await axios.get(`/language/switch?lang=${lang}`);
    } catch (error) {
      console.error('Failed to switch language on backend:', error);
    }
  };

  const t = (key, fallback = key) => {
    return messages[key] || fallback;
  };

  useEffect(() => {
    // Load initial language preference
    const savedLang = localStorage.getItem('preferredLanguage') || 'ja';
    loadMessages(savedLang);
  }, []);

  const value = {
    messages,
    locale,
    loading,
    t,
    switchLanguage
  };

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
};

// Fallback messages if API is not available
const getDefaultMessages = (lang) => {
  if (lang === 'en') {
    return {
      'app.title': 'Legacy Application',
      'app.language': 'Language',
      'inventory.title': 'Inventory Management',
      'inventory.book.title': 'Book Title',
      'inventory.available.stock': 'Available Stock',
      'inventory.status': 'Status',
      'inventory.location': 'Location',
      'inventory.actions': 'Actions',
      'inventory.receive': 'Receive',
      'inventory.sell': 'Sell',
      'inventory.status.outofstock': 'Out of Stock',
      'inventory.status.lowstock': 'Low Stock',
      'inventory.status.instock': 'In Stock',
      'customer.basic.info': 'Basic Information',
      'customer.birthdate': 'Birth Date',
      'customer.gender.male': 'Male',
      'customer.gender.female': 'Female',
      'customer.gender.other': 'Other',
      'customer.occupation.info': 'Occupation & Company Information',
      'customer.occupation': 'Occupation',
      'customer.company': 'Company Name',
      'customer.department': 'Department',
      'book.title': 'Title',
      'book.title.english': 'English Title',
      'book.publication.date': 'Publication Date',
      'book.edition': 'Edition',
      'book.list.price': 'List Price',
      'book.selling.price': 'Selling Price',
      'receive.quantity': 'Receive Quantity',
      'receive.location': 'Receive Location',
      'receive.reason': 'Reason & Notes',
      'receive.delivery.note': 'Delivery Note Number',
      'receive.operation.success': 'Operation completed successfully',
      'form.save': 'Save',
      'form.cancel': 'Cancel'
    };
  } else {
    return {
      'app.title': 'レガシーアプリケーション',
      'app.language': '言語',
      'inventory.title': '在庫管理',
      'inventory.book.title': '書籍タイトル',
      'inventory.available.stock': '在庫数',
      'inventory.status': 'ステータス',
      'inventory.location': '場所',
      'inventory.actions': '操作',
      'inventory.receive': '入荷',
      'inventory.sell': '販売',
      'inventory.status.outofstock': '在庫切れ',
      'inventory.status.lowstock': '在庫少',
      'inventory.status.instock': '在庫有',
      'customer.basic.info': '基本情報',
      'customer.birthdate': '生年月日',
      'customer.gender.male': '男性',
      'customer.gender.female': '女性',
      'customer.gender.other': 'その他',
      'customer.occupation.info': '職業・会社情報',
      'customer.occupation': '職業',
      'customer.company': '会社名',
      'customer.department': '部署',
      'book.title': 'タイトル',
      'book.title.english': '英語タイトル',
      'book.publication.date': '発行日',
      'book.edition': '版次',
      'book.list.price': '定価',
      'book.selling.price': '販売価格',
      'receive.quantity': '入荷数量',
      'receive.location': '入荷場所',
      'receive.reason': '入荷理由・備考',
      'receive.delivery.note': '納品書番号',
      'receive.operation.success': '操作が完了しました',
      'form.save': '保存',
      'form.cancel': 'キャンセル'
    };
  }
};