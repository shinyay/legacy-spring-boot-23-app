# レポート機能 PRD (Product Requirements Document)

## 1. 概要

### 1.1 目的
TechBookStore（技術専門書店在庫管理システム）にビジネスインテリジェンス機能を提供し、データドリブンな意思決定を支援する包括的なレポート・分析機能を実装する。

### 1.2 スコープ
- **対象範囲**: 売上分析、在庫分析、顧客分析、技術トレンド分析、経営ダッシュボード、レポート自動生成
- **対象外**: 予測モデリング、高度な機械学習分析、外部データ統合、リアルタイムストリーミング分析

### 1.3 ビジネス価値
- 経営判断のための可視化されたビジネス指標
- 在庫最適化による運営効率向上
- 顧客行動分析による売上最大化
- 技術トレンド把握による戦略的書籍仕入れ

## 2. 機能要件

### 2.1 売上分析レポート

#### 2.1.1 売上サマリー
- **日次/週次/月次/年次売上推移**
  - 総売上金額、注文数、平均注文金額
  - 前期比較（日次：前日、月次：前月、年次：前年）
  - グラフ表示：線グラフ、棒グラフ
  
- **売上ランキング**
  - 書籍別売上ランキング（TOP20）
  - カテゴリ別売上構成比（円グラフ）
  - 著者別売上ランキング（TOP10）
  - 出版社別売上ランキング（TOP10）

#### 2.1.2 期間分析
- **季節性分析**
  - 月別売上パターン（過去3年間）
  - 技術カテゴリ別季節トレンド
  - 新刊発売タイミングと売上相関

- **曜日分析**
  - 曜日別売上パターン
  - 時間帯別注文パターン（オンライン注文）

#### 2.1.3 価格分析
- **価格帯別売上分布**
  - 価格レンジ別売上構成（<2000円、2000-4000円、>4000円）
  - 技術レベル別価格vs売上相関
  - 割引効果分析

### 2.2 在庫分析レポート

#### 2.2.1 在庫状況サマリー
- **在庫健全性指標**
  - 総在庫数、総在庫金額
  - 在庫回転率（カテゴリ別）
  - 在庫切れ率、過剰在庫率
  - デッドストック分析（90日以上売上なし）

#### 2.2.2 発注最適化レポート
- **発注提案**
  - AIベース発注推奨リスト
  - 発注点割れアラート
  - 季節性を考慮した発注計画
  - サプライヤー別発注効率分析

#### 2.2.3 在庫動向分析
- **入荷・出荷トレンド**
  - 月次入荷vs出荷トレンド
  - カテゴリ別在庫動向
  - 新刊入荷効果分析

### 2.3 顧客分析レポート

#### 2.3.1 顧客セグメンテーション
- **顧客分類**
  - RFM分析（Recency, Frequency, Monetary）
  - 技術スキルレベル別顧客分布
  - 個人/法人顧客別分析
  - 地域別顧客分布

#### 2.3.2 購買行動分析
- **購買パターン**
  - 顧客ライフサイクル分析
  - クロスセル・アップセル機会分析
  - 技術書学習パス分析
  - リピート購入率分析

#### 2.3.3 顧客価値分析
- **LTV（Life Time Value）分析**
  - 顧客別LTV算出
  - 顧客獲得コスト vs LTV
  - 顧客満足度指標

### 2.4 技術トレンド分析

#### 2.4.1 技術カテゴリトレンド
- **人気技術ランキング**
  - 月次/年次技術カテゴリ売上トレンド
  - 新興技術の成長率分析
  - 衰退技術の特定

#### 2.4.2 技術レベル分析
- **学習レベル分布**
  - BEGINNER/INTERMEDIATE/ADVANCED別売上
  - 顧客の技術成長パターン分析
  - 技術習得ロードマップ分析

### 2.5 経営ダッシュボード

#### 2.5.1 KPIサマリー
- **リアルタイム指標**
  - 本日の売上、注文数
  - 在庫アラート数
  - アクティブ顧客数
  - 前月比成長率

#### 2.5.2 トレンド概要
- **重要指標トレンド（過去12ヶ月）**
  - 売上推移
  - 顧客数推移
  - 在庫回転率推移
  - 利益率推移

## 3. 技術要件

### 3.1 バックエンド実装

