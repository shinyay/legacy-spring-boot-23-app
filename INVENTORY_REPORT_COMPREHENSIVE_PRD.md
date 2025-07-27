# 在庫レポート機能 完全実装 PRD (Product Requirements Document)

## ドキュメント情報
- **作成日**: 2025年7月27日
- **対象システム**: TechBookStore 在庫管理システム
- **機能領域**: 在庫レポート・分析機能
- **実装ターゲット**: 段階的実装（基盤強化 → 高度分析）

---

## 1. エグゼクティブサマリー

### 1.1 目的
TechBookStoreの在庫レポート機能を現在の基本的なレポートから、技術専門書店に特化した高度で包括的な在庫分析・最適化システムに発展させる。現在の在庫レポートは基本的な表示機能にとどまっており、技術書特有の在庫特性や市場動向を反映した深い分析機能が不足している。

### 1.2 現状分析と課題

#### 既存実装状況（分析結果）
✅ **実装済み機能**
- 基本在庫レポート（`InventoryReport.js`）
- 在庫サマリー情報（総商品数、低在庫、欠品、総在庫金額）
- 基本的な在庫回転率表示
- カテゴリ別回転率グラフ
- 在庫詳細テーブル（商品別在庫状況）
- 発注提案機能（緊急度別）
- 在庫回転率サマリー

✅ **データモデル基盤**
- `InventoryReportDto` クラス（完全実装）
- `InventoryAnalysisDto` クラス（高度分析用、実装済み）
- `Inventory` エンティティ（店頭・倉庫分離管理）
- `InventoryTransaction` エンティティ（取引履歴）
- APIエンドポイント（`/api/v1/reports/inventory`）

❌ **不足・改善が必要な機能**

1. **分析機能の深度不足**
   - ABC/XYZ分析の未実装
   - デッドストック詳細分析の不足
   - 技術陳腐化リスク評価の未対応
   - 季節性分析の未実装

2. **技術専門書店特化機能の欠如**
   - 技術トレンドと在庫の関連分析
   - 技術レベル別在庫最適化
   - 出版年ベースの陳腐化リスク管理
   - 技術カテゴリ別投資収益率分析

3. **予測・最適化機能の未実装**
   - 需要予測アルゴリズム
   - 最適在庫レベル自動計算
   - 発注タイミング最適化
   - 機会損失計算

4. **レポートの柔軟性不足**
   - フィルタリング・ドリルダウン機能
   - カスタムレポート作成
   - 詳細分析ダッシュボード
   - エクスポート機能の充実

### 1.3 ビジネス価値・期待効果

**短期効果（3ヶ月以内）**
- 在庫精度向上: 95% → 98%
- デッドストック削減: 15% → 8%
- 発注精度向上: 70% → 85%

**中期効果（6-12ヶ月）**
- 在庫回転率向上: 3.2回/年 → 4.5回/年
- 在庫コスト削減: 20-25%
- 欠品率削減: 5% → 2%以下

**長期効果（12ヶ月以降）**
- 予測精度向上: 85%以上
- 技術トレンド先行投資による売上増: 15-20%
- 陳腐化リスク管理による損失削減: 年間200万円

---

## 2. 機能要件詳細

### 2.1 基盤強化・改善要件

#### 2.1.1 既存在庫レポートの拡張
**現在の実装**: `InventoryReport.js`を基盤として以下を強化

**KPI拡張**
```javascript
// 現在のKPI
- 総商品数
- 低在庫アイテム数
- 欠品アイテム数  
- 総在庫金額

// 追加KPI
- 平均在庫回転率
- デッドストック率（%）
- 在庫精度率（%）
- 技術カテゴリ別回転率ランキング
- 陳腐化リスク指数
```

**詳細分析タブの追加**
```javascript
<Tabs>
  <Tab label="在庫サマリー" />           // 既存
  <Tab label="回転率分析" />             // 強化
  <Tab label="ABC/XYZ分析" />           // 新規
  <Tab label="デッドストック分析" />      // 強化
  <Tab label="陳腐化リスク分析" />        // 新規
  <Tab label="発注最適化" />             // 強化
  <Tab label="予測分析" />              // 新規
</Tabs>
```

#### 2.1.2 フィルタリング・ドリルダウン機能
```javascript
// フィルタリングオプション
const filterOptions = {
  techCategory: ['Java', 'Python', 'React', 'AWS', 'AI/ML'],
  techLevel: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'],
  publisher: ['O\'Reilly', '翔泳社', '技術評論社'],
  publicationYear: [2024, 2023, 2022, '2021以前'],
  stockStatus: ['NORMAL', 'LOW', 'CRITICAL', 'OVERSTOCK'],
  priceRange: ['~3000', '3000-5000', '5000+']
};
```

### 2.2 高度分析機能

#### 2.2.1 ABC/XYZ分析
**活用**: 既存の`InventoryAnalysisDto`クラスを拡張

