# 在庫管理機能アップグレード PRD (Product Requirements Document)

## 1. エグゼクティブサマリー

### 1.1 目的
技術専門書店在庫管理システム（TechBookStore）の在庫管理機能を大幅にアップグレードし、現代的なeコマース・小売業界標準に適合した包括的な在庫最適化ソリューションを実現する。

### 1.2 背景・現状分析

#### 現在の在庫管理システムの課題
1. **基本的な機能の不足**
   - バーコードスキャン機能が未実装
   - 自動発注機能が基本的なレベル
   - 在庫移動・転送機能の欠如
   - リアルタイム在庫同期の未対応

2. **ワークフロー管理の不備**
   - 承認プロセスが不明確
   - 入荷検品プロセスの自動化不足
   - 廃棄・返品処理の未実装
   - 棚卸し機能の不足

3. **分析・予測機能の限界**
   - 需要予測アルゴリズムの未実装
   - 季節性・トレンド分析の不足
   - 詳細な在庫回転率分析の欠如
   - 最適在庫レベル自動算出の未対応

4. **連携・統合の不足**
   - 外部システム（出版社、卸売業者）との連携未対応
   - POSシステムとの統合不足
   - 配送業者APIとの連携未実装

### 1.3 ビジネス価値
- **在庫コスト削減**: 20-30%の在庫削減
- **売上機会損失の最小化**: 欠品率を3%以下に削減
- **作業効率向上**: 在庫関連作業時間を50%削減
- **予測精度向上**: 需要予測精度を85%以上に向上

## 2. 現状システム分析

### 2.1 既存機能の評価

#### 実装済み機能
✅ **基本在庫管理**
- 店頭・倉庫在庫の分離管理
- 基本的な入荷・販売処理
- 在庫アラート機能
- 発注点・発注量設定

✅ **レポート機能**
- 在庫一覧表示
- 在庫状況サマリー
- 基本的な在庫回転率計算
- 低在庫・欠品アラート

#### 未実装・改善が必要な機能
❌ **高度なワークフロー**
- 入荷検品プロセス
- 承認ワークフロー
- 在庫移動管理
- 棚卸し機能

❌ **自動化機能**
- バーコードスキャン
- 自動発注システム
- 需要予測
- 最適在庫計算

❌ **外部連携**
- サプライヤー連携
- POSシステム統合
- 配送システム連携

### 2.2 技術的制約
- **レガシー技術スタック**: Java 8, Spring Boot 2.3.x
- **データベース制約**: H2（開発）、PostgreSQL（本番）
- **フロントエンド制約**: React 16.13.x, Material-UI 4.x
- **統合制約**: RESTful API ベースの設計

## 3. 要件定義

### 3.1 機能要件

#### 3.1.1 高度な在庫管理機能

**A. スマート入荷管理**
- **バーコード/QRコードスキャン対応**
  - ISBN-13バーコード読み取り
  - 独自QRコード生成・読み取り
  - モバイル端末対応（Camera API活用）
  - 一括入荷処理

- **入荷検品ワークフロー**
  ```
  発注書作成 → 入荷予定登録 → 検品処理 → 差異確認 → 承認 → 在庫反映
  ```
  - 入荷予定と実績の照合
  - 差異レポート自動生成
  - 検品者・承認者のデジタル署名
  - 不良品・破損品の分別処理

- **高度な在庫操作**
  - 在庫移動（倉庫↔店頭、店舗間）
  - 在庫予約・引当機能
  - 在庫ロック機能（棚卸し時等）
  - 一括在庫調整機能

**B. インテリジェント発注システム**
- **AIベース需要予測**
  - 過去売上データ分析（季節性、トレンド）
  - 技術カテゴリ別需要パターン学習
  - 新刊発売スケジュール考慮
  - 外部要因（技術イベント、認定試験日程）統合

- **自動発注機能**
  - 多段階発注点設定（警告、推奨、緊急）
  - サプライヤー別リードタイム管理
  - 発注承認ワークフロー
  - 発注書自動生成・送信

- **最適在庫レベル計算**
  - ABC分析に基づく分類
  - 安全在庫量の動的計算
  - 季節性考慮した在庫計画
  - ROI最適化アルゴリズム

**C. 包括的棚卸し機能**
- **棚卸し管理**
  - 定期・臨時棚卸しスケジューリング
  - 部分棚卸し対応（カテゴリ別、エリア別）
  - モバイル端末での棚卸し実行
  - 差異分析・原因追跡

- **在庫精度管理**
  - 在庫精度KPI追跡
  - 差異原因分析レポート
  - 在庫調整履歴管理
  - 改善提案機能