#### 3.1.1 新規エンティティ設計
```java
// レポート設定エンティティ
@Entity
@Table(name = "report_configs")
public class ReportConfig {
    private Long id;
    private String reportType; // SALES, INVENTORY, CUSTOMER, TREND
    private String reportName;
    private String description;
    private String configJson; // レポート固有設定
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

// レポート実行履歴エンティティ
@Entity
@Table(name = "report_executions")
public class ReportExecution {
    private Long id;
    private Long reportConfigId;
    private String executedBy;
    private LocalDateTime executedAt;
    private String parameters; // JSON形式
    private String status; // RUNNING, COMPLETED, FAILED
    private String resultPath; // 生成ファイルパス
}

// 集計データキャッシュエンティティ
@Entity
@Table(name = "aggregation_cache")
public class AggregationCache {
    private Long id;
    private String cacheKey;
    private String aggregationType;
    private LocalDate aggregationDate;
    private String aggregationData; // JSON形式
    private LocalDateTime createdAt;
    private LocalDateTime expiresAt;
}
```

#### 3.1.2 レポートサービス設計
```java
@Service
public class ReportService {
    
    // 売上分析
    public SalesReportDto generateSalesReport(SalesReportRequest request);
    public SalesTrendDto getSalesTrend(LocalDate startDate, LocalDate endDate);
    public List<SalesRankingDto> getSalesRanking(String category, int limit);
    
    // 在庫分析
    public InventoryReportDto generateInventoryReport();
    public List<ReorderSuggestionDto> getReorderSuggestions();
    public InventoryTurnoverDto getInventoryTurnover(String category);
    
    // 顧客分析
    public CustomerAnalyticsDto generateCustomerAnalytics();
    public RFMAnalysisDto performRFMAnalysis();
    public List<CustomerSegmentDto> getCustomerSegments();
    
    // 技術トレンド分析
    public TechTrendReportDto generateTechTrendReport();
    public List<TechCategoryTrendDto> getTechCategoryTrends();
    
    // ダッシュボード
    public DashboardKPIDto getDashboardKPIs();
    public List<TrendSummaryDto> getTrendSummaries();
}
```

#### 3.1.3 API エンドポイント設計
```
GET    /api/v1/reports/sales                    - 売上レポート生成
GET    /api/v1/reports/sales/trend              - 売上トレンド取得
GET    /api/v1/reports/sales/ranking            - 売上ランキング取得
GET    /api/v1/reports/inventory                - 在庫レポート生成
GET    /api/v1/reports/inventory/turnover       - 在庫回転率取得
GET    /api/v1/reports/inventory/reorder        - 発注提案取得
GET    /api/v1/reports/customers                - 顧客分析レポート生成
GET    /api/v1/reports/customers/rfm            - RFM分析取得
GET    /api/v1/reports/customers/segments       - 顧客セグメント取得
GET    /api/v1/reports/tech-trends              - 技術トレンドレポート生成
GET    /api/v1/reports/tech-trends/categories   - カテゴリ別トレンド取得
GET    /api/v1/reports/dashboard/kpis           - ダッシュボードKPI取得
GET    /api/v1/reports/dashboard/trends         - トレンドサマリー取得
POST   /api/v1/reports/custom                   - カスタムレポート生成
GET    /api/v1/reports/configs                  - レポート設定一覧
POST   /api/v1/reports/configs                  - レポート設定作成
PUT    /api/v1/reports/configs/{id}             - レポート設定更新
DELETE /api/v1/reports/configs/{id}             - レポート設定削除
GET    /api/v1/reports/executions               - レポート実行履歴
POST   /api/v1/reports/export                   - レポートエクスポート
```

### 3.2 データベース設計

#### 3.2.1 新規テーブル
```sql
-- レポート設定テーブル
CREATE TABLE report_configs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    report_type VARCHAR(50) NOT NULL,
    report_name VARCHAR(255) NOT NULL,
    description TEXT,
    config_json JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_report_type (report_type)
);

-- レポート実行履歴テーブル
CREATE TABLE report_executions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    report_config_id BIGINT,
    executed_by VARCHAR(255),
    executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    parameters JSON,
    status VARCHAR(20) DEFAULT 'RUNNING',
    result_path VARCHAR(500),
    error_message TEXT,
    FOREIGN KEY (report_config_id) REFERENCES report_configs(id),
    INDEX idx_executed_at (executed_at),
    INDEX idx_status (status)
);

-- 集計データキャッシュテーブル
CREATE TABLE aggregation_cache (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    cache_key VARCHAR(255) UNIQUE NOT NULL,
    aggregation_type VARCHAR(50) NOT NULL,
    aggregation_date DATE NOT NULL,
    aggregation_data JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    INDEX idx_cache_key (cache_key),
    INDEX idx_expires_at (expires_at)
);
```

