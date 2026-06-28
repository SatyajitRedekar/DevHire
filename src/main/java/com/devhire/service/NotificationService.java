package com.devhire.service;

import com.devhire.model.Notification;
import com.devhire.model.User;
import com.devhire.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    public Notification createNotification(User user, String message) {
        Notification notification = new Notification(user, message);
        return notificationRepository.save(notification);
    }

    public List<Notification> getNotificationsForUser(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public boolean markAsRead(Long notificationId) {
        Optional<Notification> opt = notificationRepository.findById(notificationId);
        if (opt.isPresent()) {
            Notification notification = opt.get();
            notification.setRead(true);
            notificationRepository.save(notification);
            return true;
        }
        return false;
    }
}
