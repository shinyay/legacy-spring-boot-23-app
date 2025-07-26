package com.techbookstore.app.service;

import com.techbookstore.app.dto.*;
import com.techbookstore.app.entity.AggregationCache;
import com.techbookstore.app.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Service class for generating reports and analytics.
 */
@Service
@Transactional(readOnly = true)
public class ReportService {
    
    private static final Logger logger = LoggerFactory.getLogger(ReportService.class);
    
    private final OrderRepository orderRepository;
    private final CustomerRepository customerRepository;
    private final InventoryRepository inventoryRepository;
    private final BookRepository bookRepository;
    private final AggregationCacheRepository cacheRepository;
    
    /**
     * Constructor injection for dependencies.
     */
    public ReportService(OrderRepository orderRepository, CustomerRepository customerRepository,
                        InventoryRepository inventoryRepository, BookRepository bookRepository,
                        AggregationCacheRepository cacheRepository) {
        this.orderRepository = orderRepository;
        this.customerRepository = customerRepository;
        this.inventoryRepository = inventoryRepository;
        this.bookRepository = bookRepository;
        this.cacheRepository = cacheRepository;
    }
    
    /**
     * Generate sales report for the specified date range.
     */
    public SalesReportDto generateSalesReport(LocalDate startDate, LocalDate endDate) {
        logger.info("Generating sales report from {} to {}", startDate, endDate);
        
        // Calculate basic metrics
        BigDecimal totalRevenue = calculateTotalRevenue(startDate, endDate);
        Integer totalOrders = calculateTotalOrders(startDate, endDate);
        BigDecimal averageOrderValue = totalOrders > 0 ? 
            totalRevenue.divide(new BigDecimal(totalOrders), 2, RoundingMode.HALF_UP) : BigDecimal.ZERO;
        
        // Create report
        SalesReportDto report = new SalesReportDto(startDate, endDate, totalRevenue, totalOrders, averageOrderValue);
        
        // Add trends (simplified for now - using mock data)
        report.setTrends(generateSalesTrends(startDate, endDate));
        
        // Add rankings (simplified for now - using mock data)
        report.setRankings(generateSalesRankings(null, 10));
        
        // Add breakdown
        report.setBreakdown(generateSalesBreakdown(startDate, endDate));
        
        return report;
    }
    
    /**
     * Generate inventory report.
     */
    public InventoryReportDto generateInventoryReport() {
        logger.info("Generating inventory report");
        
        LocalDate reportDate = LocalDate.now();
        
        // Calculate basic metrics (using simplified logic)
        Integer totalProducts = Math.toIntExact(bookRepository.count());
        Integer lowStockCount = 5; // Mock data
        Integer outOfStockCount = 2; // Mock data
        BigDecimal totalInventoryValue = new BigDecimal("150000.00"); // Mock data
        
        InventoryReportDto report = new InventoryReportDto(reportDate, totalProducts, lowStockCount, 
                                                          outOfStockCount, totalInventoryValue);
        
        // Add inventory items (simplified)
        report.setItems(generateInventoryItems());
        
        // Add reorder suggestions
        report.setReorderSuggestions(generateReorderSuggestions());
        
        // Add turnover summary
        report.setTurnoverSummary(new InventoryReportDto.InventoryTurnoverSummary(
            4.2, "Java", "Database"));
        
        return report;
    }
    
    /**
     * Generate customer analytics report.
     */
    public CustomerAnalyticsDto generateCustomerAnalytics() {
        logger.info("Generating customer analytics report");
        
        LocalDate reportDate = LocalDate.now();
        
        // Calculate basic metrics
        Integer totalCustomers = Math.toIntExact(customerRepository.count());
        Integer activeCustomers = Math.toIntExact(customerRepository.count()) - 5; // Mock calculation
        BigDecimal averageCustomerValue = new BigDecimal("5500.00"); // Mock data
        
        CustomerAnalyticsDto report = new CustomerAnalyticsDto(reportDate, totalCustomers, 
                                                              activeCustomers, averageCustomerValue);
        
        // Add customer segments
        report.setSegments(generateCustomerSegments());
        
        // Add RFM analysis
        report.setRfmAnalysis(generateRFMAnalysis());
        
        // Add trends
        report.setTrends(generateCustomerTrends());
        
        return report;
    }
    