**ABC分析（売上貢献度別）**
- A: 売上上位20%（戦略商品）
- B: 売上中位60%（標準商品）  
- C: 売上下位20%（管理商品）

**XYZ分析（需要変動性別）**
- X: 安定需要（変動係数 < 0.5）
- Y: 変動需要（変動係数 0.5-1.0）
- Z: 不規則需要（変動係数 > 1.0）

**マトリックス分析結果**
```javascript
const abcXyzMatrix = {
  'AX': { strategy: '重点管理', stockLevel: 'HIGH', orderFrequency: 'WEEKLY' },
  'AY': { strategy: '需要予測強化', stockLevel: 'MEDIUM_HIGH', orderFrequency: 'BI_WEEKLY' },
  'AZ': { strategy: '機会損失回避', stockLevel: 'SAFETY_STOCK', orderFrequency: 'ON_DEMAND' },
  'BX': { strategy: '効率管理', stockLevel: 'MEDIUM', orderFrequency: 'MONTHLY' },
  'BY': { strategy: '標準管理', stockLevel: 'MEDIUM', orderFrequency: 'MONTHLY' },
  'BZ': { strategy: '柔軟対応', stockLevel: 'LOW_MEDIUM', orderFrequency: 'QUARTERLY' },
  'CX': { strategy: '最小管理', stockLevel: 'LOW', orderFrequency: 'QUARTERLY' },
  'CY': { strategy: '見直し対象', stockLevel: 'MINIMAL', orderFrequency: 'ON_DEMAND' },
  'CZ': { strategy: '廃止検討', stockLevel: 'LIQUIDATE', orderFrequency: 'NONE' }
};
```

#### 2.2.2 デッドストック詳細分析
**強化**: 既存の`DeadStockItem`を拡張

```java
public class EnhancedDeadStockItem extends DeadStockItem {
    private String techLifecycleStage;      // 技術ライフサイクル段階
    private BigDecimal depreciationRate;    // 減価償却率
    private String disposalRecommendation;  // 処分推奨方法
    private BigDecimal expectedLoss;        // 予想損失額
    private Integer daysToObsolescence;     // 陳腐化までの日数
    private String mitigationOptions;       // 対応オプション
}
```

**処分戦略**
```javascript
const disposalStrategies = {
  'DISCOUNT_SALE': {
    condition: 'daysSinceLastSale <= 90 && techStage == "MATURE"',
    discount: '20-30%',
    expectedRecovery: '70-80%'
  },
  'BULK_SALE': {
    condition: 'daysSinceLastSale > 90 && quantity > 10',
    discount: '40-50%',
    expectedRecovery: '50-60%'
  },
  'RETURN_TO_SUPPLIER': {
    condition: 'returnPolicy.eligible && daysSinceLastSale <= 180',
    cost: '返送料',
    expectedRecovery: '90-95%'
  },
  'LIQUIDATION': {
    condition: 'daysSinceLastSale > 180 && techStage == "DECLINING"',
    expectedRecovery: '10-30%'
  }
};
```

#### 2.2.3 技術陳腐化リスク分析
**活用**: 既存の`TechObsolescenceItem`を強化

```java
public class TechObsolescenceAnalysis {
    // 技術ライフサイクル判定
    public TechLifecycleStage analyzeTechLifecycle(String techCategory) {
        // EMERGING, GROWTH, MATURE, DECLINING の判定ロジック
    }
    
    // 陳腐化リスクスコア計算
    public ObsolescenceRisk calculateRisk(Book book) {
        // 出版年、技術カテゴリ、市場トレンドを考慮
    }
    
    // 対応戦略提案
    public List<MitigationStrategy> suggestMitigations(ObsolescenceRisk risk) {
        // リスクレベルに応じた対応策提案
    }
}
```

**リスク指標**
```javascript
const obsolescenceIndicators = {
  publicationAge: {
    weight: 0.3,
    thresholds: { low: 1, medium: 2, high: 3 } // 年数
  },
  techTrendScore: {
    weight: 0.4,
    source: 'techTrendAnalysis', // 既存の技術トレンド分析連携
    thresholds: { declining: -0.5, stable: 0, growing: 0.5 }
  },
  marketDemand: {
    weight: 0.2,
    metrics: ['searchVolume', 'jobPostings', 'communityActivity']
  },
  competitorActivity: {
    weight: 0.1,
    metrics: ['newPublications', 'priceMovements']
  }
};
```

#### 2.2.4 季節性・周期性分析
**新規実装**: `SeasonalInventoryTrend`を活用

```java
public class SeasonalAnalysisService {
    
    // 季節性パターン分析
    public SeasonalPattern analyzeSeasonality(String techCategory, int years) {
        // 過去データから季節性パターンを抽出
    }
    
    // 需要予測（季節性考慮）
    public SeasonalForecast generateSeasonalForecast(Long bookId, int months) {
        // 季節性を考慮した需要予測
    }
    
    // 在庫調整提案
    public List<SeasonalAdjustment> suggestSeasonalAdjustments() {
        // 季節に応じた在庫調整提案
    }
}
```