#### 3.1.2 高度なレポート・分析機能

**A. リアルタイム在庫ダッシュボード**
- **KPI可視化**
  - 在庫回転率（商品別、カテゴリ別）
  - 在庫精度率
  - 欠品率・過剰在庫率
  - 発注精度・リードタイム

- **アラート・通知システム**
  - 閾値ベースアラート
  - 異常検知アルゴリズム
  - プロアクティブ通知
  - エスカレーション機能

**B. 高度な在庫分析**
- **ABC/XYZ分析**
  - 売上貢献度別分類（ABC）
  - 需要変動性別分類（XYZ）
  - マトリックス分析
  - 戦略的在庫方針提案

- **デッドストック分析**
  - 滞留期間分析
  - 減価償却計算
  - 処分提案（返品、廃棄、セール）
  - 機会損失計算

**C. 予測分析・最適化**
- **需要予測モデル**
  - 時系列分析（ARIMA、指数平滑法）
  - 機械学習モデル（Random Forest、LSTM）
  - 外部要因統合（天気、イベント等）
  - 予測精度評価・改善

- **在庫最適化**
  - 経済発注量（EOQ）計算
  - 多品目最適化
  - 制約条件考慮（予算、保管容量）
  - シミュレーション機能

#### 3.1.3 システム統合・連携機能

**A. サプライヤー連携**
- **EDI統合**
  - 標準EDIフォーマット対応
  - 発注書電子送信
  - 入荷予定自動取得
  - 請求書照合自動化

- **API連携**
  - サプライヤーAPIとの接続
  - リアルタイム在庫確認
  - 価格・納期情報取得
  - 返品・交換処理

**B. POSシステム統合**
- **リアルタイム在庫同期**
  - 販売時点での在庫減算
  - 複数店舗間同期
  - 障害時の差分同期
  - データ整合性保証

**C. 配送・物流連携**
- **配送業者API統合**
  - 配送状況追跡
  - 配送完了通知
  - 返品処理自動化
  - 配送コスト最適化

### 3.2 非機能要件

#### 3.2.1 パフォーマンス要件
- **応答時間**
  - 在庫照会: 100ms以内
  - 在庫更新: 500ms以内
  - レポート生成: 5秒以内
  - 大量データ処理: 30秒以内

- **スループット**
  - 同時ユーザー数: 50名
  - 1日あたり取引数: 10,000件
  - ピーク時処理能力: 100取引/分

#### 3.2.2 可用性・信頼性
- **システム稼働率**: 99.5%以上
- **データバックアップ**: 日次自動バックアップ
- **災害復旧**: RTO 4時間、RPO 1時間
- **データ整合性**: ACID特性保証

#### 3.2.3 セキュリティ要件
- **アクセス制御**
  - ロールベースアクセス制御（RBAC）
  - 在庫操作権限の細分化
  - 承認レベル別制限
  - 監査ログ完全取得

- **データ保護**
  - 暗号化（保存時・転送時）
  - 個人情報保護対応
  - GDPR準拠
  - データマスキング機能

## 4. 技術仕様

### 4.1 システムアーキテクチャ

#### 4.1.1 全体アーキテクチャ
```
[フロントエンド] ← REST API → [API Gateway] → [マイクロサービス群]
                                                  ├── 在庫管理サービス
                                                  ├── 発注管理サービス
                                                  ├── 予測エンジン
                                                  ├── 通知サービス
                                                  └── 統合サービス
                                     ↓
[データベース層] ← [キャッシュ層] ← [メッセージキュー]
```

#### 4.1.2 新規エンティティ設計

**在庫トランザクション管理**
```java
@Entity
@Table(name = "inventory_transactions")
public class InventoryTransaction {
    @Id
    private Long id;
    
    @ManyToOne
    private Inventory inventory;
    
    @Enumerated(EnumType.STRING)
    private TransactionType type; // RECEIVE, SELL, ADJUST, TRANSFER, RESERVE
    
    private Integer quantity;
    private Integer beforeQuantity;
    private Integer afterQuantity;
    
    private String reason;
    private String batchNumber;
    private String referenceNumber;
    
    @ManyToOne
    private User executedBy;
    
    @ManyToOne
    private User approvedBy;
    
    private LocalDateTime executedAt;
    private LocalDateTime approvedAt;
    
    @Enumerated(EnumType.STRING)
    private TransactionStatus status; // PENDING, APPROVED, REJECTED, CANCELLED
}
```