    /**
     * Generate dashboard KPIs.
     */
    public DashboardKpiDto generateDashboardKpis() {
        logger.info("Generating dashboard KPIs");
        
        LocalDate reportDate = LocalDate.now();
        DashboardKpiDto dashboard = new DashboardKpiDto(reportDate);
        
        // Revenue KPIs
        DashboardKpiDto.RevenueKpis revenueKpis = new DashboardKpiDto.RevenueKpis(
            new BigDecimal("2500.00"), // Today
            new BigDecimal("18000.00"), // Week
            new BigDecimal("75000.00"), // Month
            new BigDecimal("900000.00"), // Year
            12.5 // Growth %
        );
        dashboard.setRevenue(revenueKpis);
        
        // Order KPIs
        DashboardKpiDto.OrderKpis orderKpis = new DashboardKpiDto.OrderKpis(
            8, // Today
            45, // Week
            180, // Month
            new BigDecimal("420.00"), // AOV
            8.3 // Growth %
        );
        dashboard.setOrders(orderKpis);
        
        // Customer KPIs
        Integer totalCustomers = Math.toIntExact(customerRepository.count());
        DashboardKpiDto.CustomerKpis customerKpis = new DashboardKpiDto.CustomerKpis(
            totalCustomers,
            15, // New this month
            totalCustomers - 5, // Active
            85.2, // Retention %
            5.8 // Growth %
        );
        dashboard.setCustomers(customerKpis);
        
        // Inventory KPIs
        Integer totalProducts = Math.toIntExact(bookRepository.count());
        DashboardKpiDto.InventoryKpis inventoryKpis = new DashboardKpiDto.InventoryKpis(
            totalProducts,
            5, // Low stock
            2, // Out of stock
            new BigDecimal("150000.00"), // Total value
            4.2 // Turnover
        );
        dashboard.setInventory(inventoryKpis);
        
        // Trends
        dashboard.setTrends(generateTrendSummaries());
        
        return dashboard;
    }
    
    // Helper methods for calculations with caching
    private BigDecimal calculateTotalRevenue(LocalDate startDate, LocalDate endDate) {
        // Check cache first
        String cacheKey = "revenue_" + startDate + "_" + endDate;
        Optional<AggregationCache> cached = cacheRepository.findByKeyName(cacheKey);
        
        if (cached.isPresent() && 
            cached.get().getCreatedAt().isAfter(LocalDateTime.now().minusHours(1))) {
            // Return cached value if less than 1 hour old
            return new BigDecimal(cached.get().getValueData());
        }
        
        // Simplified calculation - in production would query order repository
        BigDecimal revenue = new BigDecimal("45000.00");
        
        // Cache the result
        AggregationCache cache = new AggregationCache();
        cache.setKeyName(cacheKey);
        cache.setValueData(revenue.toString());
        cache.setCreatedAt(LocalDateTime.now());
        cacheRepository.save(cache);
        
        return revenue;
    }
    
    private Integer calculateTotalOrders(LocalDate startDate, LocalDate endDate) {
        // Check cache first
        String cacheKey = "orders_" + startDate + "_" + endDate;
        Optional<AggregationCache> cached = cacheRepository.findByKeyName(cacheKey);
        
        if (cached.isPresent() && 
            cached.get().getCreatedAt().isAfter(LocalDateTime.now().minusHours(1))) {
            return Integer.valueOf(cached.get().getValueData());
        }
        
        // Simplified calculation - in production would query order repository
        Integer orders = 125;
        
        // Cache the result
        AggregationCache cache = new AggregationCache();
        cache.setKeyName(cacheKey);
        cache.setValueData(orders.toString());
        cache.setCreatedAt(LocalDateTime.now());
        cacheRepository.save(cache);
        
        return orders;
    }
    
    private List<SalesReportDto.SalesTrendItem> generateSalesTrends(LocalDate startDate, LocalDate endDate) {
        List<SalesReportDto.SalesTrendItem> trends = new ArrayList<>();
        // Generate sample trend data
        LocalDate current = startDate;
        while (!current.isAfter(endDate) && trends.size() < 30) {
            trends.add(new SalesReportDto.SalesTrendItem(
                current, 
                new BigDecimal(1500 + (int)(Math.random() * 1000)), 
                4 + (int)(Math.random() * 8)
            ));
            current = current.plusDays(1);
        }
        return trends;
    }
    
    private SalesReportDto.SalesBreakdown generateSalesBreakdown(LocalDate startDate, LocalDate endDate) {
        return new SalesReportDto.SalesBreakdown(
            new BigDecimal("28000.00"), // Online
            new BigDecimal("12000.00"), // Walk-in
            new BigDecimal("5000.00")   // Phone
        );
    }
    
