# 顧客管理機能 PRD (Product Requirements Document)

## 1. 概要

### 1.1 目的
技術専門書店向け在庫管理システムに顧客管理機能を実装し、顧客情報の管理、購買履歴の追跡、技術スキルマップの生成を可能にする。

### 1.2 背景
現在のシステムでは注文管理で `customerId` を参照しているが、実際の顧客エンティティが存在しない。顧客管理機能を実装することで、よりパーソナライズされたサービスの提供と、顧客の技術的関心に基づいた書籍推薦が可能になる。

### 1.3 スコープ
- **対象範囲**: 顧客情報管理、購買履歴表示、技術スキルマップ生成、顧客検索・フィルタリング
- **対象外**: 顧客向けWebポータル、メールマーケティング機能、ポイントシステム

## 2. 機能要件

### 2.1 顧客エンティティ管理

#### 2.1.1 顧客基本情報
**必須フィールド**:
- 顧客ID (自動採番)
- 顧客タイプ (個人/法人)
- 氏名 (個人) / 会社名 (法人)
- メールアドレス
- 電話番号
- 登録日時

**任意フィールド**:
- フリガナ
- 生年月日
- 性別
- 職業
- 会社名 (個人の場合)
- 部署名
- 郵便番号
- 住所
- 備考

#### 2.1.2 顧客ステータス管理
- **アクティブ**: 通常の顧客
- **非アクティブ**: 一時的に取引停止
- **削除済み**: 論理削除された顧客

### 2.2 購買履歴機能

#### 2.2.1 購買履歴表示
- 顧客の全注文履歴を時系列で表示
- 注文詳細 (書籍、数量、金額) の表示
- 購買頻度・金額の統計情報
- 期間指定での履歴フィルタリング

#### 2.2.2 購買分析
- 月次/年次購買金額の推移
- よく購入するカテゴリの分析
- 技術レベル別購買傾向
- リピート購入率の計算

### 2.3 技術スキルマップ生成

#### 2.3.1 スキル推定ロジック
購買履歴から以下を分析してスキルマップを生成:
- **技術カテゴリ別購買数**: Java, Python, React等
- **技術レベル別購買パターン**: BEGINNER → INTERMEDIATE → ADVANCED
- **購買時期**: 最新の技術トレンドへの対応度
- **購買継続性**: 特定技術への継続的学習意欲

#### 2.3.2 スキルマップ表示
- **レーダーチャート**: 技術分野別スキルレベル
- **技術タイムライン**: 学習の進歩を時系列で表示
- **推奨書籍**: 現在のスキルレベルに基づく次のステップ書籍
- **技術トレンド適合度**: 市場のトレンドとの比較

### 2.4 顧客検索・管理機能

#### 2.4.1 検索機能
- 氏名/会社名での部分一致検索
- メールアドレス、電話番号での完全一致検索
- 顧客タイプ、ステータスでのフィルタリング
- 登録期間での絞り込み
- 購買金額範囲での絞り込み

#### 2.4.2 管理機能
- 顧客情報の新規登録
- 顧客情報の編集・更新
- 顧客ステータスの変更
- 顧客の論理削除
- 購買履歴の閲覧
- 技術スキルマップの表示

## 3. 技術要件

### 3.1 バックエンド実装

#### 3.1.1 エンティティ設計
```java
// Customer エンティティ
@Entity
@Table(name = "customers")
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CustomerType customerType; // INDIVIDUAL, CORPORATE
    
    @Column(nullable = false)
    private String name;
    
    @Column(name = "name_kana")
    private String nameKana;
    
    @Column(nullable = false, unique = true)
    private String email;
    
    @Column(nullable = false)
    private String phone;
    
    // その他フィールド...
}

// CustomerSkillMap エンティティ
@Entity
@Table(name = "customer_skill_maps")
public class CustomerSkillMap {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;
    
    @ManyToOne
    @JoinColumn(name = "tech_category_id")
    private TechCategory techCategory;
    
    @Column(name = "skill_level")
    private Integer skillLevel; // 1-10
    
    @Column(name = "confidence_score")
    private Double confidenceScore; // 0.0-1.0
    
    // その他フィールド...
}
```

#### 3.1.2 API エンドポイント設計
```
GET    /api/v1/customers              - 顧客一覧取得 (ページング、検索対応)
GET    /api/v1/customers/{id}         - 顧客詳細取得
POST   /api/v1/customers              - 顧客新規登録
PUT    /api/v1/customers/{id}         - 顧客情報更新
DELETE /api/v1/customers/{id}         - 顧客削除 (論理削除)
GET    /api/v1/customers/{id}/orders  - 顧客の購買履歴取得
GET    /api/v1/customers/{id}/skillmap - 顧客の技術スキルマップ取得
POST   /api/v1/customers/{id}/skillmap/refresh - スキルマップ再計算
GET    /api/v1/customers/{id}/recommendations - 推奨書籍取得
GET    /api/v1/customers/search       - 高度な顧客検索
GET    /api/v1/customers/stats        - 顧客統計情報取得
```

