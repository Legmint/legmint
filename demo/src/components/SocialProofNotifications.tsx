'use client';

import { useState, useEffect } from 'react';

interface Notification {
  name: string;
  location: string;
  action: string;
  time: string;
}

const notifications: Notification[] = [
  { name: "James", location: "London", action: "generated a SAFE Agreement", time: "2 minutes ago" },
  { name: "Sarah", location: "Berlin", action: "created a Founders Agreement", time: "5 minutes ago" },
  { name: "Marcus", location: "Paris", action: "downloaded an NDA", time: "8 minutes ago" },
  { name: "Priya", location: "Amsterdam", action: "generated employment contracts", time: "12 minutes ago" },
  { name: "Alex", location: "Dublin", action: "created a DPA", time: "15 minutes ago" },
  { name: "Lisa", location: "Barcelona", action: "generated a SAFE Agreement", time: "18 minutes ago" },
];

export default function SocialProofNotifications() {
  const [currentNotification, setCurrentNotification] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentNotification((prev) => (prev + 1) % notifications.length);
        setIsVisible(true);
      }, 500);
    }, 8000); // Change every 8 seconds

    return () => clearInterval(interval);
  }, []);

  const notification = notifications[currentNotification];

  return (
    <div className="fixed bottom-6 left-6 z-50 hidden lg:block">
      <div
        className={`bg-white shadow-xl rounded-lg p-4 max-w-sm border border-gray-200 transition-all duration-500 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-mint-400 to-mint-500 rounded-full flex items-center justify-center text-white font-bold">
              {notification.name[0]}
            </div>
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-900">
              <strong>{notification.name}</strong> from {notification.location}
            </p>
            <p className="text-sm text-gray-600">{notification.action}</p>
            <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="ml-2 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