**技術専門書特有の季節性**
```javascript
const techBookSeasonality = {
  'SPRING': {
    // 新学期・新年度需要
    peakCategories: ['BEGINNER_PROGRAMMING', 'WEB_DEVELOPMENT'],
    demandIncrease: 1.4,
    duration: 'March-May'
  },
  'SUMMER': {
    // 夏休み学習需要
    peakCategories: ['AI_ML', 'DATA_SCIENCE', 'CLOUD'],
    demandIncrease: 1.2,
    duration: 'June-August'
  },
  'FALL': {
    // 資格試験・転職需要
    peakCategories: ['CERTIFICATION', 'SYSTEM_DESIGN'],
    demandIncrease: 1.3,
    duration: 'September-November'
  },
  'WINTER': {
    // 年末年始学習需要
    peakCategories: ['YEAR_END_LEARNING', 'NEW_TECH'],
    demandIncrease: 1.1,
    duration: 'December-February'
  }
};
```

### 2.3 予測・最適化機能

#### 2.3.1 需要予測システム
**アルゴリズム実装**

```java
@Service
public class DemandForecastService {
    
    // 複数アルゴリズムによる予測
    public ForecastResult generateForecast(Long bookId, ForecastParams params) {
        
        // 1. 移動平均法
        ForecastResult movingAverage = calculateMovingAverage(bookId, params);
        
        // 2. 指数平滑法
        ForecastResult exponentialSmoothing = calculateExponentialSmoothing(bookId, params);
        
        // 3. 線形回帰
        ForecastResult linearRegression = calculateLinearRegression(bookId, params);
        
        // 4. 季節性調整
        ForecastResult seasonalAdjusted = adjustForSeasonality(bookId, params);
        
        // 5. アンサンブル予測（重み付き平均）
        return createEnsembleForecast(Arrays.asList(
            movingAverage, exponentialSmoothing, linearRegression, seasonalAdjusted
        ));
    }
    
    // 予測精度評価
    public ForecastAccuracy evaluateAccuracy(Long bookId, LocalDate fromDate, LocalDate toDate) {
        // MAE, MAPE, RMSE などの精度指標計算
    }
}
```

**外部要因統合**
```javascript
const externalFactors = {
  techTrends: {
    source: 'techTrendAnalysis',
    weight: 0.3,
    impact: 'demandMultiplier'
  },
  marketEvents: {
    conferenceSchedules: ['JavaOne', 'PyCon', 'AWS re:Invent'],
    productReleases: ['Language Versions', 'Framework Updates'],
    weight: 0.2
  },
  economicIndicators: {
    itSpending: 'quarterlyData',
    employmentRate: 'monthlyData',
    weight: 0.1
  },
  academicCalendar: {
    examPeriods: ['spring', 'fall'],
    vacationPeriods: ['summer', 'winter'],
    weight: 0.15
  }
};
```

#### 2.3.2 最適在庫レベル計算
**経済発注量（EOQ）の技術書特化版**

```java
public class OptimalStockCalculator {
    
    // 技術書特化EOQ計算
    public OptimalStockLevel calculateOptimalStock(Long bookId, OptimizationParams params) {
        
        // 基本EOQ
        double basicEOQ = Math.sqrt((2 * params.getAnnualDemand() * params.getOrderingCost()) 
                                   / params.getHoldingCost());
        
        // 技術陳腐化リスク調整
        double obsolescenceAdjustment = calculateObsolescenceAdjustment(bookId);
        
        // 需要変動性調整
        double variabilityAdjustment = calculateVariabilityAdjustment(bookId);
        
        // 技術トレンド調整
        double trendAdjustment = calculateTrendAdjustment(bookId);
        
        // 最終最適在庫レベル
        double adjustedEOQ = basicEOQ * obsolescenceAdjustment * variabilityAdjustment * trendAdjustment;
        
        return new OptimalStockLevel(adjustedEOQ, calculateReorderPoint(bookId), 
                                   calculateSafetyStock(bookId));
    }
    
    // 安全在庫計算（技術書特有のリスク考慮）
    private double calculateSafetyStock(Long bookId) {
        // リードタイム変動、需要変動、供給リスクを考慮
    }
}
```

#### 2.3.3 発注最適化システム
**インテリジェント発注提案の強化**