**発注管理強化**
```java
@Entity
@Table(name = "purchase_orders")
public class PurchaseOrder {
    @Id
    private Long id;
    
    private String orderNumber;
    
    @ManyToOne
    private Supplier supplier;
    
    @Enumerated(EnumType.STRING)
    private OrderType orderType; // AUTO, MANUAL, EMERGENCY
    
    @Enumerated(EnumType.STRING)
    private OrderStatus status; // DRAFT, PENDING, APPROVED, SENT, RECEIVED, CLOSED
    
    private BigDecimal totalAmount;
    private LocalDate expectedDeliveryDate;
    private LocalDate actualDeliveryDate;
    
    @OneToMany(mappedBy = "purchaseOrder", cascade = CascadeType.ALL)
    private List<PurchaseOrderItem> items;
    
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime approvedAt;
    
    @ManyToOne
    private User createdBy;
    
    @ManyToOne
    private User approvedBy;
}
```

**予測・分析エンティティ**
```java
@Entity
@Table(name = "demand_forecasts")
public class DemandForecast {
    @Id
    private Long id;
    
    @ManyToOne
    private Book book;
    
    private LocalDate forecastDate;
    private Integer forecastQuantity;
    private Double confidenceLevel;
    
    @Enumerated(EnumType.STRING)
    private ForecastModel model; // ARIMA, LINEAR_REGRESSION, NEURAL_NETWORK
    
    private String modelParameters;
    private Integer actualQuantity;
    private Double accuracy;
    
    private LocalDateTime generatedAt;
    private LocalDateTime validUntil;
}
```

**棚卸し管理**
```java
@Entity
@Table(name = "stocktaking_sessions")
public class StocktakingSession {
    @Id
    private Long id;
    
    private String sessionNumber;
    
    @Enumerated(EnumType.STRING)
    private StocktakingType type; // FULL, PARTIAL, CYCLE
    
    @Enumerated(EnumType.STRING)
    private StocktakingStatus status; // PLANNED, IN_PROGRESS, COMPLETED, APPROVED
    
    private LocalDateTime plannedDate;
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
    private LocalDateTime approvedAt;
    
    @ManyToOne
    private User supervisor;
    
    @OneToMany(mappedBy = "session", cascade = CascadeType.ALL)
    private List<StocktakingItem> items;
    
    private String notes;
    private Integer totalVarianceCount;
    private BigDecimal totalVarianceValue;
}
```

#### 4.1.3 新規サービス設計

**高度な在庫サービス**
```java
@Service
@Transactional
public class AdvancedInventoryService {
    
    // バーコードスキャン処理
    public InventoryDto processBarcodeScanned(String barcode, String operation);
    
    // 在庫移動処理
    public TransferResult transferStock(StockTransferRequest request);
    
    // 在庫予約・引当
    public ReservationResult reserveStock(StockReservationRequest request);
    
    // 在庫ロック・アンロック
    public void lockInventory(Long inventoryId, String reason);
    public void unlockInventory(Long inventoryId);
    
    // 一括在庫調整
    public BatchAdjustmentResult batchAdjustStock(List<StockAdjustmentRequest> requests);
    
    // 在庫トランザクション履歴
    public Page<InventoryTransactionDto> getTransactionHistory(Long inventoryId, Pageable pageable);
}
```

**需要予測サービス**
```java
@Service
public class DemandForecastService {
    
    // 需要予測実行
    public ForecastResult generateDemandForecast(Long bookId, ForecastParameters params);
    
    // 一括予測実行
    public BatchForecastResult generateBatchForecast(ForecastCriteria criteria);
    
    // 予測精度評価
    public AccuracyReport evaluateForecastAccuracy(LocalDate fromDate, LocalDate toDate);
    
    // 最適在庫レベル計算
    public OptimalStockLevel calculateOptimalStock(Long bookId);
    
    // 季節性分析
    public SeasonalityAnalysis analyzeSeasonality(Long bookId);
}
```

**自動発注サービス**
```java
@Service
@Transactional
public class AutoOrderService {
    
    // 自動発注実行
    public List<PurchaseOrderDto> executeAutoOrdering();
    
    // 発注提案生成
    public List<OrderSuggestionDto> generateOrderSuggestions();
    
    // 発注承認ワークフロー
    public ApprovalResult approveOrder(Long orderId, String approverComments);
    
    // 発注書生成・送信
    public void generateAndSendPurchaseOrder(Long orderId);
    
    // サプライヤー在庫確認
    public SupplierStockStatus checkSupplierStock(Long supplierId, String isbn);
}
```

