# 技術トレンドレポート機能 PRD (Product Requirements Document)

## 1. 概要

### 1.1 背景・目的
TechBookStore（技術専門書店在庫管理システム）において、技術専門書店の最大の競争優位性である**技術トレンドの先読み能力**を強化する包括的な技術トレンド分析・レポート機能を実装する。

技術書の特性として、技術の陳腐化が早く、新技術の出現により既存技術の需要が急激に変化するため、これらのトレンドを正確に把握し、在庫戦略・商品戦略に活用することが書店経営の生命線となる。

### 1.2 技術制約・前提条件
- **レガシー技術スタック**: Java 8, Spring Boot 2.3.12, React 16.13.1, Material-UI 4.11.4
- **既存データベース**: 完全な書籍・注文・顧客・在庫データが存在
- **既存機能**: 顧客管理機能（Phase 1完了）、基本レポート基盤（一部実装済み）
- **技術カテゴリ体系**: 階層化された技術カテゴリ管理システム既存

### 1.3 スコープ
**対象範囲**:
- 技術カテゴリ別トレンド分析・予測
- 技術ライフサイクル管理（新興→成長→成熟→衰退）
- 競合技術関係分析
- 技術学習パス分析
- 新興技術早期発見システム
- 技術投資推奨システム

**対象外**:
- 外部API連携（GitHub、Stack Overflow等）
- 機械学習による高度予測
- リアルタイムストリーミング分析

## 2. 機能要件

### 2.1 技術カテゴリトレンド分析

#### 2.1.1 基本トレンド分析
**売上ベーストレンド分析**:
- 月次・四半期・年次技術カテゴリ別売上推移
- 前年同期比成長率算出（自動計算）
- 成長率に基づく技術カテゴリランキング
- トレンド方向性判定（上昇・安定・下降・急降下）

**技術普及段階分析**:
- 新刊発売頻度による技術成熟度判定
- 技術レベル別（BEGINNER/INTERMEDIATE/ADVANCED）売上構成比
- 技術普及曲線（S字カーブ）における現在位置推定

#### 2.1.2 高度トレンド分析
**関連技術影響分析**:
- 技術相関マトリックス生成（同時購入される技術組み合わせ）
- 代替技術関係検出（排他的関係にある技術）
- 補完技術関係検出（相互促進する技術）

**技術習得パス分析**:
- 顧客の購買順序から技術学習ルート抽出
- 推奨技術学習ロードマップ生成
- 次に学ぶべき技術推奨システム

### 2.2 技術ライフサイクル管理

#### 2.2.1 ライフサイクル段階判定
**4段階ライフサイクル**:
1. **EMERGING (新興期)**: 新刊発売開始、初期採用者による購買
2. **GROWTH (成長期)**: 売上急伸、多様なレベルの書籍発売
3. **MATURITY (成熟期)**: 売上安定、ADVANCED書籍増加
4. **DECLINE (衰退期)**: 売上減少、新刊減少、在庫過多

**段階判定アルゴリズム**:
```
判定要素:
- 月次売上成長率（前年同期比）
- 新刊発売頻度
- 技術レベル別書籍構成比
- 平均在庫回転率
- 顧客購買頻度
```

#### 2.2.2 ライフサイクル予測
**段階遷移予測**:
- 現在段階での滞在期間予測
- 次段階への遷移時期予測（月単位）
- 遷移確率算出

**投資推奨システム**:
- EMERGING: 「積極投資推奨」
- GROWTH: 「拡大投資推奨」
- MATURITY: 「維持投資推奨」
- DECLINE: 「縮小投資推奨」

### 2.3 新興技術早期発見システム

#### 2.3.1 新興技術検出
**検出アルゴリズム**:
```
新興技術検出条件:
1. 過去3ヶ月以内に初回新刊発売
2. 初月売上が予想を上回る
3. 関連技術との相関が検出される
4. 顧客購買パターンに変化
```

**新興度スコア算出**:
- 新刊発売タイミング (30%)
- 初期売上パフォーマンス (25%)
- 顧客関心度（アクセス数等） (20%)
- 関連技術トレンド (25%)

#### 2.3.2 技術陳腐化予測
**陳腐化リスク指標**:
- 売上減少率（連続3ヶ月以上）
- 新刊発売停滞（6ヶ月以上新刊なし）
- 代替技術の成長率
- 在庫滞留期間

### 2.4 競合・代替技術分析

#### 2.4.1 技術競合関係マップ
**競合関係分析**:
- 直接競合技術（同一課題解決）
- 間接競合技術（異なるアプローチで同一結果）
- 補完技術（組み合わせ利用）

**マーケットシェア分析**:
- 技術カテゴリ内での相対的シェア
- シェア変動トレンド
- 新規参入技術のシェア獲得速度

#### 2.4.2 代替技術影響評価
**代替リスク評価**:
- 新技術による既存技術への影響度
- 段階的置き換えリスク vs 急激な置き換えリスク
- 代替完了までの予想期間

### 2.5 レポート出力・可視化

