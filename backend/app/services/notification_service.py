from typing import Dict, List
from datetime import datetime
from app.models import User, Notification, NotificationPreference
from app.utils.notification import NotificationManager

class NotificationService:
    def __init__(self):
        self.manager = NotificationManager()

    async def process_notification(
        self,
        event: Dict
    ) -> None:
        """Process and distribute notifications"""
        # Identify target users
        users = await self._identify_target_users(event)
        
        # Create notifications
        notifications = []
        for user in users:
            if await self._should_notify_user(user, event):
                notification = await self._create_notification(user, event)
                notifications.append(notification)
        
        # Send notifications
        await self._send_notifications(notifications)

    async def _identify_target_users(
        self,
        event: Dict
    ) -> List[User]:
        """Identify users who should receive the notification"""
        users = []
        
        # Get users by role
        if event.get('roles'):
            role_users = await User.find_by_roles(event['roles'])
            users.extend(role_users)
            
        # Get users by project
        if event.get('projectId'):
            project_users = await User.find_by_project(event['projectId'])
            users.extend(project_users)
            
        # Get users by custom rules
        if event.get('rules'):
            rule_users = await self._apply_notification_rules(event['rules'])
            users.extend(rule_users)
            
        return list(set(users))  # Remove duplicates

    async def _should_notify_user(
        self,
        user: User,
        event: Dict
    ) -> bool:
        """Check if user should receive notification"""
        preferences = await NotificationPreference.get_by_user(user.id)
        
        # Check if notification type is enabled
        if not preferences.is_type_enabled(event['type']):
            return False
            
        # Check if channel is available
        if not await self._is_channel_available(user, event['channel']):
            return False
            
        # Check notification schedule
        if not self._is_within_schedule(preferences.schedule):
            return False
            
        # Check custom rules
        if not await self._check_custom_rules(user, event, preferences):
            return False
            
        return True

    async def _send_notifications(
        self,
        notifications: List[Notification]
    ) -> None:
        """Send notifications through appropriate channels"""
        for notification in notifications:
            # Get user preferences
            preferences = await NotificationPreference.get_by_user(
                notification.user_id
            )
            
            # Send through enabled channels
            for channel in preferences.enabled_channels:
                try:
                    await self.manager.send_notification(
                        notification,
                        channel
                    )
                except Exception as e:
                    # Log error but continue with other channels
                    print(f"Error sending notification: {e}")