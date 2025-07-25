package com.techbookstore.app.service;

import com.techbookstore.app.entity.Book;
import com.techbookstore.app.entity.Inventory;
import com.techbookstore.app.entity.Order;
import com.techbookstore.app.entity.OrderItem;
import com.techbookstore.app.repository.BookRepository;
import com.techbookstore.app.repository.InventoryRepository;
import com.techbookstore.app.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class OrderService {
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private BookRepository bookRepository;
    
    @Autowired
    private InventoryRepository inventoryRepository;
    
    public Order createOrder(Order order) {
        // Generate order number
        order.setOrderNumber(generateOrderNumber());
        
        // Calculate total amount
        BigDecimal totalAmount = BigDecimal.ZERO;
        for (OrderItem item : order.getOrderItems()) {
            // Validate book exists
            Optional<Book> bookOpt = bookRepository.findById(item.getBook().getId());
            if (!bookOpt.isPresent()) {
                throw new RuntimeException("Book not found: " + item.getBook().getId());
            }
            
            Book book = bookOpt.get();
            item.setBook(book);
            item.setUnitPrice(book.getSellingPrice());
            item.setTotalPrice(item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
            item.setOrder(order);
            
            totalAmount = totalAmount.add(item.getTotalPrice());
        }
        
        order.setTotalAmount(totalAmount);
        return orderRepository.save(order);
    }
    
    public Order confirmOrder(Long orderId) {
        Optional<Order> orderOpt = orderRepository.findById(orderId);
        if (!orderOpt.isPresent()) {
            throw new RuntimeException("Order not found: " + orderId);
        }
        
        Order order = orderOpt.get();
        if (order.getStatus() != Order.OrderStatus.PENDING) {
            throw new RuntimeException("Order is not in PENDING status");
        }
        
        // Check inventory and reserve stock
        for (OrderItem item : order.getOrderItems()) {
            Optional<Inventory> inventoryOpt = inventoryRepository.findByBookId(item.getBook().getId());
            if (!inventoryOpt.isPresent()) {
                throw new RuntimeException("Inventory not found for book: " + item.getBook().getId());
            }
            
            Inventory inventory = inventoryOpt.get();
            if (inventory.getAvailableStock() < item.getQuantity()) {
                throw new RuntimeException("Insufficient stock for book: " + item.getBook().getTitle());
            }
            
            // Reserve stock (reduce store stock)
            inventory.setStoreStock(inventory.getStoreStock() - item.getQuantity());
            inventoryRepository.save(inventory);
        }
        
        order.setStatus(Order.OrderStatus.CONFIRMED);
        order.setConfirmedDate(LocalDateTime.now());
        return orderRepository.save(order);
    }
    
    public Order updateOrderStatus(Long orderId, Order.OrderStatus newStatus) {
        Optional<Order> orderOpt = orderRepository.findById(orderId);
        if (!orderOpt.isPresent()) {
            throw new RuntimeException("Order not found: " + orderId);
        }
        
        Order order = orderOpt.get();
        
        // Validate status transition
        if (!isValidStatusTransition(order.getStatus(), newStatus)) {
            throw new RuntimeException("Invalid status transition from " + order.getStatus() + " to " + newStatus);
        }
        
        order.setStatus(newStatus);
        
        // Set specific timestamps based on status
        switch (newStatus) {
            case CONFIRMED:
                order.setConfirmedDate(LocalDateTime.now());
                break;
            case SHIPPED:
                order.setShippedDate(LocalDateTime.now());
                break;
            case DELIVERED:
                order.setDeliveredDate(LocalDateTime.now());
                break;
        }
        
        return orderRepository.save(order);
    }
    
    public Page<Order> getOrdersWithFilters(Order.OrderStatus status,
                                          Order.OrderType type,
                                          Long customerId,
                                          LocalDateTime startDate,
                                          LocalDateTime endDate,
                                          Pageable pageable) {
        return orderRepository.findOrdersWithFilters(status, type, customerId, startDate, endDate, pageable);
    }
    
    public Page<Order> searchOrders(String keyword, Pageable pageable) {
        return orderRepository.findByKeyword(keyword, pageable);
    }
    
    public Optional<Order> getOrderById(Long id) {
        return orderRepository.findById(id);
    }
    
    public Optional<Order> getOrderByNumber(String orderNumber) {
        return orderRepository.findByOrderNumber(orderNumber);
    }
    
    public List<Order> getOrdersByCustomerId(Long customerId) {
        return orderRepository.findByCustomerId(customerId);
    }
    
    public Long getOrderCountByStatus(Order.OrderStatus status) {
        return orderRepository.countByStatus(status);
    }
    
    private String generateOrderNumber() {
        String date = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        Long count = orderRepository.count() + 1;
        return String.format("ORD-%s-%04d", date, count);
    }
    
    private boolean isValidStatusTransition(Order.OrderStatus currentStatus, Order.OrderStatus newStatus) {
        if (currentStatus == newStatus) {
            return true;
        }
        
        switch (currentStatus) {
            case PENDING:
                return newStatus == Order.OrderStatus.CONFIRMED || newStatus == Order.OrderStatus.CANCELLED;
            case CONFIRMED:
                return newStatus == Order.OrderStatus.PICKING || newStatus == Order.OrderStatus.CANCELLED;
            case PICKING:
                return newStatus == Order.OrderStatus.SHIPPED || newStatus == Order.OrderStatus.CANCELLED;
            case SHIPPED:
                return newStatus == Order.OrderStatus.DELIVERED;
            case DELIVERED:
            case CANCELLED:
                return false; // Terminal states
            default:
                return false;
        }
    }
}