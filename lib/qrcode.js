import QRCode from "qrcode";

/**
 * Generate QR code as base64 string
 * @param {Object} data - Data to encode in QR code
 * @param {string} data.orderId - Order ID
 * @param {string} data.orderCode - Order code
 * @param {string} data.ticketType - Ticket type
 * @param {string} data.ticketArea - Ticket area
 * @param {string} data.customerName - Customer name
 * @param {number} data.ticketNumber - Ticket number (1, 2, 3...)
 * @returns {Promise<string>} Base64 string of QR code
 */
export async function generateTicketQRCode(data) {
  try {
    const qrData = JSON.stringify({
      orderId: data.orderId,
      orderCode: data.orderCode,
      ticketType: data.ticketType,
      ticketArea: data.ticketArea,
      customerName: data.customerName,
      ticketNumber: data.ticketNumber,
      timestamp: new Date().toISOString(),
    });

    // Generate QR code as base64 data URL
    const qrCodeDataURL = await QRCode.toDataURL(qrData, {
      errorCorrectionLevel: "H",
      type: "image/png",
      quality: 0.95,
      margin: 1,
      width: 300,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    });

    return qrCodeDataURL;
  } catch (error) {
    console.error("Error generating QR code:", error);
    throw new Error("Failed to generate QR code");
  }
}

/**
 * Generate multiple QR codes for an order
 * @param {Object} orderData - Order data
 * @param {number} quantity - Number of tickets
 * @returns {Promise<string[]>} Array of base64 QR codes
 */
export async function generateOrderQRCodes(orderData, quantity) {
  const qrCodes = [];

  for (let i = 1; i <= quantity; i++) {
    const qrCode = await generateTicketQRCode({
      orderId: orderData.orderId,
      orderCode: orderData.orderCode,
      ticketType: orderData.ticketType,
      ticketArea: orderData.ticketArea,
      customerName: orderData.customerName,
      ticketNumber: i,
    });
    qrCodes.push(qrCode);
  }

  return qrCodes;
}