```java
public class IntelligentOrderingService {
    
    // 統合発注提案
    public List<OrderSuggestion> generateIntelligentSuggestions(OrderingCriteria criteria) {
        
        List<OrderSuggestion> suggestions = new ArrayList<>();
        
        // 1. 緊急発注（欠品リスク回避）
        suggestions.addAll(generateUrgentOrders());
        
        // 2. 戦略的発注（技術トレンド連動）
        suggestions.addAll(generateStrategicOrders());
        
        // 3. 季節性発注（需要予測ベース）
        suggestions.addAll(generateSeasonalOrders());
        
        // 4. 最適化発注（コスト効率重視）
        suggestions.addAll(generateOptimizedOrders());
        
        // 予算制約・容量制約を考慮して最適化
        return optimizeWithConstraints(suggestions, criteria);
    }
    
    // 発注タイミング最適化
    public OrderTiming optimizeOrderTiming(Long bookId, OrderParams params) {
        // 需要予測、価格変動、供給状況を考慮した最適タイミング算出
    }
}
```

### 2.4 レポート可視化・UI強化

#### 2.4.1 ダッシュボード強化
**メインダッシュボード**: `InventoryReport.js`を拡張

```javascript
// 新しいコンポーネント構成
const EnhancedInventoryReport = () => {
  return (
    <Container>
      {/* KPI Summary - 強化版 */}
      <KPISummaryCards />
      
      {/* Quick Actions */}
      <QuickActionPanel />
      
      {/* Interactive Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <ABCXYZMatrix />
        </Grid>
        <Grid item xs={12} md={6}>
          <TurnoverAnalysisChart />
        </Grid>
        <Grid item xs={12} md={6}>
          <ObsolescenceRiskHeatmap />
        </Grid>
        <Grid item xs={12} md={6}>
          <SeasonalTrendChart />
        </Grid>
      </Grid>
      
      {/* Detailed Analysis Tabs */}
      <AnalysisTabs />
      
      {/* Action Items */}
      <ActionItemsPanel />
    </Container>
  );
};
```

#### 2.4.2 インタラクティブチャート
```javascript
// ABC/XYZ分析マトリックス
const ABCXYZMatrix = () => (
  <ResponsiveContainer width="100%" height={400}>
    <ScatterChart data={abcXyzData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis 
        dataKey="demandVariability" 
        name="需要変動性"
        domain={[0, 2]}
        tickFormatter={(value) => value < 0.5 ? 'X(安定)' : value < 1.0 ? 'Y(変動)' : 'Z(不規則)'}
      />
      <YAxis 
        dataKey="salesContribution" 
        name="売上貢献度"
        domain={[0, 100]}
        tickFormatter={(value) => value > 80 ? 'A(高)' : value > 20 ? 'B(中)' : 'C(低)'}
      />
      <Tooltip content={<CustomABCXYZTooltip />} />
      <Scatter name="商品" dataKey="y" fill="#8884d8" />
    </ScatterChart>
  </ResponsiveContainer>
);

// 陳腐化リスクヒートマップ
const ObsolescenceRiskHeatmap = () => (
  <ResponsiveContainer width="100%" height={300}>
    <Treemap
      data={obsolescenceData}
      dataKey="inventoryValue"
      ratio={4/3}
      stroke="#fff"
      fill="#8884d8"
      content={<ObsolescenceCell />}
    />
  </ResponsiveContainer>
);
```

#### 2.4.3 アクションアイテムパネル
```javascript
const ActionItemsPanel = ({ analysisData }) => {
  const actionItems = [
    {
      type: 'URGENT_ORDER',
      priority: 'HIGH',
      title: '緊急発注推奨',
      items: analysisData.urgentOrders,
      action: '発注処理実行'
    },
    {
      type: 'DEAD_STOCK',
      priority: 'MEDIUM',
      title: 'デッドストック処理',
      items: analysisData.deadStockItems,
      action: '処分戦略実行'
    },
    {
      type: 'OBSOLESCENCE_RISK',
      priority: 'MEDIUM',
      title: '陳腐化リスク対応',
      items: analysisData.obsolescenceRisk,
      action: 'リスク軽減策実行'
    },
    {
      type: 'OPTIMIZATION',
      priority: 'LOW',
      title: '在庫最適化',
      items: analysisData.optimizationSuggestions,
      action: '最適化実行'
    }
  ];

  return (
    <Card>
      <CardHeader title="要対応アイテム" />
      <CardContent>
        {actionItems.map((item, index) => (
          <ActionItemCard key={index} {...item} />
        ))}
      </CardContent>
    </Card>
  );
};
```

---

## 3. 技術仕様

### 3.1 システムアーキテクチャ