#### 2.5.1 ダッシュボード機能
**技術トレンド総合ダッシュボード**:
- 急上昇技術TOP5（成長率順）
- 注意技術TOP3（下降率順）
- 新興技術アラート
- ライフサイクル分布円グラフ

**詳細分析画面**:
- 技術カテゴリ別詳細トレンドチャート
- 技術相関関係ヒートマップ
- 技術ライフサイクル時系列表示
- 競合技術比較チャート

#### 2.5.2 アラート・通知機能
**自動アラート生成**:
- 急成長技術検出（成長率30%超）
- 急降下技術警告（下降率20%超）
- 新興技術発見通知
- ライフサイクル段階変更通知

## 3. 技術要件

### 3.1 バックエンド実装（Spring Boot 2.3.x）

#### 3.1.1 新規エンティティ設計
```java
// 技術トレンド分析結果保存
@Entity
@Table(name = "tech_trend_analysis")
public class TechTrendAnalysis {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "analysis_date", nullable = false)
    private LocalDate analysisDate;
    
    @ManyToOne
    @JoinColumn(name = "tech_category_id")
    private TechCategory techCategory;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "lifecycle_stage")
    private LifecycleStage lifecycleStage;
    
    @Column(name = "growth_rate", precision = 5, scale = 2)
    private BigDecimal growthRate;
    
    @Column(name = "trend_direction", length = 20)
    private String trendDirection; // RISING, STABLE, DECLINING
    
    @Column(name = "trend_confidence", length = 10)
    private String trendConfidence; // HIGH, MEDIUM, LOW
    
    @Column(name = "emerging_score", precision = 5, scale = 2)
    private BigDecimal emergingScore;
    
    @Column(name = "obsolescence_risk", precision = 5, scale = 2)
    private BigDecimal obsolescenceRisk;
    
    @Column(columnDefinition = "TEXT")
    private String trendAnalysis; // AI generated analysis text
    
    @Column(columnDefinition = "TEXT")
    private String investmentRecommendation;
    
    public enum LifecycleStage {
        EMERGING, GROWTH, MATURITY, DECLINE
    }
}

// 技術関連性分析
@Entity
@Table(name = "tech_relationships")
public class TechRelationship {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "primary_tech_id")
    private TechCategory primaryTech;
    
    @ManyToOne
    @JoinColumn(name = "related_tech_id")
    private TechCategory relatedTech;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "relationship_type")
    private RelationshipType relationshipType;
    
    @Column(name = "correlation_strength", precision = 5, scale = 2)
    private BigDecimal correlationStrength; // 0.0 to 1.0
    
    @Column(name = "analysis_date")
    private LocalDate analysisDate;
    
    public enum RelationshipType {
        COMPLEMENTARY, // 補完関係
        COMPETITIVE,   // 競合関係
        PREREQUISITE,  // 前提技術
        SUCCESSOR     // 後継技術
    }
}
```