**棚卸しサービス**
```java
@Service
@Transactional
public class StocktakingService {
    
    // 棚卸しセッション作成
    public StocktakingSessionDto createSession(StocktakingRequest request);
    
    // 棚卸し実行
    public StocktakingItemDto recordCount(Long sessionId, String barcode, Integer countedQuantity);
    
    // 差異分析
    public VarianceAnalysisReport analyzeVariances(Long sessionId);
    
    // 棚卸し完了処理
    public void completeStocktaking(Long sessionId);
    
    // 在庫調整反映
    public void applyStocktakingAdjustments(Long sessionId);
}
```

### 4.2 APIエンドポイント設計

#### 4.2.1 高度な在庫管理API
```
# バーコードスキャン
POST   /api/v1/inventory/barcode-scan
PUT    /api/v1/inventory/barcode-receive
PUT    /api/v1/inventory/barcode-adjust

# 在庫移動・転送
POST   /api/v1/inventory/transfers
GET    /api/v1/inventory/transfers
PUT    /api/v1/inventory/transfers/{id}/approve

# 在庫予約・引当
POST   /api/v1/inventory/reservations
GET    /api/v1/inventory/reservations
DELETE /api/v1/inventory/reservations/{id}

# 在庫ロック管理
POST   /api/v1/inventory/{id}/lock
DELETE /api/v1/inventory/{id}/unlock

# 在庫トランザクション履歴
GET    /api/v1/inventory/{id}/transactions
GET    /api/v1/inventory/transactions/export

# 一括操作
POST   /api/v1/inventory/batch-receive
POST   /api/v1/inventory/batch-adjust
POST   /api/v1/inventory/batch-transfer
```

#### 4.2.2 発注管理API
```
# 発注管理
GET    /api/v1/purchase-orders
POST   /api/v1/purchase-orders
GET    /api/v1/purchase-orders/{id}
PUT    /api/v1/purchase-orders/{id}
DELETE /api/v1/purchase-orders/{id}

# 発注承認
POST   /api/v1/purchase-orders/{id}/approve
POST   /api/v1/purchase-orders/{id}/reject
POST   /api/v1/purchase-orders/{id}/send

# 自動発注
GET    /api/v1/purchase-orders/suggestions
POST   /api/v1/purchase-orders/auto-generate
POST   /api/v1/purchase-orders/auto-execute

# サプライヤー連携
GET    /api/v1/suppliers/{id}/catalog
GET    /api/v1/suppliers/{id}/stock-status
POST   /api/v1/suppliers/{id}/send-order
```

#### 4.2.3 予測・分析API
```
# 需要予測
GET    /api/v1/forecasts/demand/{bookId}
POST   /api/v1/forecasts/demand/generate
GET    /api/v1/forecasts/accuracy-report

# 在庫最適化
GET    /api/v1/optimization/optimal-stock/{bookId}
GET    /api/v1/optimization/abc-analysis
GET    /api/v1/optimization/xyz-analysis

# 季節性分析
GET    /api/v1/analytics/seasonality/{bookId}
GET    /api/v1/analytics/trend-analysis

# デッドストック分析
GET    /api/v1/analytics/dead-stock
GET    /api/v1/analytics/slow-moving
```

#### 4.2.4 棚卸しAPI
```
# 棚卸しセッション管理
GET    /api/v1/stocktaking/sessions
POST   /api/v1/stocktaking/sessions
GET    /api/v1/stocktaking/sessions/{id}
PUT    /api/v1/stocktaking/sessions/{id}
DELETE /api/v1/stocktaking/sessions/{id}

# 棚卸し実行
POST   /api/v1/stocktaking/sessions/{id}/start
POST   /api/v1/stocktaking/sessions/{id}/record-count
POST   /api/v1/stocktaking/sessions/{id}/complete

# 差異分析
GET    /api/v1/stocktaking/sessions/{id}/variances
GET    /api/v1/stocktaking/sessions/{id}/variance-report

# 在庫調整適用
POST   /api/v1/stocktaking/sessions/{id}/apply-adjustments
```

### 4.3 フロントエンド実装