#### 3.1.3 サービス層実装
- `CustomerService`: 顧客CRUD操作
- `CustomerSkillMapService`: スキルマップ生成・更新
- `CustomerAnalyticsService`: 購買分析・統計
- `CustomerRecommendationService`: 書籍推薦ロジック

### 3.2 フロントエンド実装

#### 3.2.1 React コンポーネント設計
```
components/
├── customer/
│   ├── CustomerList.js           - 顧客一覧表示
│   ├── CustomerDetail.js         - 顧客詳細表示
│   ├── CustomerForm.js           - 顧客登録・編集フォーム
│   ├── CustomerSearch.js         - 顧客検索フォーム
│   ├── PurchaseHistory.js        - 購買履歴表示
│   ├── SkillMapChart.js          - スキルマップ可視化
│   ├── CustomerStats.js          - 顧客統計ダッシュボード
│   └── RecommendedBooks.js       - 推奨書籍表示
```

#### 3.2.2 状態管理 (Redux)
```javascript
// actions/customerActions.js
export const FETCH_CUSTOMERS = 'FETCH_CUSTOMERS';
export const FETCH_CUSTOMER_DETAIL = 'FETCH_CUSTOMER_DETAIL';
export const CREATE_CUSTOMER = 'CREATE_CUSTOMER';
export const UPDATE_CUSTOMER = 'UPDATE_CUSTOMER';
export const DELETE_CUSTOMER = 'DELETE_CUSTOMER';
export const FETCH_PURCHASE_HISTORY = 'FETCH_PURCHASE_HISTORY';
export const FETCH_SKILL_MAP = 'FETCH_SKILL_MAP';
export const REFRESH_SKILL_MAP = 'REFRESH_SKILL_MAP';

// reducers/customerReducer.js
const initialState = {
  customers: [],
  currentCustomer: null,
  purchaseHistory: [],
  skillMap: null,
  loading: false,
  error: null
};
```

### 3.3 データベース設計

#### 3.3.1 テーブル定義
```sql
-- 顧客テーブル
CREATE TABLE customers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_type VARCHAR(20) NOT NULL,
    name VARCHAR(100) NOT NULL,
    name_kana VARCHAR(100),
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    birth_date DATE,
    gender VARCHAR(10),
    occupation VARCHAR(100),
    company_name VARCHAR(100),
    department VARCHAR(100),
    postal_code VARCHAR(10),
    address TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    notes TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_customer_email (email),
    INDEX idx_customer_name (name),
    INDEX idx_customer_status (status),
    INDEX idx_customer_type (customer_type)
);

-- 顧客スキルマップテーブル
CREATE TABLE customer_skill_maps (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    tech_category_id BIGINT NOT NULL,
    skill_level INTEGER NOT NULL DEFAULT 0,
    confidence_score DOUBLE NOT NULL DEFAULT 0.0,
    purchase_count INTEGER NOT NULL DEFAULT 0,
    latest_purchase_date DATE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (tech_category_id) REFERENCES tech_categories(id) ON DELETE CASCADE,
    UNIQUE KEY uk_customer_tech_category (customer_id, tech_category_id),
    INDEX idx_skill_level (skill_level),
    INDEX idx_confidence_score (confidence_score)
);
```

#### 3.3.2 既存テーブルの修正
```sql
-- orders テーブルに外部キー制約を追加
ALTER TABLE orders 
ADD CONSTRAINT fk_orders_customer_id 
FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL;
```

## 4. 実装方針

### 4.1 段階的実装アプローチ

#### Phase 1: 基本的な顧客管理 (優先度: 高)
1. Customer エンティティ、Repository、Service の実装
2. 顧客CRUD API の実装  
3. 基本的な顧客一覧・詳細・登録・編集UI の実装
4. 既存注文データとの連携

#### Phase 2: 購買履歴機能 (優先度: 高)
1. 顧客別購買履歴表示機能
2. 購買統計・分析機能
3. 購買履歴UI コンポーネント

#### Phase 3: 技術スキルマップ (優先度: 中)
1. CustomerSkillMap エンティティの実装
2. スキルマップ生成ロジックの実装
3. スキルマップ可視化UI (レーダーチャート等)
4. 推奨書籍機能

#### Phase 4: 高度な機能 (優先度: 低)
1. 高度な検索・フィルタリング
2. 顧客統計ダッシュボード
3. レポート機能
4. データエクスポート機能

### 4.2 既存システムとの統合

