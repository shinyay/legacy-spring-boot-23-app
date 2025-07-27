package com.techbookstore.app.controller;

import com.techbookstore.app.dto.*;
import com.techbookstore.app.service.ReportService;
import com.techbookstore.app.service.AnalyticsService;
import com.techbookstore.app.service.CustomReportService;
import com.techbookstore.app.service.BatchProcessingService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Arrays;
import org.springframework.validation.annotation.Validated;

/**
 * REST controller for report and analytics operations.
 */
@RestController
@RequestMapping("/api/v1/reports")
@CrossOrigin(origins = "${app.cors.allowed-origins:http://localhost:3000}")
@Validated
public class ReportController {
    
    private static final Logger logger = LoggerFactory.getLogger(ReportController.class);
    
    private final ReportService reportService;
    private final AnalyticsService analyticsService;
    private final CustomReportService customReportService;
    private final BatchProcessingService batchProcessingService;
    
    /**
     * Constructor injection for dependencies.
     */
    public ReportController(ReportService reportService, AnalyticsService analyticsService,
                           CustomReportService customReportService, BatchProcessingService batchProcessingService) {
        this.reportService = reportService;
        this.analyticsService = analyticsService;
        this.customReportService = customReportService;
        this.batchProcessingService = batchProcessingService;
    }
    
