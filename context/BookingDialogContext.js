"use client";

import { createContext, useContext, useState } from "react";

const BookingDialogContext = createContext();

export function BookingDialogProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState(null);

  const openBookingDialog = () => setIsOpen(true);
  const closeBookingDialog = () => {
    setIsOpen(false);
    setSelectedServiceId(null);
  }
  
  const openBookingWithService = (serviceId) => {
    setSelectedServiceId(serviceId);
    setIsOpen(true);
  };

  return (
    <BookingDialogContext.Provider value={{ 
      isOpen, 
      setIsOpen, 
      openBookingDialog, 
      closeBookingDialog,
      selectedServiceId,
      openBookingWithService
    }}>
      {children}
    </BookingDialogContext.Provider>
  );
}

export function useBookingDialog() {
  const context = useContext(BookingDialogContext);
  if (!context) {
    throw new Error("useBookingDialog must be used within BookingDialogProvider");
  }
  return context;
}
