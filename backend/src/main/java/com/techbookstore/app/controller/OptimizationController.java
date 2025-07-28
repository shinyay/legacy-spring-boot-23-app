package com.techbookstore.app.controller;

import com.techbookstore.app.dto.OptimalStockDto;
import com.techbookstore.app.entity.OptimalStockSettings;
import com.techbookstore.app.service.OptimalStockCalculatorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST Controller for inventory optimization functionality
 * 在庫最適化機能のRESTコントローラー
 */
@RestController
@RequestMapping("/api/v1/optimization")
public class OptimizationController {

    private final OptimalStockCalculatorService optimalStockCalculatorService;

    public OptimizationController(OptimalStockCalculatorService optimalStockCalculatorService) {
        this.optimalStockCalculatorService = optimalStockCalculatorService;
    }

    /**
     * Get optimal stock level for a specific book
     * GET /api/v1/optimization/optimal-stock/{bookId}
     */
    @GetMapping("/optimal-stock/{bookId}")
    public ResponseEntity<OptimalStockDto> getOptimalStock(@PathVariable Long bookId) {
        OptimalStockDto optimalStock = optimalStockCalculatorService.calculateOptimalStock(bookId);
        return ResponseEntity.ok(optimalStock);
    }

    /**
     * Save optimal stock settings
     * POST /api/v1/optimization/optimal-stock
     */
    @PostMapping("/optimal-stock")
    public ResponseEntity<OptimalStockSettings> saveOptimalStockSettings(@RequestBody OptimalStockDto dto) {
        OptimalStockSettings settings = optimalStockCalculatorService.saveOptimalStockSettings(dto);
        return ResponseEntity.ok(settings);
    }

    /**
     * Get intelligent order suggestions
     * POST /api/v1/optimization/order-suggestions
     */
    @PostMapping("/order-suggestions")
    public ResponseEntity<List<OptimalStockDto>> getOrderSuggestions(@RequestBody List<Long> bookIds) {
        List<OptimalStockDto> suggestions = bookIds.stream()
            .map(optimalStockCalculatorService::calculateOptimalStock)
            .filter(stock -> "REORDER_NEEDED".equals(stock.getStockStatus()) || "UNDERSTOCK".equals(stock.getStockStatus()))
            .toList();
        
        return ResponseEntity.ok(suggestions);
    }

    /**
     * Get books that need reordering
     * GET /api/v1/optimization/reorder-needed
     */
    @GetMapping("/reorder-needed")
    public ResponseEntity<List<OptimalStockDto>> getBooksNeedingReorder() {
        List<OptimalStockDto> booksNeedingReorder = optimalStockCalculatorService.getBooksNeedingReorder();
        return ResponseEntity.ok(booksNeedingReorder);
    }

    /**
     * Get constraint analysis summary
     * GET /api/v1/optimization/constraint-analysis
     */
    @GetMapping("/constraint-analysis")
    public ResponseEntity<Map<String, Object>> getConstraintAnalysis() {
        List<OptimalStockDto> allBooksNeedingReorder = optimalStockCalculatorService.getBooksNeedingReorder();
        
        // Calculate summary statistics
        int totalBooksNeedingReorder = allBooksNeedingReorder.size();
        double totalEstimatedCost = allBooksNeedingReorder.stream()
            .filter(book -> book.getEstimatedCost() != null)
            .mapToDouble(book -> book.getEstimatedCost().doubleValue())
            .sum();
        
        double totalEstimatedRevenue = allBooksNeedingReorder.stream()
            .filter(book -> book.getEstimatedRevenue() != null)
            .mapToDouble(book -> book.getEstimatedRevenue().doubleValue())
            .sum();
        
        // Count by status
        long reorderNeeded = allBooksNeedingReorder.stream()
            .filter(book -> "REORDER_NEEDED".equals(book.getStockStatus()))
            .count();
        
        long understock = allBooksNeedingReorder.stream()
            .filter(book -> "UNDERSTOCK".equals(book.getStockStatus()))
            .count();
        
        Map<String, Object> analysis = Map.of(
            "totalBooksNeedingReorder", totalBooksNeedingReorder,
            "totalEstimatedCost", totalEstimatedCost,
            "totalEstimatedRevenue", totalEstimatedRevenue,
            "estimatedProfit", totalEstimatedRevenue - totalEstimatedCost,
            "statusBreakdown", Map.of(
                "reorderNeeded", reorderNeeded,
                "understock", understock
            ),
            "recommendations", generateRecommendations(allBooksNeedingReorder)
        );
        
        return ResponseEntity.ok(analysis);
    }

    /**
     * Bulk calculate optimal stock for multiple books
     * POST /api/v1/optimization/bulk-calculate
     */
    @PostMapping("/bulk-calculate")
    public ResponseEntity<List<OptimalStockDto>> bulkCalculateOptimalStock(@RequestBody List<Long> bookIds) {
        List<OptimalStockDto> results = bookIds.stream()
            .map(optimalStockCalculatorService::calculateOptimalStock)
            .toList();
        
        return ResponseEntity.ok(results);
    }

    /**
     * Generate recommendations based on current inventory state
     */
    private List<String> generateRecommendations(List<OptimalStockDto> booksNeedingReorder) {
        List<String> recommendations = new java.util.ArrayList<>();
        
        if (booksNeedingReorder.isEmpty()) {
            recommendations.add("All books are optimally stocked");
            return recommendations;
        }
        
        // Priority recommendations
        long criticalBooks = booksNeedingReorder.stream()
            .filter(book -> "REORDER_NEEDED".equals(book.getStockStatus()))
            .count();
        
        if (criticalBooks > 0) {
            recommendations.add(String.format("Immediate action required: %d books need reordering", criticalBooks));
        }
        
        // Budget recommendations
        double totalCost = booksNeedingReorder.stream()
            .filter(book -> book.getEstimatedCost() != null)
            .mapToDouble(book -> book.getEstimatedCost().doubleValue())
            .sum();
        
        if (totalCost > 10000) {
            recommendations.add("Consider prioritizing high-value or fast-moving items due to high total cost");
        }
        
        // Seasonal recommendations
        java.time.LocalDate now = java.time.LocalDate.now();
        if (now.getMonthValue() >= 8 && now.getMonthValue() <= 10) {
            recommendations.add("Consider increasing orders due to back-to-school season");
        } else if (now.getMonthValue() == 12 || now.getMonthValue() == 1) {
            recommendations.add("Review year-end inventory levels and New Year learning trends");
        }
        
        return recommendations;
    }
}