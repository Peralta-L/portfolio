package com.portfolio.service;

import com.portfolio.dto.ContactRequest;
import com.portfolio.dto.ContactResponse;
import com.portfolio.entity.ContactMessage;
import com.portfolio.repository.ContactMessageRepository;
import java.util.Locale;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class ContactService {

    private final ContactMessageRepository contactMessageRepository;

    /**
     * Stores a contact message. Honeypot submissions get the same response as real
     * ones, so bots cannot tell they were filtered, but nothing is persisted.
     */
    @Transactional
    public ContactResponse submit(ContactRequest request) {
        if (request.isLikelySpam()) {
            log.info("Discarded contact submission that filled the honeypot field");
            return ContactResponse.received();
        }

        ContactMessage saved = contactMessageRepository.save(new ContactMessage(
                singleLine(request.name()),
                request.email().trim().toLowerCase(Locale.ROOT),
                singleLine(request.subject()),
                request.message().trim()));

        log.info("Stored contact message id={}", saved.getId());
        return ContactResponse.received();
    }

    /** Trims and collapses all whitespace, including newlines (prevents header-style injection). */
    private static String singleLine(String value) {
        return value.trim().replaceAll("\\s+", " ");
    }
}