#### 4.3.1 新規コンポーネント設計
```javascript
// 高度な在庫管理画面
<AdvancedInventoryManagement />
├── <BarcodeScanner />              // バーコードスキャン
├── <StockTransferDialog />         // 在庫移動
├── <BulkOperationsPanel />         // 一括操作
├── <InventoryReservations />       // 在庫予約管理
├── <TransactionHistory />          // 取引履歴
└── <RealTimeInventoryGrid />       // リアルタイム在庫一覧

// 発注管理画面
<PurchaseOrderManagement />
├── <AutoOrderDashboard />          // 自動発注ダッシュボード
├── <OrderSuggestions />            // 発注提案
├── <PurchaseOrderForm />           // 発注書作成
├── <SupplierCatalog />             // サプライヤーカタログ
├── <OrderApprovalWorkflow />       // 承認ワークフロー
└── <DeliveryTracking />            // 配送追跡

// 予測・分析画面
<ForecastAnalytics />
├── <DemandForecastChart />         // 需要予測グラフ
├── <ABCAnalysisMatrix />           // ABC分析マトリックス
├── <SeasonalityAnalysis />         // 季節性分析
├── <OptimalStockCalculator />      // 最適在庫計算機
├── <DeadStockAnalysis />           // デッドストック分析
└── <ForecastAccuracyReport />      // 予測精度レポート

// 棚卸し管理画面
<StocktakingManagement />
├── <StocktakingScheduler />        // 棚卸しスケジューラー
├── <MobileStocktakingApp />        // モバイル棚卸しアプリ
├── <VarianceAnalysisReport />      // 差異分析レポート
├── <StocktakingApproval />         // 棚卸し承認
└── <AdjustmentApplication />       // 調整適用
```

#### 4.3.2 モバイル対応
```javascript
// PWA対応のモバイルアプリ
<MobileInventoryApp />
├── <MobileBarcodeScanner />        // カメラ機能活用
├── <OfflineDataSync />             // オフライン同期
├── <MobileStocktaking />           // モバイル棚卸し
├── <MobileReceiving />             // モバイル入荷処理
└── <MobileInventoryLookup />       // 在庫照会

// カメラAPI統合
const BarcodeScanner = () => {
  const [scanning, setScanning] = useState(false);
  
  const handleScan = useCallback(async (barcode) => {
    try {
      const result = await inventoryApi.processBarcodeScanned(barcode);
      // 処理結果の表示
    } catch (error) {
      // エラーハンドリング
    }
  }, []);
  
  return (
    <Box>
      <BarcodeReader
        onScan={handleScan}
        scanning={scanning}
      />
    </Box>
  );
};
```

### 4.4 データベース設計

