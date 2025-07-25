-- TechBookStore Sample Data
-- This file provides initial data for the TechBookStore application
-- Works alongside DataInitializer.java

-- Publishers
INSERT INTO publishers (id, name, address, contact, email, phone) VALUES 
(1, '技術評論社', '東京都新宿区新宿1-1-1', '技術評論社編集部', 'contact@gihyo.co.jp', '03-1234-5678'),
(2, 'オライリー・ジャパン', '東京都渋谷区渋谷2-2-2', 'オライリー編集部', 'info@oreilly.co.jp', '03-2345-6789'),
(3, '翔泳社', '東京都新宿区四谷1-6-2', '翔泳社編集部', 'contact@shoeisha.co.jp', '03-3456-7890'),
(4, 'インプレス', '東京都千代田区神田錦町3-1', 'インプレス編集部', 'info@impress.co.jp', '03-4567-8901');

-- Authors  
INSERT INTO authors (id, name, name_kana, profile) VALUES
(1, '山田太郎', 'ヤマダタロウ', 'Java専門のソフトウェアエンジニア。10年以上の開発経験を持つ。'),
(2, '佐藤花子', 'サトウハナコ', 'フロントエンド開発のエキスパート。React/Vue.jsの著書多数。'),
(3, '田中一郎', 'タナカイチロウ', 'DevOps エンジニア。クラウドインフラの設計・運用を専門とする。'),
(4, '鈴木美咲', 'スズキミサキ', 'データサイエンティスト。機械学習・AI分野での実務経験豊富。');

-- Tech Categories
INSERT INTO tech_categories (id, category_name, category_code, category_level, display_order, parent_id) VALUES
(1, 'プログラミング言語', 'PROGRAMMING', 1, 1, NULL),
(2, 'Web開発', 'WEB_DEV', 1, 2, NULL),
(3, 'データベース', 'DATABASE', 1, 3, NULL),
(4, 'クラウド・インフラ', 'CLOUD_INFRA', 1, 4, NULL),
(5, 'Java', 'JAVA', 2, 1, 1),
(6, 'Python', 'PYTHON', 2, 2, 1),
(7, 'JavaScript', 'JAVASCRIPT', 2, 3, 1),
(8, 'React', 'REACT', 2, 1, 2),
(9, 'Spring', 'SPRING', 2, 2, 2),
(10, 'MySQL', 'MYSQL', 2, 1, 3);

