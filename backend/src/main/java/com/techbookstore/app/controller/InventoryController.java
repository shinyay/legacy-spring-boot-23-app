package com.techbookstore.app.controller;

import com.techbookstore.app.dto.InventoryDto;
import com.techbookstore.app.entity.Inventory;
import com.techbookstore.app.repository.InventoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/inventory")
@CrossOrigin(origins = "http://localhost:3000")
public class InventoryController {

    @Autowired
    private InventoryRepository inventoryRepository;

    @GetMapping
    public ResponseEntity<List<InventoryDto>> getAllInventory() {
        List<Inventory> inventories = inventoryRepository.findAll();
        List<InventoryDto> inventoryDtos = inventories.stream()
                .map(InventoryDto::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(inventoryDtos);
    }

    @GetMapping("/{bookId}")
    public ResponseEntity<InventoryDto> getInventoryByBookId(@PathVariable Long bookId) {
        Optional<Inventory> inventory = inventoryRepository.findByBookId(bookId);
        if (inventory.isPresent()) {
            return ResponseEntity.ok(new InventoryDto(inventory.get()));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/alerts")
    public ResponseEntity<List<InventoryDto>> getInventoryAlerts() {
        List<Inventory> lowStockItems = inventoryRepository.findLowStockItems();
        List<InventoryDto> inventoryDtos = lowStockItems.stream()
                .map(InventoryDto::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(inventoryDtos);
    }

    @GetMapping("/out-of-stock")
    public ResponseEntity<List<InventoryDto>> getOutOfStockItems() {
        List<Inventory> outOfStockItems = inventoryRepository.findOutOfStockItems();
        List<InventoryDto> inventoryDtos = outOfStockItems.stream()
                .map(InventoryDto::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(inventoryDtos);
    }

    @PostMapping("/receive")
    public ResponseEntity<InventoryDto> receiveStock(@RequestBody ReceiveStockRequest request) {
        Optional<Inventory> inventoryOpt = inventoryRepository.findByBookId(request.getBookId());
        
        if (inventoryOpt.isPresent()) {
            Inventory inventory = inventoryOpt.get();
            
            if ("STORE".equals(request.getLocation())) {
                inventory.setStoreStock(inventory.getStoreStock() + request.getQuantity());
            } else {
                inventory.setWarehouseStock(inventory.getWarehouseStock() + request.getQuantity());
            }
            
            inventory.setLastReceivedDate(LocalDate.now());
            Inventory savedInventory = inventoryRepository.save(inventory);
            return ResponseEntity.ok(new InventoryDto(savedInventory));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/sell")
    public ResponseEntity<InventoryDto> sellStock(@RequestBody SellStockRequest request) {
        Optional<Inventory> inventoryOpt = inventoryRepository.findByBookId(request.getBookId());
        
        if (inventoryOpt.isPresent()) {
            Inventory inventory = inventoryOpt.get();
            
            // Check if enough stock is available
            if (inventory.getAvailableStock() >= request.getQuantity()) {
                inventory.setStoreStock(inventory.getStoreStock() - request.getQuantity());
                inventory.setLastSoldDate(LocalDate.now());
                Inventory savedInventory = inventoryRepository.save(inventory);
                return ResponseEntity.ok(new InventoryDto(savedInventory));
            } else {
                return ResponseEntity.badRequest().build(); // Insufficient stock
            }
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/adjust")
    public ResponseEntity<InventoryDto> adjustStock(@RequestBody AdjustStockRequest request) {
        Optional<Inventory> inventoryOpt = inventoryRepository.findByBookId(request.getBookId());
        
        if (inventoryOpt.isPresent()) {
            Inventory inventory = inventoryOpt.get();
            inventory.setStoreStock(request.getStoreStock());
            inventory.setWarehouseStock(request.getWarehouseStock());
            Inventory savedInventory = inventoryRepository.save(inventory);
            return ResponseEntity.ok(new InventoryDto(savedInventory));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Request DTOs
    public static class ReceiveStockRequest {
        private Long bookId;
        private Integer quantity;
        private String location; // STORE or WAREHOUSE

        public Long getBookId() { return bookId; }
        public void setBookId(Long bookId) { this.bookId = bookId; }
        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }
        public String getLocation() { return location; }
        public void setLocation(String location) { this.location = location; }
    }

    public static class SellStockRequest {
        private Long bookId;
        private Integer quantity;

        public Long getBookId() { return bookId; }
        public void setBookId(Long bookId) { this.bookId = bookId; }
        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }
    }

    public static class AdjustStockRequest {
        private Long bookId;
        private Integer storeStock;
        private Integer warehouseStock;

        public Long getBookId() { return bookId; }
        public void setBookId(Long bookId) { this.bookId = bookId; }
        public Integer getStoreStock() { return storeStock; }
        public void setStoreStock(Integer storeStock) { this.storeStock = storeStock; }
        public Integer getWarehouseStock() { return warehouseStock; }
        public void setWarehouseStock(Integer warehouseStock) { this.warehouseStock = warehouseStock; }
    }
}