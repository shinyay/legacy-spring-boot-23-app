package com.techbookstore.app.controller;

import com.techbookstore.app.dto.OrderDto;
import com.techbookstore.app.entity.Book;
import com.techbookstore.app.entity.Order;
import com.techbookstore.app.entity.OrderItem;
import com.techbookstore.app.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/orders")
@CrossOrigin(origins = "http://localhost:3000")
public class OrderController {
    
    @Autowired
    private OrderService orderService;
    
    @PostMapping
    public ResponseEntity<OrderDto> createOrder(@RequestBody CreateOrderRequest request) {
        try {
            Order order = new Order(request.getType(), request.getPaymentMethod());
            order.setCustomerId(request.getCustomerId());
            order.setNotes(request.getNotes());
            
            // Convert request items to OrderItems
            for (CreateOrderRequest.OrderItemRequest itemRequest : request.getOrderItems()) {
                OrderItem orderItem = new OrderItem();
                Book book = new Book();
                book.setId(itemRequest.getBookId());
                orderItem.setBook(book);
                orderItem.setQuantity(itemRequest.getQuantity());
                orderItem.setOrder(order);
                order.getOrderItems().add(orderItem);
            }
            
            Order savedOrder = orderService.createOrder(order);
            return ResponseEntity.ok(new OrderDto(savedOrder));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping
    public ResponseEntity<Page<OrderDto>> getAllOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "orderDate") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) Long customerId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @RequestParam(required = false) String keyword) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") 
            ? Sort.by(sortBy).descending() 
            : Sort.by(sortBy).ascending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<Order> orders;
        if (keyword != null && !keyword.trim().isEmpty()) {
            orders = orderService.searchOrders(keyword.trim(), pageable);
        } else {
            Order.OrderStatus orderStatus = status != null ? Order.OrderStatus.valueOf(status) : null;
            Order.OrderType orderType = type != null ? Order.OrderType.valueOf(type) : null;
            orders = orderService.getOrdersWithFilters(orderStatus, orderType, customerId, startDate, endDate, pageable);
        }
        
        Page<OrderDto> orderDtos = orders.map(OrderDto::new);
        return ResponseEntity.ok(orderDtos);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<OrderDto> getOrderById(@PathVariable Long id) {
        Optional<Order> order = orderService.getOrderById(id);
        if (order.isPresent()) {
            return ResponseEntity.ok(new OrderDto(order.get()));
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/number/{orderNumber}")
    public ResponseEntity<OrderDto> getOrderByNumber(@PathVariable String orderNumber) {
        Optional<Order> order = orderService.getOrderByNumber(orderNumber);
        if (order.isPresent()) {
            return ResponseEntity.ok(new OrderDto(order.get()));
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<OrderDto>> getOrdersByCustomerId(@PathVariable Long customerId) {
        List<Order> orders = orderService.getOrdersByCustomerId(customerId);
        List<OrderDto> orderDtos = orders.stream()
                .map(OrderDto::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(orderDtos);
    }
    
    @PostMapping("/{id}/confirm")
    public ResponseEntity<OrderDto> confirmOrder(@PathVariable Long id) {
        try {
            Order order = orderService.confirmOrder(id);
            return ResponseEntity.ok(new OrderDto(order));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/{id}/pick")
    public ResponseEntity<OrderDto> pickOrder(@PathVariable Long id) {
        try {
            Order order = orderService.updateOrderStatus(id, Order.OrderStatus.PICKING);
            return ResponseEntity.ok(new OrderDto(order));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/{id}/ship")
    public ResponseEntity<OrderDto> shipOrder(@PathVariable Long id) {
        try {
            Order order = orderService.updateOrderStatus(id, Order.OrderStatus.SHIPPED);
            return ResponseEntity.ok(new OrderDto(order));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/{id}/deliver")
    public ResponseEntity<OrderDto> deliverOrder(@PathVariable Long id) {
        try {
            Order order = orderService.updateOrderStatus(id, Order.OrderStatus.DELIVERED);
            return ResponseEntity.ok(new OrderDto(order));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/stats/status-count")
    public ResponseEntity<StatusCountResponse> getOrderStatusCounts() {
        StatusCountResponse response = new StatusCountResponse();
        response.setPending(orderService.getOrderCountByStatus(Order.OrderStatus.PENDING));
        response.setConfirmed(orderService.getOrderCountByStatus(Order.OrderStatus.CONFIRMED));
        response.setPicking(orderService.getOrderCountByStatus(Order.OrderStatus.PICKING));
        response.setShipped(orderService.getOrderCountByStatus(Order.OrderStatus.SHIPPED));
        response.setDelivered(orderService.getOrderCountByStatus(Order.OrderStatus.DELIVERED));
        response.setCancelled(orderService.getOrderCountByStatus(Order.OrderStatus.CANCELLED));
        return ResponseEntity.ok(response);
    }
    
    // Request DTOs
    public static class CreateOrderRequest {
        private Long customerId;
        private Order.OrderType type;
        private Order.PaymentMethod paymentMethod;
        private String notes;
        private List<OrderItemRequest> orderItems;
        
        public static class OrderItemRequest {
            private Long bookId;
            private Integer quantity;
            
            public Long getBookId() { return bookId; }
            public void setBookId(Long bookId) { this.bookId = bookId; }
            public Integer getQuantity() { return quantity; }
            public void setQuantity(Integer quantity) { this.quantity = quantity; }
        }
        
        public Long getCustomerId() { return customerId; }
        public void setCustomerId(Long customerId) { this.customerId = customerId; }
        public Order.OrderType getType() { return type; }
        public void setType(Order.OrderType type) { this.type = type; }
        public Order.PaymentMethod getPaymentMethod() { return paymentMethod; }
        public void setPaymentMethod(Order.PaymentMethod paymentMethod) { this.paymentMethod = paymentMethod; }
        public String getNotes() { return notes; }
        public void setNotes(String notes) { this.notes = notes; }
        public List<OrderItemRequest> getOrderItems() { return orderItems; }
        public void setOrderItems(List<OrderItemRequest> orderItems) { this.orderItems = orderItems; }
    }
    
    public static class StatusCountResponse {
        private Long pending;
        private Long confirmed;
        private Long picking;
        private Long shipped;
        private Long delivered;
        private Long cancelled;
        
        public Long getPending() { return pending; }
        public void setPending(Long pending) { this.pending = pending; }
        public Long getConfirmed() { return confirmed; }
        public void setConfirmed(Long confirmed) { this.confirmed = confirmed; }
        public Long getPicking() { return picking; }
        public void setPicking(Long picking) { this.picking = picking; }
        public Long getShipped() { return shipped; }
        public void setShipped(Long shipped) { this.shipped = shipped; }
        public Long getDelivered() { return delivered; }
        public void setDelivered(Long delivered) { this.delivered = delivered; }
        public Long getCancelled() { return cancelled; }
        public void setCancelled(Long cancelled) { this.cancelled = cancelled; }
    }
}