-- Books (Only if DataInitializer hasn't run)
INSERT INTO books (id, isbn13, title, title_en, publisher_id, publication_date, edition, list_price, selling_price, pages, level, version_info, sample_code_url) 
SELECT * FROM (VALUES
(1, '9784774187123', 'Javaプログラミング入門', 'Java Programming Introduction', 1, '2023-01-15', 1, 3200.00, 2880.00, 420, 'BEGINNER', NULL, NULL),
(2, '9784873119465', 'Spring Boot実践ガイド', 'Spring Boot Practical Guide', 2, '2023-03-10', 2, 4500.00, 4050.00, 580, 'INTERMEDIATE', NULL, NULL),
(3, '9784798167312', 'React開発現場のテクニック', 'React Development Techniques', 1, '2023-02-20', 1, 3800.00, 3420.00, 350, 'ADVANCED', NULL, NULL),
(4, '9784295013495', 'Python機械学習プログラミング', 'Python Machine Learning Programming', 3, '2023-04-01', 3, 4200.00, 3780.00, 520, 'ADVANCED', '第3版', 'https://github.com/example/python-ml'),
(5, '9784822295301', 'AWSクラウド設計・構築ガイド', 'AWS Cloud Design & Build Guide', 4, '2023-05-15', 1, 3600.00, 3240.00, 480, 'INTERMEDIATE', NULL, NULL)
) AS new_books(id, isbn13, title, title_en, publisher_id, publication_date, edition, list_price, selling_price, pages, level, version_info, sample_code_url)
WHERE NOT EXISTS (SELECT 1 FROM books);

-- Book Authors (Only if books exist)
INSERT INTO book_authors (book_id, author_id, author_type, display_order)
SELECT * FROM (VALUES
(1, 1, 'MAIN', 1),
(2, 1, 'MAIN', 1),
(3, 2, 'MAIN', 1),
(4, 4, 'MAIN', 1),
(5, 3, 'MAIN', 1)
) AS new_book_authors(book_id, author_id, author_type, display_order)
WHERE EXISTS (SELECT 1 FROM books WHERE id = new_book_authors.book_id);

-- Book Categories (Only if books exist)
INSERT INTO book_categories (book_id, category_id, is_primary)
SELECT * FROM (VALUES
(1, 5, true),   -- Java book -> Java category
(1, 1, false),  -- Java book -> Programming category
(2, 9, true),   -- Spring book -> Spring category
(2, 5, false),  -- Spring book -> Java category
(3, 8, true),   -- React book -> React category
(3, 7, false),  -- React book -> JavaScript category
(4, 6, true),   -- Python book -> Python category
(4, 1, false),  -- Python book -> Programming category
(5, 4, true)    -- AWS book -> Cloud category
) AS new_book_categories(book_id, category_id, is_primary)
WHERE EXISTS (SELECT 1 FROM books WHERE id = new_book_categories.book_id);

-- Inventory (Only if books exist and no inventory exists)
INSERT INTO inventory (id, book_id, store_stock, warehouse_stock, reserved_count, location_code, reorder_point, reorder_quantity, last_received_date, last_sold_date)
SELECT * FROM (VALUES
(1, 1, 25, 100, 0, 'A-001', 5, 20, '2025-07-15', NULL),
(2, 2, 15, 80, 0, 'A-002', 3, 15, '2025-07-20', NULL),
(3, 3, 30, 60, 0, 'B-001', 8, 25, '2025-07-22', NULL),
(4, 4, 12, 45, 0, 'C-001', 5, 20, '2025-07-18', NULL),
(5, 5, 8, 32, 0, 'C-002', 3, 15, '2025-07-23', NULL)
) AS new_inventory(id, book_id, store_stock, warehouse_stock, reserved_count, location_code, reorder_point, reorder_quantity, last_received_date, last_sold_date)
WHERE EXISTS (SELECT 1 FROM books WHERE id = new_inventory.book_id)
AND NOT EXISTS (SELECT 1 FROM inventory WHERE book_id = new_inventory.book_id);

-- Customers (Initial test data)
INSERT INTO customers (id, customer_type, name, name_kana, email, phone, birth_date, gender, occupation, company_name, department, postal_code, address, status, notes, created_at, updated_at)
SELECT * FROM (VALUES
(1, 'INDIVIDUAL', '山田太郎', 'ヤマダタロウ', 'yamada.taro@example.com', '090-1234-5678', '1985-03-15', 'MALE', 'ソフトウェアエンジニア', '株式会社テックラボ', '開発部', '150-0002', '東京都渋谷区渋谷1-1-1', 'ACTIVE', 'Java開発者として5年の経験', '2025-07-01 10:00:00', '2025-07-01 10:00:00'),
(2, 'CORPORATE', '株式会社ソフトウェア開発', 'カブシキガイシャソフトウェアカイハツ', 'procurement@softdev.co.jp', '03-1234-5678', NULL, NULL, NULL, '株式会社ソフトウェア開発', '調達部', '100-0001', '東京都千代田区千代田1-1-1', 'ACTIVE', '技術書籍の一括購入担当', '2025-07-02 14:30:00', '2025-07-02 14:30:00'),
(3, 'INDIVIDUAL', '佐藤花子', 'サトウハナコ', 'sato.hanako@example.com', '080-9876-5432', '1990-08-22', 'FEMALE', 'データサイエンティスト', 'データアナリティクス株式会社', 'AI研究部', '107-0052', '東京都港区赤坂2-2-2', 'ACTIVE', 'Python・機械学習専門', '2025-07-03 09:15:00', '2025-07-03 09:15:00')
) AS new_customers(id, customer_type, name, name_kana, email, phone, birth_date, gender, occupation, company_name, department, postal_code, address, status, notes, created_at, updated_at)
WHERE NOT EXISTS (SELECT 1 FROM customers WHERE email = new_customers.email);

-- Orders (Only if books exist and no orders exist)
INSERT INTO orders (id, order_number, customer_id, status, type, payment_method, total_amount, order_date, confirmed_date, shipped_date, delivered_date, notes, created_at, updated_at)
SELECT * FROM (VALUES
(1, 'ORD-20250125-0001', 1, 'DELIVERED', 'ONLINE', 'CREDIT_CARD', 9810.00, '2025-07-22 07:16:34', '2025-07-23 07:16:34', '2025-07-24 07:16:34', '2025-07-25 07:16:34', '初回購入特典適用', '2025-07-25 07:16:34', '2025-07-25 07:16:34'),
(2, 'ORD-20250125-0002', NULL, 'PENDING', 'WALK_IN', 'CASH', 3420.00, '2025-07-25 01:16:34', NULL, NULL, NULL, '店頭での現金購入', '2025-07-25 07:16:34', '2025-07-25 07:16:34'),
(3, 'ORD-20250125-0003', 2, 'CONFIRMED', 'PHONE', 'BANK_TRANSFER', 33390.00, '2025-07-25 05:16:35', '2025-07-25 06:16:35', NULL, NULL, '法人での一括購入', '2025-07-25 07:16:35', '2025-07-25 07:16:35'),
(4, 'ORD-20250125-0004', 3, 'PICKING', 'ONLINE', 'CREDIT_CARD', 7020.00, '2025-07-25 08:30:00', '2025-07-25 09:00:00', NULL, NULL, 'データサイエンス関連書籍', '2025-07-25 08:30:00', '2025-07-25 09:00:00')
) AS new_orders(id, order_number, customer_id, status, type, payment_method, total_amount, order_date, confirmed_date, shipped_date, delivered_date, notes, created_at, updated_at)
WHERE EXISTS (SELECT 1 FROM books LIMIT 1)
AND NOT EXISTS (SELECT 1 FROM orders WHERE order_number = new_orders.order_number);

-- Order Items (Only if orders exist)
INSERT INTO order_items (id, order_id, book_id, quantity, unit_price, total_price)
SELECT * FROM (VALUES
(1, 1, 1, 2, 2880.00, 5760.00),   -- Order 1: Java book x2
(2, 1, 2, 1, 4050.00, 4050.00),   -- Order 1: Spring book x1
(3, 2, 3, 1, 3420.00, 3420.00),   -- Order 2: React book x1
(4, 3, 1, 5, 2880.00, 14400.00),  -- Order 3: Java book x5
(5, 3, 2, 3, 4050.00, 12150.00),  -- Order 3: Spring book x3
(6, 3, 3, 2, 3420.00, 6840.00),   -- Order 3: React book x2
(7, 4, 4, 1, 3780.00, 3780.00),   -- Order 4: Python ML book x1
(8, 4, 5, 1, 3240.00, 3240.00)    -- Order 4: AWS book x1
) AS new_order_items(id, order_id, book_id, quantity, unit_price, total_price)
WHERE EXISTS (SELECT 1 FROM orders WHERE id = new_order_items.order_id)
AND EXISTS (SELECT 1 FROM books WHERE id = new_order_items.book_id);