    private List<InventoryReportDto.InventoryItem> generateInventoryItems() {
        return Arrays.asList(
            new InventoryReportDto.InventoryItem(1L, "Javaプログラミング入門", "Java", 15, 10, "OK", new BigDecimal("2880.00"), new BigDecimal("43200.00")),
            new InventoryReportDto.InventoryItem(2L, "Spring Boot実践ガイド", "Spring", 8, 10, "LOW", new BigDecimal("4050.00"), new BigDecimal("32400.00")),
            new InventoryReportDto.InventoryItem(3L, "React開発現場のテクニック", "React", 12, 8, "OK", new BigDecimal("3420.00"), new BigDecimal("41040.00")),
            new InventoryReportDto.InventoryItem(4L, "Python機械学習プログラミング", "Python", 0, 5, "OUT", new BigDecimal("3780.00"), new BigDecimal("0.00")),
            new InventoryReportDto.InventoryItem(5L, "AWSクラウド設計・構築ガイド", "AWS", 6, 8, "LOW", new BigDecimal("3240.00"), new BigDecimal("19440.00"))
        );
    }
    
    private List<InventoryReportDto.ReorderSuggestion> generateReorderSuggestions() {
        return Arrays.asList(
            new InventoryReportDto.ReorderSuggestion(4L, "Python機械学習プログラミング", 0, 10, "HIGH", 0),
            new InventoryReportDto.ReorderSuggestion(2L, "Spring Boot実践ガイド", 8, 5, "MEDIUM", 12),
            new InventoryReportDto.ReorderSuggestion(5L, "AWSクラウド設計・構築ガイド", 6, 5, "MEDIUM", 18)
        );
    }
    
    private List<CustomerAnalyticsDto.CustomerSegment> generateCustomerSegments() {
        return Arrays.asList(
            new CustomerAnalyticsDto.CustomerSegment("Premium", 15, new BigDecimal("45000.00"), 25.0, "High-value customers"),
            new CustomerAnalyticsDto.CustomerSegment("Regular", 35, new BigDecimal("82000.00"), 58.3, "Standard customers"),
            new CustomerAnalyticsDto.CustomerSegment("New", 10, new BigDecimal("12000.00"), 16.7, "Recent customers")
        );
    }
    
    private CustomerAnalyticsDto.RFMAnalysis generateRFMAnalysis() {
        List<CustomerAnalyticsDto.RFMSegment> segments = Arrays.asList(
            new CustomerAnalyticsDto.RFMSegment("Champions", 5, 5, 5, 8),
            new CustomerAnalyticsDto.RFMSegment("Loyal", 4, 4, 4, 12),
            new CustomerAnalyticsDto.RFMSegment("Potential", 3, 3, 3, 15),
            new CustomerAnalyticsDto.RFMSegment("At Risk", 2, 2, 2, 10)
        );
        
        return new CustomerAnalyticsDto.RFMAnalysis(segments, 8, 12, 15, 10);
    }
    
    private CustomerAnalyticsDto.CustomerTrends generateCustomerTrends() {
        List<CustomerAnalyticsDto.CustomerTrendItem> newCustomers = new ArrayList<>();
        List<CustomerAnalyticsDto.CustomerTrendItem> returningCustomers = new ArrayList<>();
        
        LocalDate current = LocalDate.now().minusDays(30);
        for (int i = 0; i < 30; i++) {
            newCustomers.add(new CustomerAnalyticsDto.CustomerTrendItem(current, 1 + (int)(Math.random() * 3), new BigDecimal("1500.00")));
            returningCustomers.add(new CustomerAnalyticsDto.CustomerTrendItem(current, 3 + (int)(Math.random() * 5), new BigDecimal("3500.00")));
            current = current.plusDays(1);
        }
        
        return new CustomerAnalyticsDto.CustomerTrends(newCustomers, returningCustomers, 85.2, 14.8);
    }
    
    private List<DashboardKpiDto.TrendSummary> generateTrendSummaries() {
        return Arrays.asList(
            new DashboardKpiDto.TrendSummary("Revenue", "Month", 12.5, "UP"),
            new DashboardKpiDto.TrendSummary("Orders", "Month", 8.3, "UP"),
            new DashboardKpiDto.TrendSummary("Customers", "Month", 5.8, "UP"),
            new DashboardKpiDto.TrendSummary("AOV", "Month", 4.2, "UP")
        );
    }
    
    // Additional report generation methods
    
    /**
     * Generate sales trend report for the specified date range.
     */
    public SalesReportDto generateSalesTrendReport(LocalDate startDate, LocalDate endDate) {
        logger.info("Generating sales trend report from {} to {}", startDate, endDate);
        
        SalesReportDto report = new SalesReportDto();
        report.setStartDate(startDate);
        report.setEndDate(endDate);
        report.setTrends(generateSalesTrends(startDate, endDate));
        
        return report;
    }
    