#### 4.2.1 データ移行戦略
1. 既存の `orders.customer_id` から新しい `customers` テーブルへのマッピング
2. 既存注文データから顧客情報の推定・生成
3. データの整合性チェック機能

#### 4.2.2 後方互換性
- 既存のAPI エンドポイントはそのまま維持
- 新しい顧客機能は追加のエンドポイントとして実装
- 段階的な機能有効化を可能にする設定

### 4.3 パフォーマンス考慮事項

#### 4.3.1 データベース最適化
- 適切なインデックスの作成
- スキルマップ生成の非同期処理
- 購買履歴の効率的なクエリ設計

#### 4.3.2 フロントエンド最適化
- 顧客一覧のページング実装
- スキルマップチャートの遅延読み込み
- 検索結果のキャッシュ機能

## 5. 検収基準

### 5.1 機能検収基準

#### 5.1.1 顧客管理基本機能
- [ ] 顧客の新規登録ができる
- [ ] 顧客情報の編集・更新ができる
- [ ] 顧客一覧の表示・検索ができる
- [ ] 顧客の論理削除ができる
- [ ] バリデーションが適切に動作する

#### 5.1.2 購買履歴機能
- [ ] 顧客の全購買履歴が表示される
- [ ] 購買履歴の期間フィルタリングができる
- [ ] 購買統計情報が正確に計算される
- [ ] 注文詳細へのナビゲーションができる

#### 5.1.3 技術スキルマップ機能
- [ ] 購買履歴からスキルマップが生成される
- [ ] スキルマップがレーダーチャートで表示される
- [ ] スキルレベルの計算ロジックが正確である
- [ ] 推奨書籍が適切に表示される

### 5.2 技術検収基準

#### 5.2.1 API仕様
- [ ] OpenAPI (Swagger) ドキュメントが整備されている
- [ ] 全てのエンドポイントが設計通りに動作する
- [ ] 適切なHTTPステータスコードが返される
- [ ] エラーハンドリングが適切に実装されている

#### 5.2.2 データ品質
- [ ] データの整合性が保たれている
- [ ] 外部キー制約が適切に設定されている
- [ ] データ移行が正常に完了する
- [ ] バックアップ・復元が可能である

### 5.3 パフォーマンス検収基準
- [ ] 顧客一覧表示: 1000件以下で2秒以内
- [ ] 顧客検索: キーワード検索で1秒以内
- [ ] スキルマップ生成: 100件の購買履歴で5秒以内
- [ ] 購買履歴表示: 50件の注文で1秒以内

## 6. 運用・保守要件

### 6.1 データメンテナンス
- 定期的なスキルマップ再計算バッチ処理
- 非アクティブ顧客の定期的なクリーンアップ
- 購買データの分析レポート生成

### 6.2 セキュリティ要件
- 個人情報の適切な暗号化
- アクセスログの記録
- データアクセス権限の管理

### 6.3 監視・アラート
- スキルマップ生成処理の監視
- データ整合性チェック
- パフォーマンス指標の監視

## 7. リスクと対策

### 7.1 技術的リスク
**リスク**: 既存注文データとの整合性問題
**対策**: 段階的な移行とデータ検証プロセスの実装

**リスク**: スキルマップ生成のパフォーマンス問題
**対策**: 非同期処理とキャッシュ機能の実装

### 7.2 機能的リスク
**リスク**: スキルマップの精度が低い
**対策**: 機械学習アルゴリズムの段階的改善

**リスク**: ユーザビリティの問題
**対策**: プロトタイプでのユーザーテスト実施

## 8. 成功指標

### 8.1 定量的指標
- 顧客管理機能の利用率: 80%以上
- スキルマップ生成の成功率: 95%以上
- 推奨書籍の的中率: 60%以上
- システム応答時間: 設定値以内

### 8.2 定性的指標
- ユーザーからの満足度調査: 4.0以上 (5点満点)
- 書店スタッフの業務効率向上
- 顧客へのパーソナライズサービス提供

## 9. スケジュール

### 9.1 開発スケジュール (想定)
- **Phase 1 (基本顧客管理)**: 2週間
- **Phase 2 (購買履歴)**: 1週間  
- **Phase 3 (スキルマップ)**: 2週間
- **Phase 4 (高度機能)**: 1週間
- **テスト・調整**: 1週間

**合計開発期間**: 約7週間

### 9.2 主要マイルストーン
1. **Week 2**: 基本顧客管理機能完成
2. **Week 3**: 購買履歴機能完成
3. **Week 5**: スキルマップ機能完成
4. **Week 6**: 全機能統合完成
5. **Week 7**: 本番リリース

---

**作成日**: 2025年7月25日  
**作成者**: GitHub Copilot Coding Agent  
**承認者**: TechBookStore開発チーム  
**バージョン**: 1.0
