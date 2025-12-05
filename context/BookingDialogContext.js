"use client";

import { createContext, useContext, useState } from "react";

const BookingDialogContext = createContext();

export function BookingDialogProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  const openBookingDialog = () => setIsOpen(true);
  const closeBookingDialog = () => setIsOpen(false);

  return (
    <BookingDialogContext.Provider value={{ isOpen, setIsOpen, openBookingDialog, closeBookingDialog }}>
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