#### 3.2.2 既存テーブル活用
- `orders` テーブル: 売上データ、顧客購買履歴
- `order_items` テーブル: 商品別売上詳細
- `inventory` テーブル: 在庫データ、在庫動向
- `books` テーブル: 商品マスタ、カテゴリ分析
- `customers` テーブル: 顧客分析、セグメンテーション
- `tech_categories` テーブル: 技術トレンド分析

### 3.3 フロントエンド実装

#### 3.3.1 レポートページ構成
```
/reports                     - レポートダッシュボード
├── /reports/sales          - 売上分析レポート
├── /reports/inventory      - 在庫分析レポート
├── /reports/customers      - 顧客分析レポート
├── /reports/tech-trends    - 技術トレンド分析
├── /reports/dashboard      - 経営ダッシュボード
└── /reports/custom         - カスタムレポート作成
```

#### 3.3.2 React コンポーネント設計
```javascript
// メインレポートページ
<ReportsPage />
├── <ReportSidebar />           // レポート種別ナビゲーション
├── <ReportFilters />           // 期間・条件フィルター
└── <ReportContent />           // レポート表示エリア
    ├── <SalesReport />         // 売上分析レポート
    ├── <InventoryReport />     // 在庫分析レポート
    ├── <CustomerReport />      // 顧客分析レポート
    ├── <TechTrendReport />     // 技術トレンドレポート
    └── <DashboardReport />     // 経営ダッシュボード

// 共通チャートコンポーネント
<Charts />
├── <LineChart />               // 線グラフ（トレンド表示）
├── <BarChart />                // 棒グラフ（比較表示）
├── <PieChart />                // 円グラフ（構成比表示）
├── <HeatMap />                 // ヒートマップ（相関表示）
└── <TableChart />              // データテーブル表示
```

#### 3.3.3 使用ライブラリ
- **チャートライブラリ**: Recharts (React 16.13.x対応)
- **テーブル**: Material-UI Table (既存UI統一)
- **日付ピッカー**: @material-ui/pickers
- **エクスポート**: react-to-print, FileSaver.js

### 3.4 パフォーマンス最適化

#### 3.4.1 データ集計最適化
- **事前集計テーブル**: 日次/月次売上サマリー
- **インデックス最適化**: 日付、カテゴリ、顧客IDベースの複合インデックス
- **キャッシュ戦略**: Redis活用（将来拡張）
- **ページング**: 大量データのページング対応

#### 3.4.2 フロントエンド最適化
- **遅延読み込み**: レポート画面のlazyロード
- **チャート仮想化**: 大量データポイントの効率的レンダリング
- **メモ化**: React.memoによるコンポーネント最適化

## 4. 実装方針

### 4.1 段階的実装アプローチ

#### Phase 1: 基本レポート機能 (優先度: 高)
1. **経営ダッシュボード**: KPI表示、基本トレンド
2. **売上レポート**: 基本的な売上分析
3. **在庫レポート**: 在庫状況、アラート機能
4. **レポートフレームワーク**: 共通コンポーネント構築

#### Phase 2: 詳細分析機能 (優先度: 中)
1. **顧客分析**: RFM分析、セグメンテーション
2. **技術トレンド**: カテゴリ別トレンド分析
3. **詳細チャート**: 高度な可視化機能
4. **レポートエクスポート**: PDF/Excel出力

#### Phase 3: 高度な機能 (優先度: 低)
1. **カスタムレポート**: ユーザー定義レポート
2. **自動レポート**: スケジュール実行
3. **アラート機能**: 閾値ベースアラート
4. **予測分析**: 基本的な売上予測

### 4.2 既存システムとの統合