#### 4.4.1 新規テーブル設計
```sql
-- 在庫トランザクション履歴
CREATE TABLE inventory_transactions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    inventory_id BIGINT NOT NULL,
    transaction_type VARCHAR(20) NOT NULL, -- RECEIVE, SELL, ADJUST, TRANSFER, RESERVE
    quantity INTEGER NOT NULL,
    before_quantity INTEGER NOT NULL,
    after_quantity INTEGER NOT NULL,
    reason TEXT,
    batch_number VARCHAR(50),
    reference_number VARCHAR(50),
    executed_by BIGINT,
    approved_by BIGINT,
    executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMP,
    status VARCHAR(20) DEFAULT 'PENDING', -- PENDING, APPROVED, REJECTED, CANCELLED
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (inventory_id) REFERENCES inventory(id),
    INDEX idx_inventory_transactions_inventory_id (inventory_id),
    INDEX idx_inventory_transactions_executed_at (executed_at),
    INDEX idx_inventory_transactions_type (transaction_type)
);

-- 発注管理強化
CREATE TABLE purchase_orders (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    supplier_id BIGINT NOT NULL,
    order_type VARCHAR(20) NOT NULL, -- AUTO, MANUAL, EMERGENCY
    status VARCHAR(20) NOT NULL DEFAULT 'DRAFT', -- DRAFT, PENDING, APPROVED, SENT, RECEIVED, CLOSED
    total_amount DECIMAL(12,2),
    expected_delivery_date DATE,
    actual_delivery_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMP,
    created_by BIGINT,
    approved_by BIGINT,
    INDEX idx_purchase_orders_supplier (supplier_id),
    INDEX idx_purchase_orders_status (status),
    INDEX idx_purchase_orders_created_at (created_at)
);

CREATE TABLE purchase_order_items (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    purchase_order_id BIGINT NOT NULL,
    book_id BIGINT NOT NULL,
    ordered_quantity INTEGER NOT NULL,
    received_quantity INTEGER DEFAULT 0,
    unit_price DECIMAL(10,2),
    total_price DECIMAL(12,2),
    notes TEXT,
    FOREIGN KEY (purchase_order_id) REFERENCES purchase_orders(id),
    FOREIGN KEY (book_id) REFERENCES books(id)
);

-- サプライヤー管理
CREATE TABLE suppliers (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE,
    contact_person VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    lead_time_days INTEGER DEFAULT 7,
    minimum_order_amount DECIMAL(10,2),
    payment_terms VARCHAR(100),
    rating DECIMAL(3,2), -- 1.00-5.00
    status VARCHAR(20) DEFAULT 'ACTIVE', -- ACTIVE, INACTIVE, SUSPENDED
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 需要予測
CREATE TABLE demand_forecasts (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    book_id BIGINT NOT NULL,
    forecast_date DATE NOT NULL,
    forecast_quantity INTEGER NOT NULL,
    confidence_level DECIMAL(5,4), -- 0.0000-1.0000
    forecast_model VARCHAR(50), -- ARIMA, LINEAR_REGRESSION, NEURAL_NETWORK
    model_parameters JSON,
    actual_quantity INTEGER,
    accuracy DECIMAL(5,4),
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    valid_until TIMESTAMP,
    FOREIGN KEY (book_id) REFERENCES books(id),
    INDEX idx_demand_forecasts_book_date (book_id, forecast_date),
    INDEX idx_demand_forecasts_generated_at (generated_at)
);

-- 棚卸し管理
CREATE TABLE stocktaking_sessions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    session_number VARCHAR(50) UNIQUE NOT NULL,
    type VARCHAR(20) NOT NULL, -- FULL, PARTIAL, CYCLE
    status VARCHAR(20) NOT NULL DEFAULT 'PLANNED', -- PLANNED, IN_PROGRESS, COMPLETED, APPROVED
    planned_date DATE,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    approved_at TIMESTAMP,
    supervisor_id BIGINT,
    notes TEXT,
    total_variance_count INTEGER DEFAULT 0,
    total_variance_value DECIMAL(12,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_stocktaking_sessions_planned_date (planned_date),
    INDEX idx_stocktaking_sessions_status (status)
);

CREATE TABLE stocktaking_items (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    session_id BIGINT NOT NULL,
    inventory_id BIGINT NOT NULL,
    system_quantity INTEGER NOT NULL,
    counted_quantity INTEGER,
    variance_quantity INTEGER GENERATED ALWAYS AS (counted_quantity - system_quantity),
    variance_value DECIMAL(10,2),
    reason_code VARCHAR(20), -- DAMAGED, LOST, THEFT, MISCOUNT, OTHER
    notes TEXT,
    counted_by BIGINT,
    counted_at TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES stocktaking_sessions(id),
    FOREIGN KEY (inventory_id) REFERENCES inventory(id)
);

-- 在庫予約・引当
CREATE TABLE inventory_reservations (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    inventory_id BIGINT NOT NULL,
    order_id BIGINT,
    customer_id BIGINT,
    reserved_quantity INTEGER NOT NULL,
    reservation_type VARCHAR(20), -- ORDER, MANUAL, PROMOTION
    reserved_until TIMESTAMP,
    status VARCHAR(20) DEFAULT 'ACTIVE', -- ACTIVE, RELEASED, EXPIRED
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    released_at TIMESTAMP,
    FOREIGN KEY (inventory_id) REFERENCES inventory(id),
    INDEX idx_inventory_reservations_inventory (inventory_id),
    INDEX idx_inventory_reservations_status (status)
);

-- 在庫ロック管理
CREATE TABLE inventory_locks (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    inventory_id BIGINT NOT NULL,
    lock_reason VARCHAR(100),
    locked_by BIGINT,
    locked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    unlocked_at TIMESTAMP,
    status VARCHAR(20) DEFAULT 'ACTIVE', -- ACTIVE, RELEASED
    FOREIGN KEY (inventory_id) REFERENCES inventory(id),
    INDEX idx_inventory_locks_inventory (inventory_id),
    INDEX idx_inventory_locks_status (status)
);
```

#### 4.4.2 既存テーブル拡張
```sql
-- inventory テーブル拡張
ALTER TABLE inventory ADD COLUMN minimum_stock_level INTEGER DEFAULT 0;
ALTER TABLE inventory ADD COLUMN maximum_stock_level INTEGER;
ALTER TABLE inventory ADD COLUMN safety_stock_level INTEGER DEFAULT 0;
ALTER TABLE inventory ADD COLUMN abc_classification VARCHAR(1); -- A, B, C
ALTER TABLE inventory ADD COLUMN xyz_classification VARCHAR(1); -- X, Y, Z
ALTER TABLE inventory ADD COLUMN last_stocktaking_date DATE;
ALTER TABLE inventory ADD COLUMN average_lead_time_days INTEGER DEFAULT 7;
ALTER TABLE inventory ADD COLUMN supplier_id BIGINT;
ALTER TABLE inventory ADD COLUMN shelf_life_days INTEGER;
ALTER TABLE inventory ADD COLUMN expiry_date DATE;
ALTER TABLE inventory ADD COLUMN is_locked BOOLEAN DEFAULT FALSE;
ALTER TABLE inventory ADD COLUMN lock_reason VARCHAR(100);

-- books テーブル拡張（在庫管理観点）
ALTER TABLE books ADD COLUMN weight_grams INTEGER;
ALTER TABLE books ADD COLUMN dimensions VARCHAR(50); -- "height x width x depth"
ALTER TABLE books ADD COLUMN storage_requirements TEXT;
ALTER TABLE books ADD COLUMN seasonality_factor DECIMAL(3,2) DEFAULT 1.0;
ALTER TABLE books ADD COLUMN trend_factor DECIMAL(3,2) DEFAULT 1.0;
```