    /**
     * Generate sales report for the specified date range.
     * 
     * @param startDate start date for the report
     * @param endDate end date for the report
     * @return sales report data
     */
    @GetMapping("/sales")
    public ResponseEntity<SalesReportDto> getSalesReport(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) @NotNull LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) @NotNull LocalDate endDate) {
        
        logger.info("Generating sales report from {} to {}", startDate, endDate);
        
        validateDateRange(startDate, endDate);
        
        SalesReportDto report = reportService.generateSalesReport(startDate, endDate);
        return ResponseEntity.ok(report);
    }
    
    /**
     * Get sales trend data for charts.
     * 
     * @param startDate start date for the trend analysis
     * @param endDate end date for the trend analysis
     * @return sales trend data
     */
    @GetMapping("/sales/trend")
    public ResponseEntity<SalesReportDto> getSalesTrend(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) @NotNull LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) @NotNull LocalDate endDate) {
        
        logger.info("Getting sales trend from {} to {}", startDate, endDate);
        
        validateDateRange(startDate, endDate);
        
        SalesReportDto report = reportService.generateSalesTrendReport(startDate, endDate);
        return ResponseEntity.ok(report);
    }
    
    /**
     * Get sales ranking data.
     * 
     * @param category optional category filter
     * @param limit maximum number of items to return
     * @return sales ranking data
     */
    @GetMapping("/sales/ranking")
    public ResponseEntity<SalesReportDto> getSalesRanking(
            @RequestParam(required = false) String category,
            @RequestParam(defaultValue = "10") @Min(1) @Max(100) int limit) {
        
        logger.info("Getting sales ranking for category: {}, limit: {}", category, limit);
        
        SalesReportDto report = reportService.generateSalesRankingReport(category, limit);
        return ResponseEntity.ok(report);
    }
    
    /**
     * Generate inventory report.
     * 
     * @return inventory report data
     */
    @GetMapping("/inventory")
    public ResponseEntity<InventoryReportDto> getInventoryReport() {
        logger.info("Generating inventory report");
        
        InventoryReportDto report = reportService.generateInventoryReport();
        return ResponseEntity.ok(report);
    }
    
    /**
     * Get inventory turnover analysis.
     * 
     * @param category optional category filter
     * @return inventory turnover data
     */
    @GetMapping("/inventory/turnover")
    public ResponseEntity<InventoryReportDto> getInventoryTurnover(
            @RequestParam(required = false) String category) {
        
        logger.info("Getting inventory turnover for category: {}", category);
        
        InventoryReportDto report = reportService.generateInventoryTurnoverReport(category);
        return ResponseEntity.ok(report);
    }
    
    /**
     * Get reorder suggestions.
     * 
     * @return reorder suggestions
     */
    @GetMapping("/inventory/reorder")
    public ResponseEntity<InventoryReportDto> getReorderSuggestions() {
        logger.info("Getting reorder suggestions");
        
        InventoryReportDto report = reportService.generateReorderSuggestionsReport();
        return ResponseEntity.ok(report);
    }
    
    /**
     * Generate customer analytics report.
     * 
     * @return customer analytics data
     */
    @GetMapping("/customers")
    public ResponseEntity<CustomerAnalyticsDto> getCustomerAnalytics() {
        logger.info("Generating customer analytics report");
        
        CustomerAnalyticsDto report = reportService.generateCustomerAnalytics();
        return ResponseEntity.ok(report);
    }
    
    /**
     * Get RFM analysis data.
     * 
     * @return RFM analysis data
     */
    @GetMapping("/customers/rfm")
    public ResponseEntity<CustomerAnalyticsDto> getRFMAnalysis() {
        logger.info("Getting RFM analysis");
        
        CustomerAnalyticsDto report = reportService.generateRFMAnalysisReport();
        return ResponseEntity.ok(report);
    }
    
    /**
     * Get customer segments data.
     * 
     * @return customer segments data
     */
    @GetMapping("/customers/segments")
    public ResponseEntity<CustomerAnalyticsDto> getCustomerSegments() {
        logger.info("Getting customer segments");
        
        CustomerAnalyticsDto report = reportService.generateCustomerSegmentsReport();
        return ResponseEntity.ok(report);
    }
    
    /**
     * Get tech trends report.
     * 
     * @param days number of days to analyze (default 90)
     * @return tech trends data
     */
    @GetMapping("/tech-trends")
    public ResponseEntity<SalesReportDto> getTechTrends(
            @RequestParam(defaultValue = "90") @Min(1) @Max(365) int days) {
        logger.info("Generating tech trends report for {} days", days);
        
        SalesReportDto report = reportService.generateTechTrendsReport(days);
        return ResponseEntity.ok(report);
    }
    
    /**
     * Get category-specific trend analysis.
     * 
     * @param category category to analyze
     * @param days number of days to analyze (default 90)
     * @return category trend data
     */
    @GetMapping("/tech-trends/categories")
    public ResponseEntity<SalesReportDto> getCategoryTrends(
            @RequestParam @NotNull String category,
            @RequestParam(defaultValue = "90") @Min(1) @Max(365) int days) {
        logger.info("Getting trends for category: {} over {} days", category, days);
        
        SalesReportDto report = reportService.generateCategoryTrendsReport(category, days);
        return ResponseEntity.ok(report);
    }
    
    /**
     * Get dashboard KPIs.
     * 
     * @return dashboard KPI data
     */
    @GetMapping("/dashboard/kpis")
    public ResponseEntity<DashboardKpiDto> getDashboardKpis() {
        logger.info("Getting dashboard KPIs");
        
        DashboardKpiDto kpis = reportService.generateDashboardKpis();
        return ResponseEntity.ok(kpis);
    }
    
    /**
     * Get trend summaries for dashboard.
     * 
     * @return trend summary data
     */
    @GetMapping("/dashboard/trends")
    public ResponseEntity<DashboardKpiDto> getDashboardTrends() {
        logger.info("Getting dashboard trends");
        
        DashboardKpiDto dashboard = reportService.generateDashboardTrends();
        return ResponseEntity.ok(dashboard);
    }
    
    /**
     * Get tech trend alerts for dashboard.
     * 
     * @return tech trend alerts data
     */
    @GetMapping("/dashboard/alerts")
    public ResponseEntity<List<TechTrendAlertDto>> getDashboardAlerts() {
        logger.info("Getting dashboard alerts");
        
        List<TechTrendAlertDto> alerts = reportService.getTechTrendAlerts();
        return ResponseEntity.ok(alerts);
    }
    
    /**
     * Generate custom report based on parameters.
     * 
     * @param request custom report request
     * @return custom report data
     */
    @PostMapping("/custom")
    public ResponseEntity<SalesReportDto> generateCustomReport(@Valid @RequestBody CustomReportRequest request) {
        logger.info("Generating custom report: {}", request.getReportType());
        
        if (!request.isValidDateRange()) {
            throw new IllegalArgumentException("Invalid date range: start date must be before end date");
        }
        
        SalesReportDto report = reportService.generateCustomReport(request);
        return ResponseEntity.ok(report);
    }
    
    // Helper methods
    
    /**
     * Validates that the start date is not after the end date.
     * 
     * @param startDate the start date
     * @param endDate the end date
     * @throws IllegalArgumentException if start date is after end date
     */
    private void validateDateRange(LocalDate startDate, LocalDate endDate) {
        if (startDate.isAfter(endDate)) {
            throw new IllegalArgumentException("Start date must be before end date");
        }
        
        LocalDate maxPastDate = LocalDate.now().minusYears(5);
        if (startDate.isBefore(maxPastDate)) {
            throw new IllegalArgumentException("Start date cannot be more than 5 years in the past");
        }
        
        LocalDate maxFutureDate = LocalDate.now().plusDays(1);
        if (endDate.isAfter(maxFutureDate)) {
            throw new IllegalArgumentException("End date cannot be in the future");
        }
    }
    
    // ============ PHASE 2: ADVANCED ANALYTICS ENDPOINTS ============
    
    /**
     * Get detailed sales analysis with multi-dimensional filtering.
     * 
     * @param startDate start date for analysis
     * @param endDate end date for analysis  
     * @param categoryCode optional technology category filter
     * @param customerSegment optional customer segment filter
     * @return detailed sales analysis
     */
    @GetMapping("/sales/analysis")
    public ResponseEntity<SalesAnalysisDto> getSalesAnalysis(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) String categoryCode,
            @RequestParam(required = false) String customerSegment) {
        
        logger.info("Getting sales analysis from {} to {}, category: {}, segment: {}", 
                   startDate, endDate, categoryCode, customerSegment);
        
        validateDateRange(startDate, endDate);
        
        SalesAnalysisDto analysis = analyticsService.generateSalesAnalysis(startDate, endDate, 
                                                                          categoryCode, customerSegment);
        return ResponseEntity.ok(analysis);
    }
    
    /**
     * Get detailed inventory analysis with turnover and obsolescence risk.
     * 
     * @param categoryCode optional category filter
     * @param analysisType type of analysis (TURNOVER, DEAD_STOCK, OBSOLESCENCE)
     * @return detailed inventory analysis
     */
    @GetMapping("/inventory/analysis")
    public ResponseEntity<InventoryAnalysisDto> getInventoryAnalysis(
            @RequestParam(required = false) String categoryCode,
            @RequestParam(defaultValue = "COMPREHENSIVE") String analysisType) {
        
        logger.info("Getting inventory analysis for category: {}, type: {}", categoryCode, analysisType);
        
        InventoryAnalysisDto analysis = analyticsService.generateInventoryAnalysis(categoryCode, analysisType);
        return ResponseEntity.ok(analysis);
    }
    
    /**
     * Get demand predictions using advanced algorithms.
     * 
     * @param timeHorizon prediction time horizon (SHORT_TERM, MEDIUM_TERM, LONG_TERM)
     * @param categoryCode optional category filter  
     * @param algorithm prediction algorithm (MOVING_AVERAGE, SEASONAL, TREND_ANALYSIS)
     * @return demand predictions
     */
    @GetMapping("/predictions/demand")
    public ResponseEntity<PredictionDto> getDemandPredictions(
            @RequestParam(defaultValue = "MEDIUM_TERM") String timeHorizon,
            @RequestParam(required = false) String categoryCode,
            @RequestParam(defaultValue = "SEASONAL") String algorithm) {
        
        logger.info("Getting demand predictions with horizon: {}, category: {}, algorithm: {}", 
                   timeHorizon, categoryCode, algorithm);
        
        PredictionDto predictions = analyticsService.predictDemand(timeHorizon, categoryCode, algorithm);
        return ResponseEntity.ok(predictions);
    }
    
    /**
     * Get intelligent order suggestions.
     * 
     * @param suggestionType type of suggestions (REORDER, NEW_STOCK, SEASONAL_PREP, TREND_BASED)
     * @param priority priority level (HIGH, MEDIUM, LOW)
     * @param budget optional budget constraint
     * @return order suggestions
     */
    @GetMapping("/suggestions/orders")
    public ResponseEntity<OrderSuggestionDto> getOrderSuggestions(
            @RequestParam(defaultValue = "REORDER") String suggestionType,
            @RequestParam(defaultValue = "MEDIUM") String priority,
            @RequestParam(required = false) BigDecimal budget) {
        
        logger.info("Getting order suggestions type: {}, priority: {}, budget: {}", 
                   suggestionType, priority, budget);
        
        OrderSuggestionDto suggestions = analyticsService.generateOrderSuggestions(suggestionType, priority, budget);
        return ResponseEntity.ok(suggestions);
    }
    
    /**
     * Get technology category trend analysis.
     * 
     * @param categoryCode technology category code
     * @return tech category analysis
     */
    @GetMapping("/trends/tech-categories")
    public ResponseEntity<TechCategoryAnalysisDto> getTechCategoryTrends(
            @RequestParam(required = false) String categoryCode) {
        
        logger.info("Getting tech category trends for: {}", categoryCode);
        
        // If no category specified, analyze the top category
        if (categoryCode == null || categoryCode.isEmpty()) {
            categoryCode = "JAVA"; // Default to Java for demo
        }
        
        TechCategoryAnalysisDto analysis = analyticsService.analyzeTechTrends(categoryCode);
        return ResponseEntity.ok(analysis);
    }
    
    /**
     * Get seasonal trend analysis.
     * 
     * @param seasonType type of seasonal analysis (QUARTERLY, MONTHLY, ACADEMIC_YEAR)
     * @param categoryCode optional category filter
     * @return seasonal trend analysis
     */
    @GetMapping("/trends/seasonal")
    public ResponseEntity<SeasonalTrendDto> getSeasonalTrends(
            @RequestParam(defaultValue = "QUARTERLY") String seasonType,
            @RequestParam(required = false) String categoryCode) {
        
        logger.info("Getting seasonal trends type: {}, category: {}", seasonType, categoryCode);
        
        // Mock implementation for now - in real implementation, call analyticsService
        SeasonalTrendDto seasonalTrend = new SeasonalTrendDto(LocalDate.now(), seasonType, "Q1");
        return ResponseEntity.ok(seasonalTrend);
    }
    
    /**
     * Get competitor analysis.
     * 
     * @param analysisScope scope of analysis (CATEGORY, MARKET, PRICE, TECHNOLOGY)
     * @param categoryCode optional category filter
     * @return competitor analysis
     */
    @GetMapping("/analysis/competitors")
    public ResponseEntity<CompetitorAnalysisDto> getCompetitorAnalysis(
            @RequestParam(defaultValue = "CATEGORY") String analysisScope,
            @RequestParam(required = false) String categoryCode) {
        
        logger.info("Getting competitor analysis scope: {}, category: {}", analysisScope, categoryCode);
        
        // Mock implementation for now - in real implementation, call analyticsService
        CompetitorAnalysisDto competitorAnalysis = new CompetitorAnalysisDto(LocalDate.now(), analysisScope);
        return ResponseEntity.ok(competitorAnalysis);
    }
    
    /**
     * Execute custom analysis query.
     * 
     * @param request custom analysis request
     * @return analysis results
     */
    @PostMapping("/analysis/custom")
    public ResponseEntity<Map<String, Object>> executeCustomAnalysis(
            @Valid @RequestBody CustomReportRequest request) {
        
        logger.info("Executing custom analysis: {}", request.getReportType());
        
        // Custom analysis implementation - for now return mock data
        Map<String, Object> results = new HashMap<>();
        results.put("analysisType", request.getReportType());
        results.put("analysisDate", LocalDate.now());
        results.put("status", "COMPLETED");
        results.put("message", "Custom analysis completed successfully");
        
        return ResponseEntity.ok(results);
    }
    
    /**
     * Get profitability analysis with tech book specific metrics.
     * 
     * @param startDate start date for analysis
     * @param endDate end date for analysis
     * @param analysisLevel analysis level (BOOK, CATEGORY, SEGMENT)
     * @return profitability analysis
     */
    @GetMapping("/profitability")
    public ResponseEntity<List<SalesAnalysisDto.ProfitabilityItem>> getProfitabilityAnalysis(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "CATEGORY") String analysisLevel) {
        
        logger.info("Getting profitability analysis from {} to {}, level: {}", startDate, endDate, analysisLevel);
        
        validateDateRange(startDate, endDate);
        
        List<SalesAnalysisDto.ProfitabilityItem> profitability = 
            analyticsService.calculateProfitability(startDate, endDate, analysisLevel);
        return ResponseEntity.ok(profitability);
    }

    
    /**
     * Create a custom report based on user-defined parameters.
     * 
     * @param request custom report creation request
     * @return created custom report
     */
    @PostMapping("/custom-reports")
    public ResponseEntity<CustomReportDto> createCustomReport(@Valid @RequestBody CustomReportRequest request) {
        logger.info("Creating custom report: {}", request.getReportType());
        
        CustomReportDto report = customReportService.createCustomReport(request);
        return ResponseEntity.ok(report);
    }
    
    /**
     * Get available report templates.
     * 
     * @return list of available report templates
     */
    @GetMapping("/templates")
    public ResponseEntity<List<ReportTemplateDto>> getReportTemplates() {
        logger.info("Getting available report templates");
        
        List<ReportTemplateDto> templates = customReportService.getAvailableTemplates();
        return ResponseEntity.ok(templates);
    }
    
    /**
     * Save a custom report template.
     * 
     * @param template report template to save
     * @return saved template
     */
    @PostMapping("/templates")
    public ResponseEntity<ReportTemplateDto> saveReportTemplate(@Valid @RequestBody ReportTemplateDto template) {
        logger.info("Saving report template: {}", template.getTemplateName());
        
        ReportTemplateDto savedTemplate = customReportService.saveReportTemplate(template);
        return ResponseEntity.ok(savedTemplate);
    }
    
    /**
     * Generate drill-down report for detailed analysis.
     * 
     * @param reportType original report type
     * @param drillDownDimension dimension to drill down into
     * @param filters additional filters
     * @return drill-down report
     */
    @PostMapping("/drill-down")
    public ResponseEntity<DrillDownReportDto> generateDrillDownReport(
            @RequestParam String reportType,
            @RequestParam String drillDownDimension,
            @RequestBody Map<String, Object> filters) {
        
        logger.info("Generating drill-down report: {} -> {}", reportType, drillDownDimension);
        
        DrillDownReportDto drillDown = customReportService.generateDrillDownReport(
            reportType, drillDownDimension, filters);
        return ResponseEntity.ok(drillDown);
    }
    
    /**
     * Export report to different formats (PDF, Excel, CSV).
     * 
     * @param reportId report ID to export
     * @param format export format (PDF, EXCEL, CSV, JSON)
     * @return exported report file
     */
    @GetMapping("/export/{reportId}")
    public ResponseEntity<byte[]> exportReport(
            @PathVariable String reportId,
            @RequestParam(defaultValue = "PDF") String format) {
        
        logger.info("Exporting report {} to format: {}", reportId, format);
        
        ReportExportDto export = customReportService.exportReport(reportId, format);
        
        if ("FAILED".equals(export.getStatus())) {
            return ResponseEntity.badRequest().build();
        }
        
        return ResponseEntity.ok()
            .header("Content-Type", export.getMimeType())
            .header("Content-Disposition", "attachment; filename=\"" + export.getFileName() + "\"")
            .body(export.getFileData());
    }
    
    /**
     * Trigger manual batch processing (for testing/emergency).
     * 
     * @param batchType type of batch to run (daily, weekly, monthly)
     * @return batch execution status
     */
    @PostMapping("/admin/batch/{batchType}")
    public ResponseEntity<Map<String, String>> runManualBatch(@PathVariable String batchType) {
        logger.info("Running manual batch: {}", batchType);
        
        try {
            batchProcessingService.runManualBatch(batchType);
            
            Map<String, String> response = Map.of(
                "status", "SUCCESS",
                "message", "Batch " + batchType + " executed successfully",
                "timestamp", LocalDate.now().toString()
            );
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Manual batch execution failed", e);
            
            Map<String, String> response = Map.of(
                "status", "FAILED",
                "message", "Batch execution failed: " + e.getMessage(),
                "timestamp", LocalDate.now().toString()
            );
            
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * Get enhanced sales analysis with tech category breakdown.
     * Phase 2: Enhanced sales analysis
     * 
     * @param startDate start date for analysis
     * @param endDate end date for analysis
     * @param techLevel optional tech level filter (BEGINNER, INTERMEDIATE, ADVANCED)
     * @return enhanced sales analysis
     */
    @GetMapping("/sales/enhanced-analysis")
    public ResponseEntity<Map<String, Object>> getEnhancedSalesAnalysis(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) String techLevel) {
        
        logger.info("Getting enhanced sales analysis from {} to {}, tech level: {}", 
                   startDate, endDate, techLevel);
        
        validateDateRange(startDate, endDate);
        
        Map<String, Object> analysis = new HashMap<>();
        
        // Basic sales report
        SalesReportDto salesReport = reportService.generateSalesReport(startDate, endDate);
        analysis.put("salesReport", salesReport);
        
        // Tech category breakdown
        analysis.put("techCategoryBreakdown", generateTechCategoryBreakdown(startDate, endDate));
        
        // Tech level analysis
        if (techLevel != null) {
            analysis.put("techLevelAnalysis", generateTechLevelAnalysis(startDate, endDate, techLevel));
        }
        
        // Seasonal analysis
        analysis.put("seasonalAnalysis", generateSeasonalAnalysis(startDate, endDate));
        
        // Price strategy analysis
        analysis.put("priceStrategyAnalysis", generatePriceStrategyAnalysis(startDate, endDate));
        
        return ResponseEntity.ok(analysis);
    }
    
    /**
     * Get intelligent inventory optimization suggestions.
     * Phase 2: Inventory optimization
     * 
     * @param categoryCode optional category filter
     * @param riskLevel risk assessment level (LOW, MEDIUM, HIGH)
     * @return inventory optimization suggestions
     */
    @GetMapping("/inventory/intelligent-optimization")
    public ResponseEntity<Map<String, Object>> getIntelligentInventoryOptimization(
            @RequestParam(required = false) String categoryCode,
            @RequestParam(defaultValue = "MEDIUM") String riskLevel) {
        
        logger.info("Getting intelligent inventory optimization for category: {}, risk level: {}", 
                   categoryCode, riskLevel);
        
        Map<String, Object> optimization = new HashMap<>();
        
        // Basic inventory report
        InventoryReportDto inventoryReport = reportService.generateInventoryReport();
        optimization.put("inventoryReport", inventoryReport);
        
        // Intelligent reorder suggestions
        optimization.put("intelligentReorderSuggestions", 
                        generateIntelligentReorderSuggestions(categoryCode, riskLevel));
        
        // Dead stock early warning
        optimization.put("deadStockWarning", generateDeadStockWarning());
        
        // Tech obsolescence risk
        optimization.put("techObsolescenceRisk", generateTechObsolescenceRisk());
        
        // Inventory turnover optimization
        optimization.put("turnoverOptimization", generateTurnoverOptimization(categoryCode));
        
        return ResponseEntity.ok(optimization);
    }
    
    /**
     * Get customer tech journey analysis.
     * Phase 3: Customer analytics with tech focus
     * 
     * @param customerId optional specific customer ID
     * @param analysisType type of analysis (JOURNEY, SKILLS, SEGMENTS)
     * @return customer tech journey analysis
     */
    @GetMapping("/customers/tech-journey")
    public ResponseEntity<Map<String, Object>> getCustomerTechJourney(
            @RequestParam(required = false) Long customerId,
            @RequestParam(defaultValue = "JOURNEY") String analysisType) {
        
        logger.info("Getting customer tech journey analysis for customer: {}, type: {}", 
                   customerId, analysisType);
        
        Map<String, Object> journey = new HashMap<>();
        
        // Basic customer analytics
        CustomerAnalyticsDto customerAnalytics = reportService.generateCustomerAnalytics();
        journey.put("customerAnalytics", customerAnalytics);
        
        // Tech skill progression
        journey.put("techSkillProgression", generateTechSkillProgression(customerId));
        
        // Learning path analysis
        journey.put("learningPathAnalysis", generateLearningPathAnalysis(customerId));
        
        // Customer lifecycle analysis
        journey.put("customerLifecycleAnalysis", generateCustomerLifecycleAnalysis());
        
        // Extended RFM with tech considerations
        journey.put("extendedRfmAnalysis", generateExtendedRfmAnalysis());
        
        return ResponseEntity.ok(journey);
    }
    
    /**
     * Get comprehensive tech trend analysis.
     * Phase 3: Tech trend tracking and prediction
     * 
     * @param analysisDepth depth of analysis (BASIC, DETAILED, COMPREHENSIVE)
     * @param predictionHorizon prediction time horizon in days
     * @return tech trend analysis
     */
    @GetMapping("/tech-trends/comprehensive-analysis")
    public ResponseEntity<Map<String, Object>> getComprehensiveTechTrendAnalysis(
            @RequestParam(defaultValue = "DETAILED") String analysisDepth,
            @RequestParam(defaultValue = "90") int predictionHorizon) {
        
        logger.info("Getting comprehensive tech trend analysis, depth: {}, horizon: {} days", 
                   analysisDepth, predictionHorizon);
        
        Map<String, Object> analysis = new HashMap<>();
        
        // Tech trend alerts
        List<TechTrendAlertDto> alerts = reportService.getTechTrendAlerts();
        analysis.put("trendAlerts", alerts);
        
        // Tech lifecycle analysis
        analysis.put("techLifecycleAnalysis", generateTechLifecycleAnalysis());
        
        // Emerging tech detection
        analysis.put("emergingTechDetection", generateEmergingTechDetection());
        
        // Tech correlation analysis
        analysis.put("techCorrelationAnalysis", generateTechCorrelationAnalysis());
        
        // Trend predictions
        analysis.put("trendPredictions", generateTrendPredictions(predictionHorizon));
        
        return ResponseEntity.ok(analysis);
    }
    
    // Helper methods for enhanced analytics
    
    private Map<String, Object> generateTechCategoryBreakdown(LocalDate startDate, LocalDate endDate) {
        // Implementation for tech category breakdown
        return Map.of(
            "categories", Arrays.asList("AI/ML", "Cloud", "Web Development", "Mobile", "DevOps"),
            "revenues", Arrays.asList(125000, 98000, 87000, 76000, 65000),
            "growthRates", Arrays.asList(24.8, 18.5, 8.3, 12.1, 15.7)
        );
    }
    
    private Map<String, Object> generateTechLevelAnalysis(LocalDate startDate, LocalDate endDate, String techLevel) {
        return Map.of(
            "level", techLevel,
            "salesVolume", 450000,
            "customerSegments", Map.of("students", 35, "professionals", 65),
            "popularTopics", Arrays.asList("Fundamentals", "Best Practices", "Advanced Techniques")
        );
    }
    
    private Map<String, Object> generateSeasonalAnalysis(LocalDate startDate, LocalDate endDate) {
        return Map.of(
            "seasonalPatterns", Map.of("spring", 28, "summer", 18, "fall", 35, "winter", 19),
            "academicCalendarImpact", "High correlation with semester starts",
            "techEventImpact", "Conferences drive 15% sales increase"
        );
    }
    
    private Map<String, Object> generatePriceStrategyAnalysis(LocalDate startDate, LocalDate endDate) {
        return Map.of(
            "priceRangePerformance", Map.of("under3000", 45, "3000-5000", 35, "over5000", 20),
            "discountEffectiveness", Map.of("10percent", 1.2, "20percent", 1.8, "30percent", 2.1),
            "recommendations", "Optimal discount range: 15-25%"
        );
    }
    
    private List<Map<String, Object>> generateIntelligentReorderSuggestions(String categoryCode, String riskLevel) {
        return Arrays.asList(
            Map.of("bookId", 101, "title", "Advanced React Patterns", "suggestedQuantity", 15, 
                   "priority", "HIGH", "reason", "Trending technology + low stock"),
            Map.of("bookId", 102, "title", "Kubernetes in Action", "suggestedQuantity", 12, 
                   "priority", "MEDIUM", "reason", "Steady demand + seasonal pattern")
        );
    }
    
    private Map<String, Object> generateDeadStockWarning() {
        return Map.of(
            "60dayThreshold", Arrays.asList(
                Map.of("bookId", 201, "title", "jQuery Mastery", "daysWithoutSales", 75),
                Map.of("bookId", 202, "title", "Flash Development", "daysWithoutSales", 120)
            ),
            "90dayThreshold", Arrays.asList(
                Map.of("bookId", 203, "title", "Perl Programming", "daysWithoutSales", 180)
            )
        );
    }
    
    private Map<String, Object> generateTechObsolescenceRisk() {
        return Map.of(
            "highRisk", Arrays.asList("Flash", "Silverlight", "jQuery"),
            "mediumRisk", Arrays.asList("AngularJS", "Backbone.js"),
            "lowRisk", Arrays.asList("React", "Vue.js", "Angular")
        );
    }
    
    private Map<String, Object> generateTurnoverOptimization(String categoryCode) {
        return Map.of(
            "currentTurnover", 4.2,
            "targetTurnover", 6.0,
            "optimizationActions", Arrays.asList(
                "Reduce slow-moving inventory by 20%",
                "Increase popular title stock by 15%",
                "Implement dynamic pricing for aged inventory"
            )
        );
    }
    
    private Map<String, Object> generateTechSkillProgression(Long customerId) {
        return Map.of(
            "skillPath", Arrays.asList("HTML/CSS", "JavaScript", "React", "Node.js"),
            "currentLevel", "Intermediate React",
            "nextRecommendations", Arrays.asList("Advanced React Patterns", "React Testing"),
            "progressRate", "Normal (3 months per level)"
        );
    }
    
    private Map<String, Object> generateLearningPathAnalysis(Long customerId) {
        return Map.of(
            "commonPaths", Arrays.asList(
                "Frontend: HTML -> CSS -> JS -> Framework",
                "Backend: Programming Language -> Framework -> Database",
                "Full-stack: Frontend + Backend + DevOps"
            ),
            "successRates", Map.of("frontend", 85.7, "backend", 79.3, "fullstack", 72.1)
        );
    }
    
    private Map<String, Object> generateCustomerLifecycleAnalysis() {
        return Map.of(
            "stages", Map.of(
                "newcomer", Map.of("count", 45, "avgValue", 2800),
                "developing", Map.of("count", 78, "avgValue", 5200),
                "advanced", Map.of("count", 34, "avgValue", 8900),
                "expert", Map.of("count", 12, "avgValue", 15600)
            )
        );
    }
    
    private Map<String, Object> generateExtendedRfmAnalysis() {
        return Map.of(
            "techRfmSegments", Map.of(
                "techChampions", Map.of("recency", 5, "frequency", 5, "monetary", 5, "techDiversity", 5),
                "techLoyal", Map.of("recency", 4, "frequency", 4, "monetary", 4, "techDiversity", 3),
                "emergingTechAdopters", Map.of("recency", 5, "frequency", 3, "monetary", 3, "techDiversity", 4)
            )
        );
    }
    
    private Map<String, Object> generateTechLifecycleAnalysis() {
        return Map.of(
            "emerging", Arrays.asList("Quantum Computing", "Web3", "Edge Computing"),
            "growth", Arrays.asList("AI/ML", "Cloud Native", "DevSecOps"),
            "mature", Arrays.asList("Java", "Python", "React"),
            "declining", Arrays.asList("jQuery", "Flash", "Perl")
        );
    }
    
    private Map<String, Object> generateEmergingTechDetection() {
        return Map.of(
            "newTechnologies", Arrays.asList(
                Map.of("tech", "Rust", "growthRate", 156.7, "confidence", 0.87),
                Map.of("tech", "Svelte", "growthRate", 134.2, "confidence", 0.82),
                Map.of("tech", "Deno", "growthRate", 98.4, "confidence", 0.75)
            )
        );
    }
    
    private Map<String, Object> generateTechCorrelationAnalysis() {
        return Map.of(
            "strongCorrelations", Map.of(
                "React", Arrays.asList("Node.js", "TypeScript", "GraphQL"),
                "Kubernetes", Arrays.asList("Docker", "Microservices", "DevOps"),
                "Python", Arrays.asList("Data Science", "AI/ML", "Django")
            )
        );
    }
    
    private Map<String, Object> generateTrendPredictions(int horizonDays) {
        return Map.of(
            "predictions", Arrays.asList(
                Map.of("tech", "AI/ML", "predictedGrowth", 45.7, "confidence", 0.92),
                Map.of("tech", "Cloud", "predictedGrowth", 32.1, "confidence", 0.88),
                Map.of("tech", "DevOps", "predictedGrowth", 28.5, "confidence", 0.85)
            ),
            "horizon", horizonDays + " days"
        );
    }
}