#### 4.2.1 データソース統合
- 既存の`orders`, `inventory`, `customers`テーブルを活用
- 既存APIエンドポイントとの整合性確保
- DataInitializer.javaでのテストデータ拡張

#### 4.2.2 UI統合
- 既存Material-UIテーマとの統一
- 既存ナビゲーション構造への統合
- レスポンシブデザイン対応

### 4.3 品質保証

#### 4.3.1 テスト戦略
- **単体テスト**: レポート計算ロジックのテスト
- **結合テスト**: API-DB連携テスト
- **E2Eテスト**: レポート生成フローの検証
- **パフォーマンステスト**: 大量データでの性能検証

#### 4.3.2 データ品質保証
- 集計データの正確性検証
- 期間指定の境界値テスト
- ゼロ除算対策
- NULLデータハンドリング

## 5. 検収基準

### 5.1 機能検収基準

#### 5.1.1 レポート生成機能
- [ ] 売上レポートが正確に生成される
- [ ] 在庫レポートが正確に生成される
- [ ] 顧客分析レポートが正確に生成される
- [ ] 技術トレンドレポートが正確に生成される
- [ ] ダッシュボードKPIが正確に表示される

#### 5.1.2 データ可視化機能
- [ ] チャートが正しく表示される
- [ ] インタラクティブな操作が動作する
- [ ] レスポンシブデザインが適用される
- [ ] エクスポート機能が動作する

#### 5.1.3 フィルタリング機能
- [ ] 期間フィルターが正常に動作する
- [ ] カテゴリフィルターが正常に動作する
- [ ] 複合フィルターが正常に動作する

### 5.2 技術検収基準

#### 5.2.1 パフォーマンス
- [ ] レポート生成時間: 10,000件以下で5秒以内
- [ ] チャート描画時間: 1,000ポイント以下で2秒以内
- [ ] ダッシュボード読み込み: 3秒以内

#### 5.2.2 データ品質
- [ ] 集計データの精度が99.9%以上
- [ ] データの整合性が保たれている
- [ ] 欠損データの適切なハンドリング

### 5.3 ユーザビリティ検収基準
- [ ] 直感的なナビゲーション
- [ ] レポートの理解しやすさ
- [ ] エラーメッセージの分かりやすさ
- [ ] ヘルプ・ガイダンスの充実

## 6. 運用・保守要件

### 6.1 データメンテナンス
- **集計データ更新**: 日次バッチでの集計データ更新
- **キャッシュクリア**: 定期的なキャッシュクリア処理
- **履歴データ保持**: レポート実行履歴の保持期間管理

### 6.2 監視・アラート
- **レポート生成監視**: 生成失敗時のアラート
- **パフォーマンス監視**: レスポンス時間の監視
- **データ品質監視**: 集計データの異常値検知

### 6.3 バックアップ・復旧
- **設定データバックアップ**: レポート設定の定期バックアップ
- **実行履歴バックアップ**: 重要なレポート結果の保存

## 7. リスクと対策

### 7.1 技術的リスク
**リスク**: 大量データでのパフォーマンス問題
**対策**: 段階的な最適化とキャッシュ戦略の実装

**リスク**: チャートライブラリの互換性問題
**対策**: React 16.13.x対応ライブラリの事前検証

**リスク**: 既存システムとの統合問題
**対策**: 既存APIの詳細分析と段階的統合

### 7.2 機能的リスク
**リスク**: レポートの正確性に関する問題
**対策**: 包括的なテストケースと検証プロセス

**リスク**: ユーザビリティの問題
**対策**: プロトタイプでのユーザーテスト実施

**リスク**: データ量増加に伴う性能劣化
**対策**: アーキテクチャ設計での拡張性確保

## 8. 成功指標

### 8.1 定量的指標
- **機能完成度**: 計画機能の90%以上実装
- **パフォーマンス**: 目標値以内での動作
- **品質**: バグ数 < 10件（クリティカル: 0件）
- **テストカバレッジ**: 80%以上

### 8.2 定性的指標
- **ユーザー満足度**: ステークホルダーの合意
- **操作性**: 直感的で使いやすいUI
- **保守性**: 拡張可能で保守しやすいコード
- **既存システム統合**: スムーズな統合完了

この包括的なレポート機能により、TechBookStoreの経営効率向上とデータドリブンな意思決定支援を実現します。