## 5. 実装計画

### 5.1 段階的実装アプローチ

#### Phase 1: 基盤機能強化 (4週間)
**優先度: 最高**

**Week 1-2: コア機能拡張**
- 在庫トランザクション履歴システム実装
- 基本的な在庫移動機能
- 在庫予約・引当機能
- API基盤強化

**Week 3-4: ワークフロー改善**
- 入荷検品プロセス実装
- 承認ワークフロー基盤
- バーコードスキャン基本機能
- モバイル対応基盤

**成果物:**
- 在庫トランザクション管理API
- 在庫移動・予約機能
- 基本ワークフロー
- モバイル基盤

#### Phase 2: 発注管理高度化 (3週間)
**優先度: 高**

**Week 5-6: 発注システム強化**
- PurchaseOrder エンティティ実装
- 自動発注基本ロジック
- サプライヤー管理機能
- 発注承認ワークフロー

**Week 7: 統合・連携機能**
- EDI基本連携
- 外部API統合基盤
- 通知システム強化

**成果物:**
- 発注管理システム
- サプライヤー連携基盤
- 自動発注機能

#### Phase 3: 予測・分析機能 (4週間)
**優先度: 高**

**Week 8-9: 需要予測基盤**
- 基本的な需要予測アルゴリズム実装
- ABC/XYZ分析機能
- 最適在庫レベル計算
- データ分析基盤

**Week 10-11: 高度な分析機能**
- 機械学習モデル統合
- 季節性・トレンド分析
- デッドストック分析
- 予測精度評価

**成果物:**
- 需要予測システム
- 高度な在庫分析機能
- 最適化アルゴリズム

#### Phase 4: 棚卸し・完全性管理 (3週間)
**優先度: 中**

**Week 12-13: 棚卸し機能実装**
- 棚卸しセッション管理
- モバイル棚卸しアプリ
- 差異分析機能
- 在庫精度管理

**Week 14: 統合・最適化**
- システム全体統合
- パフォーマンス最適化
- ユーザビリティ改善

**成果物:**
- 完全な棚卸しシステム
- モバイルアプリ
- 統合されたシステム

#### Phase 5: 高度な統合・自動化 (2週間)
**優先度: 中**

**Week 15-16: 高度機能実装**
- 高度なEDI統合
- 完全自動発注システム
- 高度な予測モデル
- レポート機能拡張

**成果物:**
- 完全自動化システム
- 高度な統合機能
- 包括的レポート

### 5.2 開発リソース計画

#### 5.2.1 開発チーム構成
- **プロジェクトマネージャー**: 1名（全期間）
- **バックエンド開発者**: 2名（全期間）
- **フロントエンド開発者**: 2名（全期間）
- **データサイエンティスト**: 1名（Phase 3中心）
- **QAエンジニア**: 1名（Phase 2以降）
- **DevOpsエンジニア**: 1名（Phase 4以降）

#### 5.2.2 技術スタック
- **バックエンド**: Java 8, Spring Boot 2.3.x, Spring Data JPA
- **フロントエンド**: React 16.13.x, Material-UI 4.x, Redux
- **データベース**: PostgreSQL 12.x（本番）
- **機械学習**: Python, scikit-learn, TensorFlow
- **統合**: REST API, Apache Kafka（メッセージング）
- **モバイル**: PWA, Service Worker, Camera API

### 5.3 マイルストーン・検収基準

#### 5.3.1 Phase 1 検収基準
- [ ] 在庫トランザクション履歴が完全に記録される
- [ ] 在庫移動が正確に処理される
- [ ] バーコードスキャンが正常に動作する
- [ ] モバイル端末からアクセス可能
- [ ] すべてのAPI応答時間が要件を満たす

#### 5.3.2 Phase 2 検収基準
- [ ] 自動発注提案が正確に生成される
- [ ] 発注承認ワークフローが動作する
- [ ] サプライヤーとの基本連携が可能
- [ ] 発注書が自動生成される
- [ ] 在庫予測精度が70%以上