#### 3.1.1 既存システムとの統合
```
在庫レポートシステム
├── Frontend (React)
│   ├── InventoryReport.js (既存・拡張)
│   ├── InventoryAnalysisPage.js (既存・活用)
│   └── 新規コンポーネント
│       ├── ABCXYZAnalysis.js
│       ├── DeadStockAnalysis.js
│       ├── ObsolescenceRiskAnalysis.js
│       ├── SeasonalAnalysis.js
│       ├── ForecastAnalysis.js
│       └── OptimizationDashboard.js
├── Backend (Spring Boot)
│   ├── ReportService.java (既存・拡張)
│   ├── AnalyticsService.java (既存・活用)
│   └── 新規サービス
│       ├── DemandForecastService.java
│       ├── OptimalStockCalculator.java
│       ├── SeasonalAnalysisService.java
│       └── IntelligentOrderingService.java
└── データベース
    ├── 既存テーブル (inventory, inventory_transactions)
    └── 新規テーブル
        ├── demand_forecasts
        ├── abc_xyz_analysis
        ├── obsolescence_assessments
        └── seasonal_patterns
```

#### 3.1.2 新規エンティティ設計
```java
// 需要予測データ
@Entity
@Table(name = "demand_forecasts")
public class DemandForecast {
    private Long id;
    private Long bookId;
    private LocalDate forecastDate;
    private Integer predictedDemand;
    private String algorithm;
    private Double confidence;
    private String parameters;
    private LocalDateTime createdAt;
}

// ABC/XYZ分析結果
@Entity
@Table(name = "abc_xyz_analysis")
public class ABCXYZAnalysis {
    private Long id;
    private Long bookId;
    private String abcCategory; // A, B, C
    private String xyzCategory; // X, Y, Z
    private BigDecimal salesContribution;
    private BigDecimal demandVariability;
    private String recommendedStrategy;
    private LocalDate analysisDate;
}

// 陳腐化リスク評価
@Entity
@Table(name = "obsolescence_assessments")
public class ObsolescenceAssessment {
    private Long id;
    private Long bookId;
    private String riskLevel; // HIGH, MEDIUM, LOW
    private Integer monthsToObsolescence;
    private BigDecimal riskScore;
    private String mitigationStrategy;
    private LocalDate assessmentDate;
}
```

### 3.2 API設計

#### 3.2.1 在庫レポートAPI拡張
```java
@RestController
@RequestMapping("/api/v1/reports/inventory")
public class EnhancedInventoryReportController {
    
    // 基本レポート（既存・強化）
    @GetMapping("")
    public ResponseEntity<InventoryReportDto> getInventoryReport(
        @RequestParam(required = false) String category,
        @RequestParam(required = false) String level,
        @RequestParam(required = false) String publisher) {
        // フィルタリング機能付きレポート
    }
    
    // ABC/XYZ分析
    @GetMapping("/abc-xyz")
    public ResponseEntity<ABCXYZAnalysisDto> getABCXYZAnalysis(
        @RequestParam(required = false) String category) {
        // ABC/XYZ分析結果
    }
    
    // デッドストック詳細分析
    @GetMapping("/dead-stock")
    public ResponseEntity<DeadStockAnalysisDto> getDeadStockAnalysis(
        @RequestParam(defaultValue = "90") Integer daysSinceLastSale,
        @RequestParam(required = false) String riskLevel) {
        // デッドストック詳細分析
    }
    
    // 陳腐化リスク分析
    @GetMapping("/obsolescence-risk")
    public ResponseEntity<ObsolescenceRiskDto> getObsolescenceRisk(
        @RequestParam(required = false) String category,
        @RequestParam(required = false) String riskLevel) {
        // 技術陳腐化リスク分析
    }
    
    // 季節性分析
    @GetMapping("/seasonal")
    public ResponseEntity<SeasonalAnalysisDto> getSeasonalAnalysis(
        @RequestParam(required = false) String season,
        @RequestParam(defaultValue = "2") Integer years) {
        // 季節性・周期性分析
    }
    
    // 需要予測
    @GetMapping("/forecast")
    public ResponseEntity<DemandForecastDto> getDemandForecast(
        @RequestParam(required = false) Long bookId,
        @RequestParam(defaultValue = "3") Integer months,
        @RequestParam(defaultValue = "ENSEMBLE") String algorithm) {
        // 需要予測結果
    }
    
    // 最適在庫レベル
    @GetMapping("/optimal-stock")
    public ResponseEntity<OptimalStockDto> getOptimalStock(
        @RequestParam(required = false) Long bookId,
        @RequestParam(required = false) String category) {
        // 最適在庫レベル計算結果
    }
    
    // インテリジェント発注提案
    @GetMapping("/order-suggestions")
    public ResponseEntity<OrderSuggestionsDto> getOrderSuggestions(
        @RequestParam(required = false) String priority,
        @RequestParam(required = false) BigDecimal budget,
        @RequestParam(required = false) String type) {
        // 高度発注提案
    }
}
```

