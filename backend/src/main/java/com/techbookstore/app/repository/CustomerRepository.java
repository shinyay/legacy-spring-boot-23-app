package com.techbookstore.app.repository;

import com.techbookstore.app.entity.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    
    Optional<Customer> findByEmail(String email);
    
    List<Customer> findByStatus(Customer.CustomerStatus status);
    
    List<Customer> findByCustomerType(Customer.CustomerType customerType);
    
    @Query("SELECT c FROM Customer c WHERE c.status != 'DELETED'")
    List<Customer> findAllActive();
    
    @Query("SELECT c FROM Customer c WHERE c.status != 'DELETED'")
    Page<Customer> findAllActive(Pageable pageable);
    
    @Query("SELECT c FROM Customer c WHERE " +
           "c.status != 'DELETED' AND " +
           "(LOWER(c.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(c.email) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(c.companyName) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Customer> findByKeyword(@Param("keyword") String keyword, Pageable pageable);
    
    @Query("SELECT c FROM Customer c WHERE " +
           "c.status != 'DELETED' AND " +
           "(:customerType IS NULL OR c.customerType = :customerType) AND " +
           "(:status IS NULL OR c.status = :status) AND " +
           "(:startDate IS NULL OR c.createdAt >= :startDate) AND " +
           "(:endDate IS NULL OR c.createdAt <= :endDate)")
    Page<Customer> findCustomersWithFilters(@Param("customerType") Customer.CustomerType customerType,
                                          @Param("status") Customer.CustomerStatus status,
                                          @Param("startDate") LocalDateTime startDate,
                                          @Param("endDate") LocalDateTime endDate,
                                          Pageable pageable);
    
    @Query("SELECT COUNT(c) FROM Customer c WHERE c.status = :status")
    Long countByStatus(@Param("status") Customer.CustomerStatus status);
    
    @Query("SELECT c FROM Customer c WHERE c.createdAt >= :startDate AND c.createdAt <= :endDate")
    List<Customer> findByCreatedAtBetween(@Param("startDate") LocalDateTime startDate, 
                                        @Param("endDate") LocalDateTime endDate);
    
    boolean existsByEmail(String email);
    
    boolean existsByEmailAndIdNot(String email, Long id);
}