#### 3.1.2 サービス層実装
```java
@Service
@Transactional(readOnly = true)
public class TechTrendAnalysisService {
    
    /**
     * 技術カテゴリの包括的トレンド分析実行
     */
    public TechCategoryAnalysisDto analyzeTechCategoryTrend(String categoryCode) {
        TechCategory category = techCategoryRepository.findByCategoryCode(categoryCode)
            .orElseThrow(() -> new EntityNotFoundException("Tech category not found"));
            
        TechCategoryAnalysisDto analysis = new TechCategoryAnalysisDto();
        analysis.setCategoryInfo(category);
        
        // 基本メトリクス計算
        analysis.setMetrics(calculateBasicMetrics(category));
        
        // トレンド分析
        analysis.setTrend(analyzeTrend(category));
        
        // ライフサイクル分析
        analysis.setLifecycle(analyzeLifecycle(category));
        
        // 関連技術分析
        analysis.setRelatedTechnologies(analyzeRelatedTechnologies(category));
        
        // 投資推奨生成
        analysis.setInvestmentRecommendation(generateInvestmentAdvice(analysis));
        
        return analysis;
    }
    
    /**
     * 新興技術検出アルゴリズム
     */
    public List<EmergingTechDto> detectEmergingTechnologies() {
        LocalDate analysisDate = LocalDate.now();
        LocalDate threeMonthsAgo = analysisDate.minusMonths(3);
        
        // 過去3ヶ月以内に新刊が発売された技術を抽出
        List<TechCategory> recentTechnologies = techCategoryRepository
            .findCategoriesWithRecentBooks(threeMonthsAgo);
            
        return recentTechnologies.stream()
            .map(this::calculateEmergingScore)
            .filter(tech -> tech.getEmergingScore().compareTo(EMERGING_THRESHOLD) > 0)
            .sorted((a, b) -> b.getEmergingScore().compareTo(a.getEmergingScore()))
            .limit(10)
            .collect(Collectors.toList());
    }
    
    /**
     * 技術ライフサイクル段階判定
     */
    private LifecycleStage determineLifecycleStage(TechCategory category) {
        TechCategoryMetrics metrics = calculateBasicMetrics(category);
        
        BigDecimal growthRate = metrics.getGrowthRate();
        int bookCount = metrics.getTotalBooks();
        BigDecimal inventoryTurnover = metrics.getInventoryTurnover();
        
        // 判定ロジック
        if (growthRate.compareTo(new BigDecimal("50")) > 0 && bookCount < 10) {
            return LifecycleStage.EMERGING;
        } else if (growthRate.compareTo(new BigDecimal("20")) > 0) {
            return LifecycleStage.GROWTH;
        } else if (growthRate.compareTo(new BigDecimal("-10")) > 0) {
            return LifecycleStage.MATURITY;
        } else {
            return LifecycleStage.DECLINE;
        }
    }
    
    /**
     * 技術関連性分析
     */
    private List<TechRelationshipDto> analyzeRelatedTechnologies(TechCategory category) {
        // 同時購入パターン分析
        List<TechRelationshipDto> relationships = new ArrayList<>();
        
        // 補完技術分析（よく一緒に購入される技術）
        List<Object[]> complementaryTechs = orderRepository
            .findComplementaryTechnologies(category.getId());
            
        complementaryTechs.forEach(result -> {
            Long relatedTechId = (Long) result[0];
            BigDecimal correlation = (BigDecimal) result[1];
            
            TechCategory relatedTech = techCategoryRepository.findById(relatedTechId).orElse(null);
            if (relatedTech != null && correlation.compareTo(new BigDecimal("0.3")) > 0) {
                relationships.add(new TechRelationshipDto(
                    relatedTech, 
                    RelationshipType.COMPLEMENTARY, 
                    correlation
                ));
            }
        });
        
        return relationships;
    }
}

@Service
public class TechTrendReportService {
    
    /**
     * 技術トレンド総合レポート生成
     */
    public TechTrendReportDto generateTechTrendReport(TechTrendReportRequest request) {
        TechTrendReportDto report = new TechTrendReportDto();
        
        // 期間設定
        LocalDate endDate = request.getEndDate() != null ? 
            request.getEndDate() : LocalDate.now();
        LocalDate startDate = endDate.minusMonths(request.getAnalysisPeriodMonths());
        
        // 各セクション生成
        report.setOverview(generateTrendOverview(startDate, endDate));
        report.setRisingTechnologies(findRisingTechnologies(startDate, endDate));
        report.setDecliningTechnologies(findDecliningTechnologies(startDate, endDate));
        report.setEmergingTechnologies(detectEmergingTechnologies());
        report.setLifecycleDistribution(analyzeLifecycleDistribution());
        report.setTechCorrelations(generateTechCorrelationMatrix());
        report.setInvestmentRecommendations(generateInvestmentRecommendations());
        
        return report;
    }
    
    /**
     * 技術投資推奨生成
     */
    private List<TechInvestmentRecommendationDto> generateInvestmentRecommendations() {
        List<TechInvestmentRecommendationDto> recommendations = new ArrayList<>();
        
        // EMERGING技術への投資推奨
        List<EmergingTechDto> emergingTechs = detectEmergingTechnologies();
        emergingTechs.forEach(tech -> {
            recommendations.add(new TechInvestmentRecommendationDto(
                tech.getCategoryCode(),
                tech.getCategoryName(),
                InvestmentAction.INCREASE_INVENTORY,
                Priority.HIGH,
                "新興技術として高成長が期待されます。早期在庫確保を推奨。",
                tech.getPredictedGrowthRate()
            ));
        });
        
        // DECLINE技術の在庫削減推奨
        List<TechCategoryTrendDto> decliningTechs = findDecliningTechnologies(
            LocalDate.now().minusMonths(6), LocalDate.now());
        decliningTechs.forEach(tech -> {
            recommendations.add(new TechInvestmentRecommendationDto(
                tech.getCategoryCode(),
                tech.getCategoryName(),
                InvestmentAction.REDUCE_INVENTORY,
                Priority.MEDIUM,
                "需要減少傾向のため、在庫削減を検討してください。",
                tech.getGrowthRate()
            ));
        });
        
        return recommendations;
    }
}
```

