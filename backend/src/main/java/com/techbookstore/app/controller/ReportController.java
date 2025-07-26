package com.techbookstore.app.controller;

import com.techbookstore.app.dto.*;
import com.techbookstore.app.service.ReportService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import java.time.LocalDate;
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
    
    /**
     * Constructor injection for dependencies.
     */
    public ReportController(ReportService reportService) {
        this.reportService = reportService;
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
}