#### 3.2.2 分析API
```java
@RestController
@RequestMapping("/api/v1/analytics/inventory")
public class InventoryAnalyticsController {
    
    // 包括的在庫分析（既存・活用）
    @GetMapping("/comprehensive")
    public ResponseEntity<InventoryAnalysisDto> getComprehensiveAnalysis(
        @RequestParam(required = false) String categoryCode,
        @RequestParam(defaultValue = "FULL") String analysisType) {
        // 既存のAnalyticsServiceを活用
    }
    
    // 予測精度評価
    @GetMapping("/forecast-accuracy")
    public ResponseEntity<ForecastAccuracyDto> getForecastAccuracy(
        @RequestParam LocalDate fromDate,
        @RequestParam LocalDate toDate,
        @RequestParam(required = false) String algorithm) {
        // 予測精度評価結果
    }
    
    // 在庫パフォーマンス分析
    @GetMapping("/performance")
    public ResponseEntity<InventoryPerformanceDto> getPerformanceAnalysis(
        @RequestParam LocalDate fromDate,
        @RequestParam LocalDate toDate) {
        // 在庫パフォーマンス分析
    }
}
```

### 3.3 データベース設計

#### 3.3.1 新規テーブル
```sql
-- 需要予測テーブル
CREATE TABLE demand_forecasts (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    book_id BIGINT NOT NULL,
    forecast_date DATE NOT NULL,
    forecast_period INTEGER NOT NULL, -- 予測期間（月）
    predicted_demand INTEGER NOT NULL,
    algorithm VARCHAR(50) NOT NULL,
    confidence_score DECIMAL(5,4),
    parameters JSON,
    actual_demand INTEGER,
    accuracy_score DECIMAL(5,4),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (book_id) REFERENCES books(id),
    INDEX idx_demand_forecasts_book_date (book_id, forecast_date),
    INDEX idx_demand_forecasts_algorithm (algorithm),
    INDEX idx_demand_forecasts_created (created_at)
);

-- ABC/XYZ分析テーブル
CREATE TABLE abc_xyz_analysis (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    book_id BIGINT NOT NULL,
    analysis_date DATE NOT NULL,
    abc_category CHAR(1) NOT NULL CHECK (abc_category IN ('A', 'B', 'C')),
    xyz_category CHAR(1) NOT NULL CHECK (xyz_category IN ('X', 'Y', 'Z')),
    sales_contribution DECIMAL(5,2) NOT NULL, -- 売上貢献度(%)
    demand_variability DECIMAL(5,2) NOT NULL, -- 需要変動係数
    revenue_ranking INTEGER,
    volume_ranking INTEGER,
    recommended_strategy VARCHAR(100),
    stock_level_recommendation VARCHAR(50),
    order_frequency_recommendation VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (book_id) REFERENCES books(id),
    UNIQUE KEY uk_abc_xyz_book_date (book_id, analysis_date),
    INDEX idx_abc_xyz_category (abc_category, xyz_category),
    INDEX idx_abc_xyz_date (analysis_date)
);

-- 陳腐化リスク評価テーブル
CREATE TABLE obsolescence_assessments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    book_id BIGINT NOT NULL,
    assessment_date DATE NOT NULL,
    risk_level VARCHAR(20) NOT NULL, -- HIGH, MEDIUM, LOW
    risk_score DECIMAL(5,2) NOT NULL, -- 0-100のリスクスコア
    tech_lifecycle_stage VARCHAR(20), -- EMERGING, GROWTH, MATURE, DECLINING
    months_to_obsolescence INTEGER,
    publication_age_months INTEGER,
    tech_trend_score DECIMAL(5,2),
    market_demand_score DECIMAL(5,2),
    mitigation_strategy TEXT,
    recommended_action VARCHAR(50), -- HOLD, DISCOUNT, LIQUIDATE, RETURN
    estimated_loss DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (book_id) REFERENCES books(id),
    INDEX idx_obsolescence_book_date (book_id, assessment_date),
    INDEX idx_obsolescence_risk (risk_level),
    INDEX idx_obsolescence_lifecycle (tech_lifecycle_stage)
);

-- 季節性パターンテーブル
CREATE TABLE seasonal_patterns (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    tech_category_code VARCHAR(50) NOT NULL,
    season VARCHAR(20) NOT NULL, -- SPRING, SUMMER, FALL, WINTER
    demand_multiplier DECIMAL(4,2) NOT NULL, -- 季節性倍数
    peak_months JSON, -- ピーク月のリスト
    demand_variance DECIMAL(5,2),
    historical_years INTEGER NOT NULL, -- 分析対象年数
    confidence_level DECIMAL(5,2),
    pattern_stability VARCHAR(20), -- STABLE, VARIABLE, VOLATILE
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_seasonal_category_season (tech_category_code, season),
    INDEX idx_seasonal_category (tech_category_code),
    INDEX idx_seasonal_season (season)
);

-- 在庫最適化設定テーブル
CREATE TABLE optimal_stock_settings (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    book_id BIGINT NOT NULL,
    calculation_date DATE NOT NULL,
    optimal_stock_level INTEGER NOT NULL,
    reorder_point INTEGER NOT NULL,
    safety_stock INTEGER NOT NULL,
    economic_order_quantity INTEGER,
    holding_cost_rate DECIMAL(5,4),
    ordering_cost DECIMAL(8,2),
    obsolescence_factor DECIMAL(4,3), -- 陳腐化調整係数
    trend_factor DECIMAL(4,3), -- トレンド調整係数
    seasonality_factor DECIMAL(4,3), -- 季節性調整係数
    variability_factor DECIMAL(4,3), -- 変動性調整係数
    valid_from DATE NOT NULL,
    valid_to DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (book_id) REFERENCES books(id),
    INDEX idx_optimal_stock_book_date (book_id, calculation_date),
    INDEX idx_optimal_stock_valid (valid_from, valid_to)
);
```