#### 3.1.3 APIエンドポイント設計
```java
@RestController
@RequestMapping("/api/tech-trends")
@CrossOrigin(origins = "http://localhost:3000")
public class TechTrendController {
    
    /**
     * 技術トレンド総合レポート取得
     */
    @GetMapping("/report")
    public ResponseEntity<TechTrendReportDto> getTechTrendReport(
            @RequestParam(defaultValue = "12") int analysisMonths,
            @RequestParam(required = false) String categoryFilter,
            @RequestParam(defaultValue = "false") boolean includeSubCategories) {
        
        TechTrendReportRequest request = TechTrendReportRequest.builder()
            .analysisPeriodMonths(analysisMonths)
            .categoryFilter(categoryFilter)
            .includeSubCategories(includeSubCategories)
            .build();
            
        TechTrendReportDto report = techTrendReportService.generateTechTrendReport(request);
        return ResponseEntity.ok(report);
    }
    
    /**
     * 特定技術カテゴリの詳細分析
     */
    @GetMapping("/categories/{categoryCode}/analysis")
    public ResponseEntity<TechCategoryAnalysisDto> getTechCategoryAnalysis(
            @PathVariable String categoryCode) {
        
        TechCategoryAnalysisDto analysis = techTrendAnalysisService
            .analyzeTechCategoryTrend(categoryCode);
        return ResponseEntity.ok(analysis);
    }
    
    /**
     * 新興技術検出結果
     */
    @GetMapping("/emerging")
    public ResponseEntity<List<EmergingTechDto>> getEmergingTechnologies(
            @RequestParam(defaultValue = "10") int limit) {
        
        List<EmergingTechDto> emergingTechs = techTrendAnalysisService
            .detectEmergingTechnologies()
            .stream()
            .limit(limit)
            .collect(Collectors.toList());
            
        return ResponseEntity.ok(emergingTechs);
    }
    
    /**
     * 技術関連性マトリックス
     */
    @GetMapping("/correlations")
    public ResponseEntity<TechCorrelationMatrixDto> getTechCorrelations(
            @RequestParam(required = false) List<String> categoryCodes,
            @RequestParam(defaultValue = "0.3") double minCorrelation) {
        
        TechCorrelationMatrixDto matrix = techTrendAnalysisService
            .generateTechCorrelationMatrix(categoryCodes, minCorrelation);
        return ResponseEntity.ok(matrix);
    }
    
    /**
     * 技術ライフサイクル分布
     */
    @GetMapping("/lifecycle-distribution")
    public ResponseEntity<TechLifecycleDistributionDto> getLifecycleDistribution() {
        TechLifecycleDistributionDto distribution = techTrendAnalysisService
            .analyzeLifecycleDistribution();
        return ResponseEntity.ok(distribution);
    }
    
    /**
     * 技術投資推奨
     */
    @GetMapping("/investment-recommendations")
    public ResponseEntity<List<TechInvestmentRecommendationDto>> getInvestmentRecommendations(
            @RequestParam(defaultValue = "HIGH,MEDIUM") List<String> priorities) {
        
        List<TechInvestmentRecommendationDto> recommendations = techTrendReportService
            .generateInvestmentRecommendations()
            .stream()
            .filter(rec -> priorities.contains(rec.getPriority().toString()))
            .collect(Collectors.toList());
            
        return ResponseEntity.ok(recommendations);
    }
}
```

### 3.2 フロントエンド実装（React 16.13.x + Material-UI 4.11.4）

#### 3.2.1 メインコンポーネント構成
```javascript
// 技術トレンドレポートメインページ
// /reports/tech-trends
const TechTrendReportPage = () => {
  const [trendReport, setTrendReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analysisMonths, setAnalysisMonths] = useState(12);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    loadTechTrendReport();
  }, [analysisMonths, selectedCategory]);

  const loadTechTrendReport = async () => {
    try {
      setLoading(true);
      const params = {
        analysisMonths,
        categoryFilter: selectedCategory !== 'all' ? selectedCategory : null
      };
      const response = await api.get('/tech-trends/report', { params });
      setTrendReport(response.data);
    } catch (error) {
      console.error('Failed to load tech trend report:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className={classes.root}>
      <Box mb={3}>
        <Typography variant="h4" gutterBottom>
          技術トレンドレポート
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          技術専門書店のための包括的技術動向分析
        </Typography>
      </Box>

      {/* 分析期間・フィルター設定 */}
      <TechTrendReportControls
        analysisMonths={analysisMonths}
        onAnalysisMonthsChange={setAnalysisMonths}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {/* 概要サマリー */}
      <TechTrendOverview overview={trendReport?.overview} />

      {/* 主要セクション */}
      <Grid container spacing={3}>
        {/* 急上昇技術 */}
        <Grid item xs={12} md={6}>
          <RisingTechnologiesPanel 
            technologies={trendReport?.risingTechnologies} 
          />
        </Grid>

        {/* 衰退技術警告 */}
        <Grid item xs={12} md={6}>
          <DecliningTechnologiesPanel 
            technologies={trendReport?.decliningTechnologies} 
          />
        </Grid>

        {/* 新興技術発見 */}
        <Grid item xs={12} lg={8}>
          <EmergingTechnologiesPanel 
            technologies={trendReport?.emergingTechnologies} 
          />
        </Grid>

        {/* ライフサイクル分布 */}
        <Grid item xs={12} lg={4}>
          <TechLifecycleDistributionChart 
            distribution={trendReport?.lifecycleDistribution} 
          />
        </Grid>

        {/* 技術相関マトリックス */}
        <Grid item xs={12}>
          <TechCorrelationHeatmap 
            correlations={trendReport?.techCorrelations} 
          />
        </Grid>

        {/* 投資推奨 */}
        <Grid item xs={12}>
          <TechInvestmentRecommendations 
            recommendations={trendReport?.investmentRecommendations} 
          />
        </Grid>
      </Grid>
    </div>
  );
};
```

