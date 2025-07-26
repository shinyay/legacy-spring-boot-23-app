package com.techbookstore.app.controller;

import com.techbookstore.app.dto.*;
import com.techbookstore.app.service.ReportService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.constraints.NotNull;
import java.time.LocalDate;

/**
 * REST controller for report and analytics operations.
 */
@RestController
@RequestMapping("/api/v1/reports")
@CrossOrigin(origins = "${app.cors.allowed-origins:http://localhost:3000}")
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
        
        if (startDate.isAfter(endDate)) {
            throw new IllegalArgumentException("Start date must be before end date");
        }
        
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
        
        SalesReportDto report = reportService.generateSalesReport(startDate, endDate);
        // Return only trend data by creating a simplified report
        SalesReportDto trendReport = new SalesReportDto();
        trendReport.setStartDate(startDate);
        trendReport.setEndDate(endDate);
        trendReport.setTrends(report.getTrends());
        
        return ResponseEntity.ok(trendReport);
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
            @RequestParam(defaultValue = "10") int limit) {
        
        logger.info("Getting sales ranking for category: {}, limit: {}", category, limit);
        
        SalesReportDto report = reportService.generateSalesReport(LocalDate.now().minusDays(30), LocalDate.now());
        // Return only ranking data
        SalesReportDto rankingReport = new SalesReportDto();
        rankingReport.setRankings(report.getRankings());
        
        return ResponseEntity.ok(rankingReport);
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
        
        InventoryReportDto report = reportService.generateInventoryReport();
        // Return only turnover data
        InventoryReportDto turnoverReport = new InventoryReportDto();
        turnoverReport.setTurnoverSummary(report.getTurnoverSummary());
        
        return ResponseEntity.ok(turnoverReport);
    }
    
    /**
     * Get reorder suggestions.
     * 
     * @return reorder suggestions
     */
    @GetMapping("/inventory/reorder")
    public ResponseEntity<InventoryReportDto> getReorderSuggestions() {
        logger.info("Getting reorder suggestions");
        
        InventoryReportDto report = reportService.generateInventoryReport();
        // Return only reorder suggestions
        InventoryReportDto reorderReport = new InventoryReportDto();
        reorderReport.setReorderSuggestions(report.getReorderSuggestions());
        
        return ResponseEntity.ok(reorderReport);
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
        
        CustomerAnalyticsDto report = reportService.generateCustomerAnalytics();
        // Return only RFM data
        CustomerAnalyticsDto rfmReport = new CustomerAnalyticsDto();
        rfmReport.setRfmAnalysis(report.getRfmAnalysis());
        
        return ResponseEntity.ok(rfmReport);
    }
    
    /**
     * Get customer segments data.
     * 
     * @return customer segments data
     */
    @GetMapping("/customers/segments")
    public ResponseEntity<CustomerAnalyticsDto> getCustomerSegments() {
        logger.info("Getting customer segments");
        
        CustomerAnalyticsDto report = reportService.generateCustomerAnalytics();
        // Return only segments data
        CustomerAnalyticsDto segmentsReport = new CustomerAnalyticsDto();
        segmentsReport.setSegments(report.getSegments());
        
        return ResponseEntity.ok(segmentsReport);
    }
    
    /**
     * Generate tech trends report.
     * 
     * @return tech trends data
     */
    @GetMapping("/tech-trends")
    public ResponseEntity<SalesReportDto> getTechTrends() {
        logger.info("Generating tech trends report");
        
        // For now, return sales data filtered by categories as tech trends
        SalesReportDto report = reportService.generateSalesReport(LocalDate.now().minusDays(90), LocalDate.now());
        return ResponseEntity.ok(report);
    }
    
    /**
     * Get category-specific trend analysis.
     * 
     * @param category category to analyze
     * @return category trend data
     */
    @GetMapping("/tech-trends/categories")
    public ResponseEntity<SalesReportDto> getCategoryTrends(@RequestParam String category) {
        logger.info("Getting trends for category: {}", category);
        
        SalesReportDto report = reportService.generateSalesReport(LocalDate.now().minusDays(90), LocalDate.now());
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
        
        DashboardKpiDto dashboard = reportService.generateDashboardKpis();
        // Return only trends data
        DashboardKpiDto trendsReport = new DashboardKpiDto();
        trendsReport.setTrends(dashboard.getTrends());
        
        return ResponseEntity.ok(trendsReport);
    }
    
    /**
     * Generate custom report based on parameters.
     * 
     * @param request custom report request
     * @return custom report data
     */
    @PostMapping("/custom")
    public ResponseEntity<SalesReportDto> generateCustomReport(@RequestBody CustomReportRequest request) {
        logger.info("Generating custom report: {}", request.getReportType());
        
        // For now, return a basic sales report
        SalesReportDto report = reportService.generateSalesReport(
            request.getStartDate() != null ? request.getStartDate() : LocalDate.now().minusDays(30),
            request.getEndDate() != null ? request.getEndDate() : LocalDate.now()
        );
        
        return ResponseEntity.ok(report);
    }
    
    /**
     * Request DTO for custom reports.
     */
    public static class CustomReportRequest {
        private String reportType;
        private LocalDate startDate;
        private LocalDate endDate;
        private String category;
        private String parameters;
        
        // Constructors
        public CustomReportRequest() {}
        
        // Getters and Setters
        public String getReportType() { return reportType; }
        public void setReportType(String reportType) { this.reportType = reportType; }
        public LocalDate getStartDate() { return startDate; }
        public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
        public LocalDate getEndDate() { return endDate; }
        public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }
        public String getParameters() { return parameters; }
        public void setParameters(String parameters) { this.parameters = parameters; }
    }
}