    /**
     * Generate sales ranking report with optional category filter.
     */
    public SalesReportDto generateSalesRankingReport(String category, int limit) {
        logger.info("Generating sales ranking report for category: {}, limit: {}", category, limit);
        
        SalesReportDto report = new SalesReportDto();
        report.setRankings(generateSalesRankings(category, limit));
        
        return report;
    }
    
    /**
     * Generate inventory turnover report with optional category filter.
     */
    public InventoryReportDto generateInventoryTurnoverReport(String category) {
        logger.info("Generating inventory turnover report for category: {}", category);
        
        InventoryReportDto report = new InventoryReportDto();
        report.setTurnoverSummary(new InventoryReportDto.InventoryTurnoverSummary(
            4.2, category != null ? category : "All", "Top performing category"));
        
        return report;
    }
    
    /**
     * Generate reorder suggestions report.
     */
    public InventoryReportDto generateReorderSuggestionsReport() {
        logger.info("Generating reorder suggestions report");
        
        InventoryReportDto report = new InventoryReportDto();
        report.setReorderSuggestions(generateReorderSuggestions());
        
        return report;
    }
    
    /**
     * Generate RFM analysis report.
     */
    public CustomerAnalyticsDto generateRFMAnalysisReport() {
        logger.info("Generating RFM analysis report");
        
        CustomerAnalyticsDto report = new CustomerAnalyticsDto();
        report.setRfmAnalysis(generateRFMAnalysis());
        
        return report;
    }
    
    /**
     * Generate customer segments report.
     */
    public CustomerAnalyticsDto generateCustomerSegmentsReport() {
        logger.info("Generating customer segments report");
        
        CustomerAnalyticsDto report = new CustomerAnalyticsDto();
        report.setSegments(generateCustomerSegments());
        
        return report;
    }
    
    /**
     * Generate dashboard trends report.
     */
    public DashboardKpiDto generateDashboardTrends() {
        logger.info("Generating dashboard trends report");
        
        DashboardKpiDto dashboard = new DashboardKpiDto();
        dashboard.setTrends(generateTrendSummaries());
        
        return dashboard;
    }
    
    /**
     * Generate tech trends report.
     */
    public SalesReportDto generateTechTrendsReport(int days) {
        logger.info("Generating tech trends report for {} days", days);
        
        LocalDate startDate = LocalDate.now().minusDays(days);
        LocalDate endDate = LocalDate.now();
        
        return generateSalesReport(startDate, endDate);
    }
    
    /**
     * Generate category trends report.
     */
    public SalesReportDto generateCategoryTrendsReport(String category, int days) {
        logger.info("Generating category trends report for {} over {} days", category, days);
        
        LocalDate startDate = LocalDate.now().minusDays(days);
        LocalDate endDate = LocalDate.now();
        
        SalesReportDto report = new SalesReportDto();
        report.setStartDate(startDate);
        report.setEndDate(endDate);
        report.setTrends(generateSalesTrends(startDate, endDate));
        
        return report;
    }
    
    /**
     * Generate custom report based on request parameters.
     */
    public SalesReportDto generateCustomReport(CustomReportRequest request) {
        logger.info("Generating custom report of type: {}", request.getReportType());
        
        LocalDate startDate = request.getStartDate() != null ? request.getStartDate() : LocalDate.now().minusDays(30);
        LocalDate endDate = request.getEndDate() != null ? request.getEndDate() : LocalDate.now();
        
        return generateSalesReport(startDate, endDate);
    }
    
    // Updated helper method to support filtering
    private List<SalesReportDto.SalesRankingItem> generateSalesRankings(String category, int limit) {
        List<SalesReportDto.SalesRankingItem> allRankings = Arrays.asList(
            new SalesReportDto.SalesRankingItem("Java", "Javaプログラミング入門", new BigDecimal("8640.00"), 3, 1),
            new SalesReportDto.SalesRankingItem("Spring", "Spring Boot実践ガイド", new BigDecimal("8100.00"), 2, 2),
            new SalesReportDto.SalesRankingItem("React", "React開発現場のテクニック", new BigDecimal("6840.00"), 2, 3),
            new SalesReportDto.SalesRankingItem("Python", "Python機械学習プログラミング", new BigDecimal("7560.00"), 2, 4),
            new SalesReportDto.SalesRankingItem("AWS", "AWSクラウド設計・構築ガイド", new BigDecimal("6480.00"), 2, 5)
        );
        
        return allRankings.stream()
                .filter(item -> category == null || item.getCategory().equalsIgnoreCase(category))
                .limit(limit)
                .collect(Collectors.toList());
    }
}