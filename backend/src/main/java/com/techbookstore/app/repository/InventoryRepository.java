package com.techbookstore.app.repository;

import com.techbookstore.app.entity.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Long> {

    Optional<Inventory> findByBookId(Long bookId);

    @Query("SELECT i FROM Inventory i WHERE " +
           "(i.storeStock + i.warehouseStock) <= i.reorderPoint AND i.reorderPoint IS NOT NULL")
    List<Inventory> findLowStockItems();

    @Query("SELECT i FROM Inventory i WHERE " +
           "(i.storeStock + i.warehouseStock) = 0")
    List<Inventory> findOutOfStockItems();

    @Query("SELECT i FROM Inventory i WHERE " +
           "(i.storeStock + i.warehouseStock - i.reservedCount) <= 0")
    List<Inventory> findUnavailableItems();

    @Query("SELECT i FROM Inventory i ORDER BY " +
           "(i.storeStock + i.warehouseStock) ASC")
    List<Inventory> findAllOrderByStockAsc();
}