#### 5.3.3 Phase 3 検収基準
- [ ] 需要予測精度が75%以上
- [ ] ABC/XYZ分析が正確に実行される
- [ ] 最適在庫レベルが算出される
- [ ] 季節性分析が機能する
- [ ] デッドストック特定が正確

#### 5.3.4 Phase 4 検収基準
- [ ] 棚卸し差異が1%以下
- [ ] モバイル棚卸しアプリが安定動作
- [ ] 在庫精度が98%以上
- [ ] 差異原因分析が可能
- [ ] 調整処理が正確

#### 5.3.5 Phase 5 検収基準
- [ ] 完全自動発注が安全に動作
- [ ] 外部システム統合が安定
- [ ] 予測精度が85%以上
- [ ] レポート生成時間が要件内
- [ ] システム全体が統合済み

## 6. 運用・保守計画

### 6.1 システム監視

#### 6.1.1 監視項目
- **パフォーマンス監視**
  - API応答時間
  - データベースパフォーマンス
  - 予測モデル実行時間
  - システムリソース使用率

- **ビジネスメトリクス監視**
  - 在庫精度率
  - 予測精度
  - 欠品率
  - 過剰在庫率

#### 6.1.2 アラート設定
- 在庫精度低下アラート（<95%）
- 予測精度低下アラート（<75%）
- システム応答時間異常
- データ整合性エラー

### 6.2 継続的改善

#### 6.2.1 モデル改善
- **月次モデル再学習**
- **予測精度評価レポート**
- **新しいアルゴリズム検証**
- **外部データソース統合検討**

#### 6.2.2 機能拡張計画
- **Year 1**: AI予測精度向上、サプライヤー統合拡大
- **Year 2**: IoTセンサー統合、完全自動化
- **Year 3**: ブロックチェーン活用、グローバル展開

## 7. リスク管理

### 7.1 技術的リスク
- **レガシーシステム制約**: 段階的移行で対応
- **データ品質問題**: データクレンジング実施
- **統合複雑性**: APIファースト設計で対応
- **スケーラビリティ**: マイクロサービス化検討

### 7.2 ビジネスリスク
- **ユーザー受入**: 十分な研修・サポート
- **運用変更**: 段階的ロールアウト
- **ROI実現**: KPI継続監視
- **競合対応**: 継続的機能強化

### 7.3 リスク軽減策
- **プロトタイプ検証**: 各Phase開始前
- **ユーザーフィードバック**: 定期的収集・反映
- **バックアップ計画**: 旧システム並行運用
- **専門家サポート**: 外部コンサルタント活用

## 8. 成功指標（KPI）

### 8.1 定量的指標

#### 8.1.1 効率性指標
- **在庫コスト削減**: 20-30%削減
- **欠品率改善**: 現行5% → 目標3%以下
- **過剰在庫削減**: 現行15% → 目標10%以下
- **作業時間削減**: 在庫関連業務50%削減

#### 8.1.2 精度指標
- **在庫精度**: 98%以上維持
- **需要予測精度**: 85%以上達成
- **発注精度**: 在庫切れ発生率3%以下
- **棚卸し精度**: 差異率1%以下

#### 8.1.3 システム指標
- **応答時間**: 在庫照会100ms以内
- **可用性**: 99.5%以上
- **データ整合性**: 100%維持
- **ユーザー満足度**: 4.0/5.0以上

### 8.2 定性的指標
- **ユーザビリティ向上**: 操作手順簡素化
- **意思決定支援**: データドリブン運営実現
- **競争優位性**: 業界ベンチマーク上位達成
- **技術革新**: 最新技術活用実現

## 9. 結論

この在庫管理機能アップグレードにより、TechBookStore は現代的なeコマース・小売業界標準に適合した包括的な在庫最適化ソリューションを実現できます。

### 9.1 期待される成果
1. **運用効率の劇的向上**: 自動化により作業時間50%削減
2. **コスト最適化**: 在庫コスト20-30%削減、欠品率3%以下実現
3. **予測精度向上**: AI活用により需要予測精度85%以上達成
4. **競争優位性確立**: 業界先進的な在庫管理システム構築

### 9.2 実装推奨事項
1. **段階的アプローチ**: リスク最小化のため5Phase構成で実装
2. **ユーザー中心設計**: 現場オペレーション効率を最優先
3. **データドリブン**: 継続的な改善サイクル確立
4. **技術革新**: 将来拡張性を考慮した設計

この包括的なアップグレードにより、TechBookStore は技術専門書店として業界をリードする先進的な在庫管理システムを構築し、持続的な競争優位性を確立できるでしょう。