---

## 4. 実装方針（段階的アプローチ）

### 4.1 Phase 1: 基盤強化（2週間）
**目標**: 既存機能の拡張・改善

**Week 1: UI/UX強化**
- 既存`InventoryReport.js`のフィルタリング機能追加
- KPI拡張（回転率、デッドストック率等）
- ドリルダウン機能実装
- エクスポート機能強化

**Week 2: バックエンド拡張**
- `ReportService.generateInventoryReport()`の強化
- フィルタリングロジック実装
- パフォーマンス最適化
- APIレスポンス形式統一

**成果物**:
- 強化された在庫レポート画面
- フィルタリング・ソート機能
- 改善されたKPI表示
- エクスポート機能（Excel/PDF）

### 4.2 Phase 2: 高度分析実装（3週間）
**目標**: ABC/XYZ分析、デッドストック分析、陳腐化リスク分析

**Week 3: ABC/XYZ分析**
- `ABCXYZAnalysisService`実装
- データベーステーブル作成
- マトリックス可視化コンポーネント
- 戦略提案ロジック

**Week 4-5: デッドストック・陳腐化分析**
- 既存`InventoryAnalysisDto`活用・拡張
- 処分戦略アルゴリズム実装
- 技術ライフサイクル判定ロジック
- リスクスコア計算エンジン

**成果物**:
- ABC/XYZ分析機能
- 高度デッドストック分析
- 技術陳腐化リスク評価
- インタラクティブ分析ダッシュボード

### 4.3 Phase 3: 予測・最適化（4週間）
**目標**: 需要予測、最適在庫計算、インテリジェント発注

**Week 6-7: 需要予測システム**
- 複数アルゴリズム実装（移動平均、指数平滑、線形回帰）
- 季節性調整ロジック
- 予測精度評価システム
- 外部要因統合

**Week 8-9: 最適化エンジン**
- 経済発注量計算（技術書特化版）
- 安全在庫計算
- 制約条件最適化
- コスト効率分析

**成果物**:
- 需要予測システム
- 最適在庫レベル計算機能
- インテリジェント発注提案
- 予測精度ダッシュボード

### 4.4 Phase 4: 統合・最適化（2週間）
**目標**: システム統合、パフォーマンス最適化、ユーザビリティ向上

**Week 10: システム統合**
- 全機能の統合テスト
- データ整合性確保
- API最適化
- キャッシュ戦略実装

**Week 11: 最終調整**
- ユーザビリティ改善
- パフォーマンスチューニング
- ドキュメント完成
- トレーニング資料作成

**成果物**:
- 完全統合された在庫レポートシステム
- パフォーマンス最適化
- ユーザーマニュアル
- 運用ガイド

---

## 5. 検収基準

### 5.1 機能検収基準

#### 5.1.1 基本機能
- [ ] **在庫レポート表示**: 1秒以内でレポート表示
- [ ] **フィルタリング**: カテゴリ・レベル・出版社別フィルタが正常動作
- [ ] **KPI計算**: 回転率・デッドストック率が正確に計算される
- [ ] **エクスポート**: Excel/PDF形式で正常出力

#### 5.1.2 分析機能
- [ ] **ABC/XYZ分析**: 売上データから正確な分類が行われる
- [ ] **デッドストック分析**: 90日基準で正確にデッドストックを識別
- [ ] **陳腐化リスク**: 技術カテゴリ・出版年から適切なリスク評価
- [ ] **季節性分析**: 過去2年のデータから季節パターンを抽出

#### 5.1.3 予測・最適化機能
- [ ] **需要予測精度**: MAPE 20%以下（3ヶ月予測）
- [ ] **最適在庫計算**: EOQ計算が技術書特性を反映
- [ ] **発注提案**: 予算・容量制約下で最適提案を生成
- [ ] **リアルタイム更新**: 在庫変動時に1分以内で分析結果更新

### 5.2 パフォーマンス基準
- [ ] **レポート生成時間**: 10,000商品で5秒以内
- [ ] **分析処理時間**: ABC/XYZ分析10秒以内
- [ ] **予測計算時間**: 100商品の3ヶ月予測30秒以内
- [ ] **同時利用者**: 50ユーザー同時アクセス時もレスポンス劣化なし

