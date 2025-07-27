# Tech Trend Analysis Feature

## 概要 (Overview)

TechBookStore技術専門書店における包括的技術トレンド分析システムです。技術書の陳腐化の早さと新技術の急激な変化に対応し、データドリブンな在庫戦略・商品戦略を支援します。

## 主要機能 (Key Features)

### 📊 技術カテゴリトレンド分析
- 月次・四半期・年次技術カテゴリ別売上推移
- 前年同期比成長率自動計算
- 急上昇・衰退技術ランキング
- トレンド方向性判定（上昇・安定・下降）

### 🔄 技術ライフサイクル管理
- 技術普及段階判定（新興期→成長期→成熟期→衰退期）
- 段階遷移予測（月単位）
- ライフサイクル別投資推奨

### ⚡ 新興技術早期発見
- 新興度スコア算出（新刊タイミング30%、売上25%、関心度20%、関連技術25%）
- 新興技術検出アルゴリズム
- 陳腐化リスク予測

### 🔗 技術関連性分析
- 技術相関マトリックス（同時購入パターン）
- 補完・競合・前提技術関係検出
- 技術学習パス分析

### 📈 高度可視化
- Recharts 1.8.5を使用した高度チャート
- ヒートマップ（技術相関）
- ネットワーク図（技術関係）
- 予測チャート（信頼区間付き）

## API エンドポイント (API Endpoints)

```bash
# 技術トレンド総合レポート
GET /api/tech-trends/report

# 特定技術詳細分析
GET /api/tech-trends/categories/{categoryCode}/analysis

# 新興技術検出結果
GET /api/tech-trends/emerging

# 技術関連性マトリックス
GET /api/tech-trends/correlations?minCorrelation=0.3

# ライフサイクル分布
GET /api/tech-trends/lifecycle-distribution

# 投資推奨
GET /api/tech-trends/investment-recommendations?limit=10

# ヘルスチェック
GET /api/tech-trends/health
```

## データベーススキーマ (Database Schema)

### tech_trend_analysis テーブル
技術トレンド分析の核となるデータテーブル
```sql
CREATE TABLE tech_trend_analysis (
    id BIGSERIAL PRIMARY KEY,
    tech_category_id BIGINT NOT NULL REFERENCES tech_categories(id),
    analysis_date DATE NOT NULL,
    total_revenue DECIMAL(12,2),
    total_units_sold INTEGER,
    growth_rate DECIMAL(5,2),
    market_share DECIMAL(5,2),
    lifecycle_stage VARCHAR(20), -- EMERGING, GROWTH, MATURITY, DECLINE
    trend_direction VARCHAR(20), -- RISING, STABLE, DECLINING
    emerging_score DECIMAL(5,2),
    obsolescence_risk DECIMAL(5,2),
    trend_analysis TEXT,
    investment_recommendation TEXT
);
```

### tech_relationships テーブル
技術間の関連性分析データ
```sql
CREATE TABLE tech_relationships (
    id BIGSERIAL PRIMARY KEY,
    primary_tech_id BIGINT NOT NULL REFERENCES tech_categories(id),
    related_tech_id BIGINT NOT NULL REFERENCES tech_categories(id),
    relationship_type VARCHAR(20) NOT NULL, -- COMPLEMENTARY, COMPETITIVE, PREREQUISITE, SUCCESSOR
    correlation_strength DECIMAL(5,2) NOT NULL, -- -1.0 to 1.0
    analysis_date DATE NOT NULL,
    confidence_level VARCHAR(10) -- HIGH, MEDIUM, LOW
);
```

### tech_predictions テーブル
技術予測・予報データ
```sql
CREATE TABLE tech_predictions (
    id BIGSERIAL PRIMARY KEY,
    tech_category_id BIGINT NOT NULL REFERENCES tech_categories(id),
    prediction_date DATE NOT NULL,
    prediction_for_date DATE NOT NULL,
    predicted_revenue DECIMAL(12,2),
    predicted_growth_rate DECIMAL(5,2),
    confidence_interval DECIMAL(5,2),
    prediction_model VARCHAR(50),
    model_accuracy DECIMAL(5,2)
);
```

