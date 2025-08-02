package com.techbookstore.app.controller;

import com.techbookstore.app.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

/**
 * REST API for internationalization support.
 */
@RestController
@RequestMapping("/api/v1/i18n")
@CrossOrigin(origins = "${app.cors.allowed-origins:http://localhost:3000}")
public class I18nController {
    
    private final MessageService messageService;
    
    @Autowired
    public I18nController(MessageService messageService) {
        this.messageService = messageService;
    }
    
    /**
     * Get messages for current locale.
     */
    @GetMapping("/messages")
    public Map<String, String> getMessages(HttpServletRequest request) {
        // Set locale based on Accept-Language header
        String acceptLanguage = request.getHeader("Accept-Language");
        Locale locale = Locale.JAPANESE; // default
        if (acceptLanguage != null && acceptLanguage.startsWith("en")) {
            locale = Locale.ENGLISH;
        }
        LocaleContextHolder.setLocale(locale);
        
        Map<String, String> messages = new HashMap<>();
        
        // Common labels
        messages.put("app.title", messageService.getMessage("app.title"));
        messages.put("app.welcome", messageService.getMessage("app.welcome"));
        messages.put("app.language", messageService.getMessage("app.language"));
        
        // Inventory management
        messages.put("inventory.title", messageService.getMessage("inventory.title"));
        messages.put("inventory.book.title", messageService.getMessage("inventory.book.title"));
        messages.put("inventory.available.stock", messageService.getMessage("inventory.available.stock"));
        messages.put("inventory.status", messageService.getMessage("inventory.status"));
        messages.put("inventory.location", messageService.getMessage("inventory.location"));
        messages.put("inventory.actions", messageService.getMessage("inventory.actions"));
        messages.put("inventory.receive", messageService.getMessage("inventory.receive"));
        messages.put("inventory.sell", messageService.getMessage("inventory.sell"));
        messages.put("inventory.status.outofstock", messageService.getMessage("inventory.status.outofstock"));
        messages.put("inventory.status.lowstock", messageService.getMessage("inventory.status.lowstock"));
        messages.put("inventory.status.instock", messageService.getMessage("inventory.status.instock"));
        messages.put("inventory.location.store", messageService.getMessage("inventory.location.store"));
        messages.put("inventory.location.warehouse", messageService.getMessage("inventory.location.warehouse"));
        
        // Customer management
        messages.put("customer.basic.info", messageService.getMessage("customer.basic.info"));
        messages.put("customer.email", messageService.getMessage("customer.email"));
        messages.put("customer.phone", messageService.getMessage("customer.phone"));
        messages.put("customer.birthdate", messageService.getMessage("customer.birthdate"));
        messages.put("customer.gender", messageService.getMessage("customer.gender"));
        messages.put("customer.gender.male", messageService.getMessage("customer.gender.male"));
        messages.put("customer.gender.female", messageService.getMessage("customer.gender.female"));
        messages.put("customer.gender.other", messageService.getMessage("customer.gender.other"));
        messages.put("customer.occupation.info", messageService.getMessage("customer.occupation.info"));
        messages.put("customer.occupation", messageService.getMessage("customer.occupation"));
        messages.put("customer.company", messageService.getMessage("customer.company"));
        messages.put("customer.department", messageService.getMessage("customer.department"));
        
        // Book management
        messages.put("book.title", messageService.getMessage("book.title"));
        messages.put("book.title.english", messageService.getMessage("book.title.english"));
        messages.put("book.publication.date", messageService.getMessage("book.publication.date"));
        messages.put("book.edition", messageService.getMessage("book.edition"));
        messages.put("book.list.price", messageService.getMessage("book.list.price"));
        messages.put("book.selling.price", messageService.getMessage("book.selling.price"));
        messages.put("book.version.info", messageService.getMessage("book.version.info"));
        messages.put("book.sample.code.url", messageService.getMessage("book.sample.code.url"));
        
        // Receive stock dialog
        messages.put("receive.dialog.title", messageService.getMessage("receive.dialog.title"));
        messages.put("receive.quantity", messageService.getMessage("receive.quantity"));
        messages.put("receive.location", messageService.getMessage("receive.location"));
        messages.put("receive.reason", messageService.getMessage("receive.reason"));
        messages.put("receive.delivery.note", messageService.getMessage("receive.delivery.note"));
        messages.put("receive.operation.success", messageService.getMessage("receive.operation.success"));
        
        // Forms
        messages.put("form.submit", messageService.getMessage("form.submit"));
        messages.put("form.cancel", messageService.getMessage("form.cancel"));
        messages.put("form.save", messageService.getMessage("form.save"));
        
        return messages;
    }
}