### 5.3 精度基準
- [ ] **在庫数の精度**: 誤差0.1%以内
- [ ] **回転率計算**: 手動計算との差異5%以内
- [ ] **ABC分析**: パレートの法則に基づく正確な分類
- [ ] **陳腐化リスク**: 専門家評価との一致率80%以上

### 5.4 ユーザビリティ基準
- [ ] **直感的操作**: 新規ユーザーが30分以内で基本操作習得
- [ ] **レスポンシブ対応**: タブレット・モバイルで正常表示
- [ ] **アクセシビリティ**: WCAG 2.1 AAレベル準拠
- [ ] **多言語対応**: 日本語・英語での表示切替

---

## 6. リスクと対策

### 6.1 技術的リスク

#### 6.1.1 パフォーマンスリスク
**リスク**: 大量データ処理時のレスポンス劣化
**対策**: 
- インデックス最適化
- キャッシュ戦略（Redis活用）
- 非同期処理実装
- ページネーション導入

#### 6.1.2 データ精度リスク
**リスク**: 複雑な計算での精度劣化
**対策**:
- 段階的検証システム
- 手動計算との比較テスト
- 専門家によるロジック監査
- 計算過程の透明性確保

#### 6.1.3 システム統合リスク
**リスク**: 既存システムとの整合性問題
**対策**:
- 段階的統合アプローチ
- 既存機能の後方互換性維持
- 包括的統合テスト
- ロールバック計画策定

### 6.2 運用リスク

#### 6.2.1 ユーザー採用リスク
**リスク**: 複雑な機能による利用率低下
**対策**:
- 段階的機能公開
- 充実したトレーニング
- ユーザーフィードバック収集
- UI/UX継続改善

#### 6.2.2 メンテナンスリスク
**リスク**: 複雑システムの保守困難
**対策**:
- モジュラー設計採用
- 詳細技術ドキュメント
- 自動化テスト充実
- 監視システム構築

---

## 7. 成功指標・ROI測定

### 7.1 定量的指標

#### 7.1.1 効率指標
- **在庫回転率向上**: 3.2回/年 → 4.5回/年（40%向上）
- **デッドストック削減**: 15% → 5%（65%削減）
- **発注精度向上**: 70% → 90%（28%向上）
- **欠品率削減**: 5% → 2%（60%削減）

#### 7.1.2 コスト指標
- **在庫コスト削減**: 年間500万円削減
- **機会損失削減**: 年間300万円削減
- **人件費削減**: 分析作業50%削減（年間200万円）
- **廃棄損失削減**: 年間150万円削減

#### 7.1.3 品質指標
- **在庫精度向上**: 95% → 99%
- **予測精度**: MAPE 15%以下達成
- **分析作業時間**: 80%削減
- **意思決定速度**: 2倍向上

### 7.2 ROI計算

#### 7.2.1 投資額
- **開発コスト**: 1,200万円（11週間 × 2名 × 55万円/月）
- **インフラコスト**: 年間120万円
- **保守・運用**: 年間300万円
- **初年度総投資**: 1,620万円

#### 7.2.2 年間効果
- **在庫最適化**: 500万円/年
- **機会損失削減**: 300万円/年
- **人件費削減**: 200万円/年
- **廃棄損失削減**: 150万円/年
- **年間総効果**: 1,150万円/年

#### 7.2.3 ROI指標
- **投資回収期間**: 1.4年
- **3年間ROI**: 142%
- **NPV（3年）**: 1,785万円
- **IRR**: 68%

---

## 8. 結論・推奨事項

### 8.1 実装推奨事項

1. **段階的実装の実行**: 11週間の段階的アプローチで着実に実装
2. **既存システム活用**: `InventoryAnalysisDto`等の既存実装を最大活用
3. **技術専門書特化**: 一般的な在庫管理ではなく技術書特有の特性を重視
4. **ユーザー中心設計**: 複雑な分析機能を直感的に操作できるUI設計

### 8.2 期待される成果

#### 短期成果（3ヶ月）
- 在庫の可視性向上による意思決定品質改善
- デッドストック早期発見による損失削減
- 発注精度向上による効率化

#### 中期成果（6-12ヶ月）
- 需要予測精度向上による在庫最適化
- 技術トレンド連動による競争優位性確立
- 陳腐化リスク管理による安定収益

#### 長期成果（1年以降）
- AI活用高度予測による業界先行
- データドリブン経営基盤確立
- 持続的成長可能な在庫戦略構築

### 8.3 成功の鍵

1. **データ品質**: 正確な在庫・売上データの継続的維持
2. **ユーザー教育**: 充実したトレーニングによる機能活用促進
3. **継続改善**: ユーザーフィードバックに基づく機能改善
4. **技術追随**: 新しい分析手法・技術の継続的導入

---

**このPRDに基づいて、Coding Agentによる段階的実装を開始することを推奨します。**
