package com.techbookstore.app.dto;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.time.LocalDate;

/**
 * DTO for custom report requests.
 */
public class CustomReportRequest {
    
    @NotBlank(message = "Report type is required")
    @Size(max = 50, message = "Report type must not exceed 50 characters")
    private String reportType;
    
    private LocalDate startDate;
    private LocalDate endDate;
    
    @Size(max = 100, message = "Category must not exceed 100 characters")
    private String category;
    
    @Size(max = 500, message = "Parameters must not exceed 500 characters")
    private String parameters;
    
    // Constructors
    public CustomReportRequest() {}
    
    public CustomReportRequest(String reportType, LocalDate startDate, LocalDate endDate) {
        this.reportType = reportType;
        this.startDate = startDate;
        this.endDate = endDate;
    }
    
    // Getters and Setters
    public String getReportType() { 
        return reportType; 
    }
    
    public void setReportType(String reportType) { 
        this.reportType = reportType; 
    }
    
    public LocalDate getStartDate() { 
        return startDate; 
    }
    
    public void setStartDate(LocalDate startDate) { 
        this.startDate = startDate; 
    }
    
    public LocalDate getEndDate() { 
        return endDate; 
    }
    
    public void setEndDate(LocalDate endDate) { 
        this.endDate = endDate; 
    }
    
    public String getCategory() { 
        return category; 
    }
    
    public void setCategory(String category) { 
        this.category = category; 
    }
    
    public String getParameters() { 
        return parameters; 
    }
    
    public void setParameters(String parameters) { 
        this.parameters = parameters; 
    }
    
    // Validation methods
    public boolean isValidDateRange() {
        if (startDate == null || endDate == null) {
            return true; // Optional dates
        }
        return !startDate.isAfter(endDate);
    }
}