#### 3.2.2 詳細分析コンポーネント
```javascript
// 技術カテゴリ詳細分析
const TechCategoryDetailAnalysis = ({ categoryCode }) => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategoryAnalysis();
  }, [categoryCode]);

  const loadCategoryAnalysis = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/tech-trends/categories/${categoryCode}/analysis`);
      setAnalysis(response.data);
    } catch (error) {
      console.error('Failed to load category analysis:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!analysis) return <ErrorMessage />;

  return (
    <div>
      {/* カテゴリ基本情報 */}
      <TechCategoryHeader 
        category={analysis.categoryInfo}
        metrics={analysis.metrics}
        lifecycle={analysis.lifecycle}
      />

      <Grid container spacing={3}>
        {/* トレンドチャート */}
        <Grid item xs={12} lg={8}>
          <TechCategoryTrendChart 
            categoryAnalysis={analysis}
            showDetailedMetrics={true}
          />
        </Grid>

        {/* ライフサイクル詳細 */}
        <Grid item xs={12} lg={4}>
          <TechLifecycleDetailCard 
            lifecycle={analysis.lifecycle} 
          />
        </Grid>

        {/* 関連技術ネットワーク */}
        <Grid item xs={12} md={6}>
          <RelatedTechnologiesNetwork 
            relationships={analysis.relatedTechnologies} 
          />
        </Grid>

        {/* 投資推奨詳細 */}
        <Grid item xs={12} md={6}>
          <TechInvestmentAdviceCard 
            recommendation={analysis.investmentRecommendation} 
          />
        </Grid>

        {/* サブカテゴリ分析 */}
        {analysis.subCategories && (
          <Grid item xs={12}>
            <SubCategoryAnalysisTable 
              subCategories={analysis.subCategories} 
            />
          </Grid>
        )}
      </Grid>
    </div>
  );
};

// 新興技術パネル
const EmergingTechnologiesPanel = ({ technologies }) => {
  const classes = useStyles();

  return (
    <Card className={classes.emergingPanel}>
      <CardHeader
        title="新興技術発見"
        subheader="高成長ポテンシャルを持つ技術"
        avatar={<TrendingUp style={{ color: '#4caf50' }} />}
      />
      <CardContent>
        {technologies && technologies.length > 0 ? (
          <List>
            {technologies.slice(0, 5).map((tech, index) => (
              <ListItem key={tech.categoryCode} divider={index < 4}>
                <ListItemAvatar>
                  <Avatar className={classes.emergingAvatar}>
                    {index + 1}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center">
                      <Typography variant="subtitle1" component="span">
                        {tech.categoryName}
                      </Typography>
                      <Chip
                        size="small"
                        label={`スコア: ${tech.emergingScore.toFixed(1)}`}
                        className={classes.scoreChip}
                        style={{ marginLeft: 8 }}
                      />
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="textSecondary">
                        予想成長率: +{tech.predictedGrowthRate?.toFixed(1)}%
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {tech.description}
                      </Typography>
                    </Box>
                  }
                />
                <ListItemSecondaryAction>
                  <Button
                    size="small"
                    onClick={() => navigateToDetails(tech.categoryCode)}
                  >
                    詳細
                  </Button>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography color="textSecondary" align="center">
            新興技術が検出されていません
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

// 技術相関ヒートマップ
const TechCorrelationHeatmap = ({ correlations }) => {
  const classes = useStyles();

  const getCorrelationColor = (value) => {
    if (value > 0.7) return '#4caf50'; // 強い正の相関
    if (value > 0.3) return '#8bc34a'; // 中程度の正の相関
    if (value > -0.3) return '#ffc107'; // 弱い相関
    if (value > -0.7) return '#ff9800'; // 中程度の負の相関
    return '#f44336'; // 強い負の相関
  };

  return (
    <Card className={classes.heatmapCard}>
      <CardHeader title="技術相関マトリックス" />
      <CardContent>
        {correlations && correlations.matrix ? (
          <div className={classes.heatmapContainer}>
            {correlations.matrix.map((row, rowIndex) => (
              <div key={rowIndex} className={classes.heatmapRow}>
                {row.map((cell, colIndex) => (
                  <Tooltip
                    key={colIndex}
                    title={`${correlations.categories[rowIndex]} vs ${correlations.categories[colIndex]}: ${cell.toFixed(2)}`}
                  >
                    <div
                      className={classes.heatmapCell}
                      style={{
                        backgroundColor: getCorrelationColor(cell),
                        opacity: Math.abs(cell)
                      }}
                    >
                      {cell.toFixed(1)}
                    </div>
                  </Tooltip>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <Typography color="textSecondary" align="center">
            相関データがありません
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};
```

#### 3.2.3 データ可視化コンポーネント
```javascript
// Recharts 1.8.5を使用した高度なチャート
const TechLifecycleEvolutionChart = ({ lifecycleData }) => {
  const classes = useStyles();

  const formatLifecycleData = () => {
    return lifecycleData.map(item => ({
      ...item,
      emergingCount: item.lifecycle.EMERGING || 0,
      growthCount: item.lifecycle.GROWTH || 0,
      maturityCount: item.lifecycle.MATURITY || 0,
      declineCount: item.lifecycle.DECLINE || 0
    }));
  };

  return (
    <Card className={classes.chartCard}>
      <CardHeader title="技術ライフサイクル推移" />
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={formatLifecycleData()}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="month" 
              tickFormatter={(value) => new Date(value).toLocaleDateString('ja-JP', { month: 'short' })}
            />
            <YAxis />
            <Tooltip
              labelFormatter={(value) => new Date(value).toLocaleDateString('ja-JP')}
              formatter={(value, name) => [value, getLifecycleLabel(name)]}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="emergingCount"
              stackId="1"
              stroke="#4caf50"
              fill="#4caf50"
              name="新興期"
            />
            <Area
              type="monotone"
              dataKey="growthCount"
              stackId="1"
              stroke="#2196f3"
              fill="#2196f3"
              name="成長期"
            />
            <Area
              type="monotone"
              dataKey="maturityCount"
              stackId="1"
              stroke="#ff9800"
              fill="#ff9800"
              name="成熟期"
            />
            <Area
              type="monotone"
              dataKey="declineCount"
              stackId="1"
              stroke="#f44336"
              fill="#f44336"
              name="衰退期"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

// 技術成長予測チャート
const TechGrowthPredictionChart = ({ predictionData }) => {
  const formatPredictionData = () => {
    return predictionData.map(item => ({
      ...item,
      actualFormatted: formatCurrency(item.actualRevenue),
      predictedFormatted: formatCurrency(item.predictedRevenue),
      confidenceUpper: item.predictedRevenue * (1 + item.confidenceInterval / 100),
      confidenceLower: item.predictedRevenue * (1 - item.confidenceInterval / 100)
    }));
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <ComposedChart data={formatPredictionData()}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis yAxisId="left" tickFormatter={formatCurrency} />
        <Tooltip
          formatter={(value, name) => [
            formatCurrency(value), 
            name === 'actualRevenue' ? '実績売上' : 
            name === 'predictedRevenue' ? '予測売上' : name
          ]}
        />
        <Legend />
        
        {/* 実績データ */}
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="actualRevenue"
          stroke="#2196f3"
          strokeWidth={3}
          name="実績"
          connectNulls={false}
        />
        
        {/* 予測データ */}
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="predictedRevenue"
          stroke="#ff9800"
          strokeWidth={2}
          strokeDasharray="5 5"
          name="予測"
          connectNulls={false}
        />
        
        {/* 信頼区間 */}
        <Area
          yAxisId="left"
          type="monotone"
          dataKey="confidenceUpper"
          stroke="none"
          fill="#ff9800"
          fillOpacity={0.1}
          name="信頼区間上限"
        />
        <Area
          yAxisId="left"
          type="monotone"
          dataKey="confidenceLower"
          stroke="none"
          fill="#ff9800"
          fillOpacity={0.1}
          name="信頼区間下限"
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
};
```

### 3.3 データベース設計拡張

#### 3.3.1 新規テーブル追加
```sql
-- 技術トレンド分析結果テーブル
CREATE TABLE tech_trend_analysis (
    id BIGSERIAL PRIMARY KEY,
    analysis_date DATE NOT NULL,
    tech_category_id BIGINT NOT NULL REFERENCES tech_categories(id),
    lifecycle_stage VARCHAR(20) NOT NULL CHECK (lifecycle_stage IN ('EMERGING', 'GROWTH', 'MATURITY', 'DECLINE')),
    growth_rate DECIMAL(5,2),
    trend_direction VARCHAR(20) CHECK (trend_direction IN ('RISING', 'STABLE', 'DECLINING')),
    trend_confidence VARCHAR(10) CHECK (trend_confidence IN ('HIGH', 'MEDIUM', 'LOW')),
    emerging_score DECIMAL(5,2),
    obsolescence_risk DECIMAL(5,2),
    trend_analysis TEXT,
    investment_recommendation TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 技術関連性分析テーブル
CREATE TABLE tech_relationships (
    id BIGSERIAL PRIMARY KEY,
    primary_tech_id BIGINT NOT NULL REFERENCES tech_categories(id),
    related_tech_id BIGINT NOT NULL REFERENCES tech_categories(id),
    relationship_type VARCHAR(20) NOT NULL CHECK (relationship_type IN ('COMPLEMENTARY', 'COMPETITIVE', 'PREREQUISITE', 'SUCCESSOR')),
    correlation_strength DECIMAL(5,2) NOT NULL CHECK (correlation_strength BETWEEN -1.0 AND 1.0),
    analysis_date DATE NOT NULL,
    confidence_level VARCHAR(10) CHECK (confidence_level IN ('HIGH', 'MEDIUM', 'LOW')),
    statistical_significance DECIMAL(5,4),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(primary_tech_id, related_tech_id, analysis_date)
);

-- 技術予測データテーブル
CREATE TABLE tech_predictions (
    id BIGSERIAL PRIMARY KEY,
    tech_category_id BIGINT NOT NULL REFERENCES tech_categories(id),
    prediction_date DATE NOT NULL,
    prediction_for_date DATE NOT NULL,
    predicted_revenue DECIMAL(12,2),
    predicted_growth_rate DECIMAL(5,2),
    confidence_interval DECIMAL(5,2),
    prediction_model VARCHAR(50),
    model_accuracy DECIMAL(5,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- インデックス追加
CREATE INDEX idx_tech_trend_analysis_date_category ON tech_trend_analysis(analysis_date, tech_category_id);
CREATE INDEX idx_tech_relationships_primary_type ON tech_relationships(primary_tech_id, relationship_type);
CREATE INDEX idx_tech_predictions_category_date ON tech_predictions(tech_category_id, prediction_for_date);

-- 月次集計用マテリアライズドビュー
CREATE MATERIALIZED VIEW monthly_tech_category_sales AS
SELECT 
    DATE_TRUNC('month', o.order_date) as sales_month,
    tc.id as tech_category_id,
    tc.category_code,
    tc.category_name,
    COUNT(DISTINCT oi.book_id) as unique_books_sold,
    SUM(oi.quantity) as total_quantity,
    SUM(oi.unit_price * oi.quantity) as total_revenue,
    COUNT(DISTINCT o.customer_id) as unique_customers,
    AVG(oi.unit_price) as average_price
FROM orders o
JOIN order_items oi ON o.id = oi.order_id
JOIN books b ON oi.book_id = b.id
JOIN book_categories bc ON b.id = bc.book_id AND bc.is_primary = true
JOIN tech_categories tc ON bc.category_id = tc.id
WHERE o.status != 'CANCELLED'
GROUP BY DATE_TRUNC('month', o.order_date), tc.id, tc.category_code, tc.category_name;

CREATE UNIQUE INDEX idx_monthly_tech_sales_month_category ON monthly_tech_category_sales(sales_month, tech_category_id);
```

#### 3.3.2 分析用SQL関数
```sql
-- 技術カテゴリの成長率計算関数
CREATE OR REPLACE FUNCTION calculate_tech_growth_rate(
    p_category_id BIGINT,
    p_analysis_date DATE DEFAULT CURRENT_DATE
) RETURNS DECIMAL(5,2) AS $$
DECLARE
    current_month_revenue DECIMAL(12,2);
    previous_year_revenue DECIMAL(12,2);
    growth_rate DECIMAL(5,2);
BEGIN
    -- 今月の売上
    SELECT COALESCE(SUM(total_revenue), 0) INTO current_month_revenue
    FROM monthly_tech_category_sales
    WHERE tech_category_id = p_category_id 
    AND sales_month = DATE_TRUNC('month', p_analysis_date);
    
    -- 前年同月の売上
    SELECT COALESCE(SUM(total_revenue), 0) INTO previous_year_revenue
    FROM monthly_tech_category_sales
    WHERE tech_category_id = p_category_id 
    AND sales_month = DATE_TRUNC('month', p_analysis_date - INTERVAL '1 year');
    
    -- 成長率計算
    IF previous_year_revenue > 0 THEN
        growth_rate := ((current_month_revenue - previous_year_revenue) / previous_year_revenue) * 100;
    ELSIF current_month_revenue > 0 THEN
        growth_rate := 100; -- 前年実績なしの場合は100%とする
    ELSE
        growth_rate := 0;
    END IF;
    
    RETURN growth_rate;
END;
$$ LANGUAGE plpgsql;

-- 技術相関係数計算関数
CREATE OR REPLACE FUNCTION calculate_tech_correlation(
    p_tech1_id BIGINT,
    p_tech2_id BIGINT,
    p_months_back INTEGER DEFAULT 12
) RETURNS DECIMAL(5,2) AS $$
DECLARE
    correlation_coefficient DECIMAL(5,2);
BEGIN
    WITH tech1_sales AS (
        SELECT sales_month, total_revenue as revenue1
        FROM monthly_tech_category_sales
        WHERE tech_category_id = p_tech1_id
        AND sales_month >= CURRENT_DATE - (p_months_back || ' months')::INTERVAL
    ),
    tech2_sales AS (
        SELECT sales_month, total_revenue as revenue2
        FROM monthly_tech_category_sales
        WHERE tech_category_id = p_tech2_id
        AND sales_month >= CURRENT_DATE - (p_months_back || ' months')::INTERVAL
    ),
    combined_sales AS (
        SELECT 
            t1.sales_month,
            COALESCE(t1.revenue1, 0) as revenue1,
            COALESCE(t2.revenue2, 0) as revenue2
        FROM tech1_sales t1
        FULL OUTER JOIN tech2_sales t2 ON t1.sales_month = t2.sales_month
    )
    SELECT CORR(revenue1, revenue2) INTO correlation_coefficient
    FROM combined_sales;
    
    RETURN COALESCE(correlation_coefficient, 0);
END;
$$ LANGUAGE plpgsql;
```

## 4. 実装方針・フェーズ

### 4.1 Phase 1: 基本トレンド分析（2週間）
**目標**: 技術カテゴリ別の基本的なトレンド分析機能

**実装内容**:
1. **バックエンド基盤**:
   - `TechTrendAnalysisService` 基本実装
   - 月次集計データ生成バッチ
   - 基本APIエンドポイント

2. **フロントエンド基盤**:
   - `TechTrendReportPage` メインページ
   - `TechCategoryTrendChart` 基本チャート
   - 急上昇・衰退技術リスト表示

**成功基準**:
- 技術カテゴリ別の月次売上トレンド表示
- 成長率計算精度 > 95%
- 基本的なチャート表示機能

### 4.2 Phase 2: ライフサイクル分析（2週間）
**目標**: 技術ライフサイクル管理機能

**実装内容**:
1. **ライフサイクル判定ロジック**:
   - 4段階ライフサイクル判定アルゴリズム
   - 段階遷移予測機能
   - 投資推奨生成機能

2. **可視化機能**:
   - ライフサイクル分布円グラフ
   - ライフサイクル推移チャート
   - 技術別詳細分析画面

**成功基準**:
- ライフサイクル判定精度 > 80%
- 段階遷移予測実装完了
- 投資推奨生成機能動作

### 4.3 Phase 3: 関連性・予測分析（2週間）
**目標**: 高度な分析機能

**実装内容**:
1. **技術関連性分析**:
   - 技術相関マトリックス生成
   - 補完・競合技術検出
   - 関連技術ネットワーク可視化

2. **新興技術発見**:
   - 新興技術検出アルゴリズム
   - 新興度スコア算出
   - 早期警告システム

**成功基準**:
- 技術相関係数計算精度 > 75%
- 新興技術検出感度 > 70%
- ヒートマップ・ネットワーク図表示

### 4.4 Phase 4: 統合・最適化（1週間）
**目標**: 全機能統合とパフォーマンス最適化

**実装内容**:
1. **統合テスト・調整**
2. **パフォーマンス最適化**
3. **ユーザビリティ改善**
4. **ドキュメント整備**

## 5. 検収基準

### 5.1 機能検収基準
- [ ] **基本トレンド分析**:
  - [ ] 技術カテゴリ別売上推移表示
  - [ ] 成長率計算（前年同期比）
  - [ ] 急上昇・衰退技術ランキング

- [ ] **ライフサイクル分析**:
  - [ ] 4段階ライフサイクル判定
  - [ ] 段階遷移予測（月単位）
  - [ ] 投資推奨生成

- [ ] **関連性分析**:
  - [ ] 技術相関マトリックス表示
  - [ ] 補完・競合技術検出
  - [ ] 新興技術早期発見

### 5.2 精度検収基準
- [ ] 成長率計算精度: > 95%
- [ ] ライフサイクル判定精度: > 80%
- [ ] 技術相関分析精度: > 75%
- [ ] 新興技術検出感度: > 70%

### 5.3 パフォーマンス検収基準
- [ ] レポート生成時間: < 5秒
- [ ] チャート描画時間: < 2秒
- [ ] API応答時間: < 1秒
- [ ] 大量データ処理（1年分）: < 30秒

### 5.4 UI/UX検収基準
- [ ] レスポンシブデザイン対応
- [ ] 直感的なナビゲーション
- [ ] エラーハンドリング実装
- [ ] ローディング状態表示

## 6. リスク・制約事項

### 6.1 技術的制約
- **レガシーライブラリ制約**: React 16.13.x, Material-UI 4.11.4の機能制限
- **データ量制約**: 大量データ処理時のパフォーマンス懸念
- **予測精度制約**: 機械学習ライブラリ不使用による予測精度限界

### 6.2 データ品質リスク
- **データ不足**: 新規技術カテゴリのデータ不足
- **季節変動**: 技術トレンドの季節性による誤検出
- **外部要因**: 市場環境変化による予測精度低下

### 6.3 対策
1. **段階的実装**: フェーズ別で機能検証
2. **データ補完**: 統計的手法による欠損データ補完
3. **定期調整**: アルゴリズムパラメータの定期見直し

## 7. 期待効果

### 7.1 ビジネス効果
- **在庫最適化**: 適切な技術トレンド予測による在庫回転率向上
- **売上向上**: 新興技術の早期発見による先行者利益獲得
- **リスク軽減**: 衰退技術の早期察知による損失回避

### 7.2 競争優位性
- **技術専門性**: 技術書店特有の高度分析機能
- **予測精度**: データドリブンな意思決定基盤
- **顧客価値**: 技術者向け有益な情報提供

この技術トレンドレポート機能により、TechBookStoreは技術専門書店としての差別化を図り、データに基づいた戦略的経営を実現できます。