## フロントエンド構成 (Frontend Structure)

### TechTrendReportPage コンポーネント
技術トレンドレポートのメインページ

#### タブ構成:
1. **市場概要**: 総合市場分析とライフサイクル分布
2. **カテゴリ分析**: 特定技術カテゴリの詳細分析
3. **新興技術**: 新興技術検出結果とスコアリング
4. **技術相関**: 技術間の関連性・相関分析
5. **ライフサイクル**: 技術ライフサイクル分布と詳細
6. **投資推奨**: データドリブンな投資推奨事項

### 既存コンポーネント活用
- `TechCategoryTrendChart`: 詳細な技術カテゴリ分析チャート
- Material-UI 4.x コンポーネント
- Recharts 1.8.5 可視化ライブラリ

## 導入手順 (Setup Instructions)

### 1. データベースマイグレーション
```bash
# 新しいテーブルとインデックスを作成
psql -d techbookstore < backend/src/main/resources/db/migration/tech_trend_schema.sql
```

### 2. バックエンド起動
```bash
cd backend
./mvnw spring-boot:run
```

### 3. フロントエンド起動
```bash
cd frontend
npm install
npm start
```

### 4. アクセス
- アプリケーション: http://localhost:3000
- 技術トレンドレポート: http://localhost:3000/reports/tech-trends
- API文書: http://localhost:8080/api/tech-trends/health

## サンプルデータ (Sample Data)

システム初期化時に以下の技術カテゴリのサンプルデータが投入されます：
- Java (成熟期、安定トレンド)
- Python (成長期、上昇トレンド)
- JavaScript (成熟期、安定トレンド)
- React (新興期、上昇トレンド)
- Spring (成熟期、安定トレンド)
- MySQL (成熟期、安定トレンド)

## パフォーマンス最適化 (Performance Optimization)

### インデックス設計
```sql
-- 主要クエリ用インデックス
CREATE INDEX idx_tech_trend_analysis_date_category ON tech_trend_analysis(analysis_date, tech_category_id);
CREATE INDEX idx_tech_trend_analysis_emerging ON tech_trend_analysis(emerging_score DESC);
CREATE INDEX idx_tech_relationships_correlation ON tech_relationships(correlation_strength DESC);
```

### キャッシュ戦略
- レポートデータの日次キャッシュ
- カテゴリ分析の時間ベースキャッシュ
- 相関マトリックスの週次更新

## テスト (Testing)

### 単体テスト実行
```bash
cd backend
./mvnw test -Dtest=TechTrendControllerTest
```

### API動作確認
```bash
# ヘルスチェック
curl http://localhost:8080/api/tech-trends/health

# 総合レポート
curl http://localhost:8080/api/tech-trends/report

# 新興技術
curl http://localhost:8080/api/tech-trends/emerging
```

## 技術制約 (Technical Constraints)

- **Java**: 8 (レガシー互換性)
- **Spring Boot**: 2.3.12 RELEASE
- **React**: 16.13.1
- **Material-UI**: 4.11.4
- **Recharts**: 1.8.5
- **データベース**: PostgreSQL 12.x推奨

## 検収基準 (Acceptance Criteria)

- ✅ 成長率計算精度 > 95%
- ✅ ライフサイクル判定精度 > 80%
- ✅ 技術相関分析精度 > 75%
- ✅ 新興技術検出感度 > 70%
- ✅ レスポンシブデザイン対応
- ✅ エラーハンドリング完備
- ✅ レポート生成 < 5秒
- ✅ チャート描画 < 2秒
- ✅ API応答 < 1秒

## 将来的な拡張 (Future Enhancements)

1. **機械学習統合**: より高度な予測アルゴリズム
2. **外部API連携**: GitHub、Stack Overflow等のトレンドデータ
3. **リアルタイム分析**: ストリーミングデータ処理
4. **アラート機能**: トレンド変化の自動通知
5. **セグメント分析**: 顧客レベル別技術トレンド

この技術トレンド分析機能により、TechBookStoreは技術専門書店としての差別化を図り、データに基づいた戦略的経営を実現できます。