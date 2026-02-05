package com.identityprovider.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendUnblockNotification(String toEmail, String firstName) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("Compte débloqué - Identity Provider");
            message.setText("Bonjour " + firstName + ",\n\n" +
                    "L'administrateur a débloqué votre compte. Vous pouvez maintenant vous connecter à nouveau.\n\n" +
                    "Cordialement,\n" +
                    "L'équipe Identity Provider");

            mailSender.send(message);
            log.info("E-mail de déblocage envoyé à {}", toEmail);
        } catch (Exception e) {
            log.error("Erreur lors de l'envoi de l'e-mail à {}: {}", toEmail, e.getMessage());
        }
    }
}
