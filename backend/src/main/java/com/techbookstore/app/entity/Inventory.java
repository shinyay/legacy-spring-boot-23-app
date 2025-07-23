package com.techbookstore.app.entity;

import javax.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "inventory")
public class Inventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "book_id", nullable = false, unique = true)
    private Book book;

    @Column(name = "store_stock")
    private Integer storeStock = 0;

    @Column(name = "warehouse_stock")
    private Integer warehouseStock = 0;

    @Column(name = "reserved_count")
    private Integer reservedCount = 0;

    @Column(name = "location_code", length = 20)
    private String locationCode;

    @Column(name = "reorder_point")
    private Integer reorderPoint;

    @Column(name = "reorder_quantity")
    private Integer reorderQuantity;

    @Column(name = "last_received_date")
    private LocalDate lastReceivedDate;

    @Column(name = "last_sold_date")
    private LocalDate lastSoldDate;

    // Constructors
    public Inventory() {}

    public Inventory(Book book) {
        this.book = book;
    }

    // Calculated methods
    public Integer getTotalStock() {
        return (storeStock != null ? storeStock : 0) + (warehouseStock != null ? warehouseStock : 0);
    }

    public Integer getAvailableStock() {
        return getTotalStock() - (reservedCount != null ? reservedCount : 0);
    }

    public boolean isLowStock() {
        return reorderPoint != null && getTotalStock() <= reorderPoint;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Book getBook() {
        return book;
    }

    public void setBook(Book book) {
        this.book = book;
    }

    public Integer getStoreStock() {
        return storeStock;
    }

    public void setStoreStock(Integer storeStock) {
        this.storeStock = storeStock != null ? storeStock : 0;
    }

    public Integer getWarehouseStock() {
        return warehouseStock;
    }

    public void setWarehouseStock(Integer warehouseStock) {
        this.warehouseStock = warehouseStock != null ? warehouseStock : 0;
    }

    public Integer getReservedCount() {
        return reservedCount;
    }

    public void setReservedCount(Integer reservedCount) {
        this.reservedCount = reservedCount != null ? reservedCount : 0;
    }

    public String getLocationCode() {
        return locationCode;
    }

    public void setLocationCode(String locationCode) {
        this.locationCode = locationCode;
    }

    public Integer getReorderPoint() {
        return reorderPoint;
    }

    public void setReorderPoint(Integer reorderPoint) {
        this.reorderPoint = reorderPoint != null ? reorderPoint : 0;
    }

    public Integer getReorderQuantity() {
        return reorderQuantity;
    }

    public void setReorderQuantity(Integer reorderQuantity) {
        this.reorderQuantity = reorderQuantity != null ? reorderQuantity : 0;
    }

    public LocalDate getLastReceivedDate() {
        return lastReceivedDate;
    }

    public void setLastReceivedDate(LocalDate lastReceivedDate) {
        this.lastReceivedDate = lastReceivedDate;
    }

    public LocalDate getLastSoldDate() {
        return lastSoldDate;
    }

    public void setLastSoldDate(LocalDate lastSoldDate) {
        this.lastSoldDate = lastSoldDate;
    }
}