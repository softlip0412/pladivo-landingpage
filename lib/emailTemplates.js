export function getPasswordResetOTPTemplate(code, email) {
  return `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Đặt lại mật khẩu - Pladivo</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f0f9ff;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0f9ff; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
              
              <!-- Header with gradient -->
              <tr>
                <td style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 40px 30px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">
                    🔐 Đặt lại mật khẩu
                  </h1>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 40px 30px;">
                  <h2 style="color: #1e293b; margin: 0 0 20px 0; font-size: 22px;">
                    Xin chào,
                  </h2>
                  
                  <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                    Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản Pladivo của mình.
                  </p>
                  
                  <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                    Để tiếp tục, vui lòng nhập mã xác minh sau:
                  </p>
                  
                  <!-- OTP Code Box -->
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center" style="padding: 30px 0;">
                        <div style="display: inline-block; background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%); border: 2px solid #ef4444; border-radius: 12px; padding: 24px 48px;">
                          <p style="color: #991b1b; font-size: 14px; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 1px;">
                            Mã xác minh của bạn
                          </p>
                          <p style="color: #ef4444; font-size: 42px; font-weight: 700; margin: 0; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                            ${code}
                          </p>
                        </div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <!-- Warning Box -->
              <tr>
                <td style="padding: 0 30px 30px 30px;">
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 8px; padding: 16px;">
                    <tr>
                      <td>
                        <p style="color: #92400e; font-size: 14px; line-height: 1.6; margin: 0;">
                          ⚠️ <strong>Lưu ý:</strong> Mã xác minh này có hiệu lực trong <strong>10 phút</strong>. Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này và liên hệ với chúng tôi ngay.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                  <p style="color: #64748b; font-size: 14px; margin: 0 0 10px 0;">
                    Email này được gửi tự động, vui lòng không trả lời.
                  </p>
                  <p style="color: #94a3b8; font-size: 12px; margin: 0;">
                    © 2024 Pladivo. All rights reserved.
                  </p>
                </td>
              </tr>
              
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `
}

export function getAccountUpdateOTPTemplate(code, email, fieldName) {
  return `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Mã xác minh thay đổi ${fieldName} - Pladivo</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f0f9ff;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0f9ff; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
              
              <!-- Header with gradient -->
              <tr>
                <td style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 40px 30px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">
                    🔒 Xác minh thay đổi thông tin
                  </h1>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 40px 30px;">
                  <h2 style="color: #1e293b; margin: 0 0 20px 0; font-size: 22px;">
                    Xin chào,
                  </h2>
                  
                  <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                    Bạn đã yêu cầu thay đổi <strong>${fieldName}</strong> trên tài khoản Pladivo của mình.
                  </p>
                  
                  <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                    Để xác nhận thay đổi này, vui lòng nhập mã xác minh sau:
                  </p>
                  
                  <!-- OTP Code Box -->
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center" style="padding: 30px 0;">
                        <div style="display: inline-block; background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border: 2px solid #f59e0b; border-radius: 12px; padding: 24px 48px;">
                          <p style="color: #92400e; font-size: 14px; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 1px;">
                            Mã xác minh của bạn
                          </p>
                          <p style="color: #f59e0b; font-size: 42px; font-weight: 700; margin: 0; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                            ${code}
                          </p>
                        </div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <!-- Warning Box -->
              <tr>
                <td style="padding: 0 30px 30px 30px;">
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fee2e2; border-left: 4px solid #ef4444; border-radius: 8px; padding: 16px;">
                    <tr>
                      <td>
                        <p style="color: #991b1b; font-size: 14px; line-height: 1.6; margin: 0;">
                          ⚠️ <strong>Lưu ý:</strong> Mã xác minh này có hiệu lực trong <strong>10 phút</strong>. Nếu bạn không yêu cầu thay đổi này, vui lòng bỏ qua email và liên hệ với chúng tôi ngay.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                  <p style="color: #64748b; font-size: 14px; margin: 0 0 10px 0;">
                    Email này được gửi tự động, vui lòng không trả lời.
                  </p>
                  <p style="color: #94a3b8; font-size: 12px; margin: 0;">
                    © 2024 Pladivo. All rights reserved.
                  </p>
                </td>
              </tr>
              
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `
}

export function getVerificationCodeEmailTemplate(code, email) {
  return `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Mã xác minh tài khoản Pladivo</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f0f9ff;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0f9ff; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
              
              <!-- Header with gradient -->
              <tr>
                <td style="background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); padding: 40px 30px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">
                    🎉 Chào mừng đến với Pladivo!
                  </h1>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 40px 30px;">
                  <h2 style="color: #1e293b; margin: 0 0 20px 0; font-size: 22px;">
                    Xin chào,
                  </h2>
                  
                  <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                    Cảm ơn bạn đã đăng ký tài khoản tại <strong>Pladivo</strong>. Chúng tôi rất vui khi có bạn tham gia cộng đồng của chúng tôi!
                  </p>
                  
                  <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                    Để hoàn tất quá trình đăng ký, vui lòng nhập mã xác minh sau vào trang đăng ký:
                  </p>
                  
                  <!-- OTP Code Box -->
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center" style="padding: 30px 0;">
                        <div style="display: inline-block; background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border: 2px solid #0ea5e9; border-radius: 12px; padding: 24px 48px;">
                          <p style="color: #64748b; font-size: 14px; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 1px;">
                            Mã xác minh của bạn
                          </p>
                          <p style="color: #0ea5e9; font-size: 42px; font-weight: 700; margin: 0; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                            ${code}
                          </p>
                        </div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <!-- Info Box -->
              <tr>
                <td style="padding: 0 30px 30px 30px;">
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 8px; padding: 16px;">
                    <tr>
                      <td>
                        <p style="color: #92400e; font-size: 14px; line-height: 1.6; margin: 0;">
                          ⏰ <strong>Lưu ý:</strong> Mã xác minh này có hiệu lực trong <strong>10 phút</strong>. Nếu bạn không thực hiện xác minh trong thời gian này, bạn sẽ cần yêu cầu gửi lại mã mới.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                  <p style="color: #64748b; font-size: 14px; margin: 0 0 10px 0;">
                    Nếu bạn không tạo tài khoản này, vui lòng bỏ qua email này.
                  </p>
                  <p style="color: #94a3b8; font-size: 12px; margin: 0;">
                    © 2024 Pladivo. All rights reserved.
                  </p>
                </td>
              </tr>
              
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `
}

export function getVerificationEmailTemplate(verifyUrl, email) {
  return `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Xác minh tài khoản Pladivo</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f0f9ff;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0f9ff; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
              
              <!-- Header with gradient -->
              <tr>
                <td style="background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); padding: 40px 30px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">
                    🎉 Chào mừng đến với Pladivo!
                  </h1>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 40px 30px;">
                  <h2 style="color: #1e293b; margin: 0 0 20px 0; font-size: 22px;">
                    Xin chào,
                  </h2>
                  
                  <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                    Cảm ơn bạn đã đăng ký tài khoản tại <strong>Pladivo</strong>. Chúng tôi rất vui khi có bạn tham gia cộng đồng của chúng tôi!
                  </p>
                  
                  <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                    Để hoàn tất quá trình đăng ký và kích hoạt tài khoản của bạn, vui lòng nhấp vào nút bên dưới:
                  </p>
                  
                  <!-- CTA Button -->
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center" style="padding: 20px 0;">
                        <a href="${verifyUrl}" 
                           style="display: inline-block; background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);">
                          Xác minh tài khoản
                        </a>
                      </td>
                    </tr>
                  </table>
                  
                  <p style="color: #64748b; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0;">
                    Hoặc copy và paste link sau vào trình duyệt:
                  </p>
                  <p style="color: #0ea5e9; font-size: 14px; word-break: break-all; margin: 10px 0 0 0;">
                    ${verifyUrl}
                  </p>
                </td>
              </tr>
              
              <!-- Info Box -->
              <tr>
                <td style="padding: 0 30px 30px 30px;">
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 8px; padding: 16px;">
                    <tr>
                      <td>
                        <p style="color: #92400e; font-size: 14px; line-height: 1.6; margin: 0;">
                          ⏰ <strong>Lưu ý:</strong> Link xác minh này có hiệu lực trong <strong>24 giờ</strong>. Nếu bạn không thực hiện xác minh trong thời gian này, bạn sẽ cần đăng ký lại.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                  <p style="color: #64748b; font-size: 14px; margin: 0 0 10px 0;">
                    Nếu bạn không tạo tài khoản này, vui lòng bỏ qua email này.
                  </p>
                  <p style="color: #94a3b8; font-size: 12px; margin: 0;">
                    © 2024 Pladivo. All rights reserved.
                  </p>
                </td>
              </tr>
              
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `
}

export function getTicketConfirmationEmailTemplate(orderData) {
  const {
    orderCode,
    customerName,
    eventName,
    eventDate,
    eventLocation,
    ticketType,
    ticketArea,
    quantity,
    unitPrice,
    totalPrice,
    qrCodes,
    paidAt,
  } = orderData;

  const formattedDate = new Date(eventDate).toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const formattedTime = new Date(eventDate).toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const formattedPaidAt = new Date(paidAt).toLocaleString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  // Generate QR code sections
  const qrCodeSections = qrCodes.map((qrCode, index) => `
    <tr>
      <td style="padding: 20px 30px; border-bottom: 1px solid #e2e8f0;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td width="50%" style="vertical-align: top;">
              <h3 style="color: #1e293b; margin: 0 0 10px 0; font-size: 18px;">
                🎫 Vé số ${index + 1}
              </h3>
              <p style="color: #64748b; font-size: 14px; margin: 0 0 5px 0;">
                <strong>Loại vé:</strong> ${ticketType}
              </p>
              <p style="color: #64748b; font-size: 14px; margin: 0 0 5px 0;">
                <strong>Khu vực:</strong> ${ticketArea}
              </p>
              <p style="color: #64748b; font-size: 14px; margin: 0;">
                <strong>Mã đơn:</strong> ${orderCode}
              </p>
            </td>
            <td width="50%" align="center" style="vertical-align: top;">
              <img src="${qrCode}" alt="QR Code vé ${index + 1}" style="width: 150px; height: 150px; border: 2px solid #e2e8f0; border-radius: 8px;" />
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Xác nhận đặt vé thành công</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f0f9ff;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0f9ff; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
              
              <!-- Header with gradient -->
              <tr>
                <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 30px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">
                    ✅ Đặt vé thành công!
                  </h1>
                </td>
              </tr>
              
              <!-- Success Message -->
              <tr>
                <td style="padding: 30px 30px 20px 30px;">
                  <h2 style="color: #1e293b; margin: 0 0 15px 0; font-size: 22px;">
                    Xin chào ${customerName},
                  </h2>
                  
                  <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                    Cảm ơn bạn đã đặt vé! Đơn hàng của bạn đã được xác nhận và thanh toán thành công.
                  </p>
                </td>
              </tr>

              <!-- Order Information -->
              <tr>
                <td style="padding: 0 30px 20px 30px;">
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; border-radius: 8px; padding: 20px;">
                    <tr>
                      <td>
                        <h3 style="color: #1e293b; margin: 0 0 15px 0; font-size: 18px;">
                          📋 Thông tin đơn hàng
                        </h3>
                        <p style="color: #64748b; font-size: 14px; margin: 0 0 8px 0;">
                          <strong>Mã đơn hàng:</strong> <span style="color: #0ea5e9; font-weight: 600;">${orderCode}</span>
                        </p>
                        <p style="color: #64748b; font-size: 14px; margin: 0 0 8px 0;">
                          <strong>Thời gian thanh toán:</strong> ${formattedPaidAt}
                        </p>
                        <p style="color: #64748b; font-size: 14px; margin: 0;">
                          <strong>Số lượng vé:</strong> ${quantity} vé
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Event Information -->
              <tr>
                <td style="padding: 0 30px 20px 30px;">
                  <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border-radius: 8px; padding: 20px;">
                    <tr>
                      <td>
                        <h3 style="color: #1e293b; margin: 0 0 15px 0; font-size: 18px;">
                          🎉 Thông tin sự kiện
                        </h3>
                        <p style="color: #1e293b; font-size: 16px; font-weight: 600; margin: 0 0 10px 0;">
                          ${eventName}
                        </p>
                        <p style="color: #64748b; font-size: 14px; margin: 0 0 8px 0;">
                          📅 <strong>Ngày:</strong> ${formattedDate}
                        </p>
                        <p style="color: #64748b; font-size: 14px; margin: 0 0 8px 0;">
                          🕐 <strong>Giờ:</strong> ${formattedTime}
                        </p>
                        <p style="color: #64748b; font-size: 14px; margin: 0;">
                          📍 <strong>Địa điểm:</strong> ${eventLocation}
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Payment Summary -->
              <tr>
                <td style="padding: 0 30px 30px 30px;">
                  <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e2e8f0; border-radius: 8px;">
                    <tr>
                      <td style="padding: 15px 20px; border-bottom: 1px solid #e2e8f0;">
                        <table width="100%" cellpadding="0" cellspacing="0">
                          <tr>
                            <td style="color: #64748b; font-size: 14px;">Loại vé</td>
                            <td align="right" style="color: #1e293b; font-size: 14px; font-weight: 600;">${ticketType}</td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 15px 20px; border-bottom: 1px solid #e2e8f0;">
                        <table width="100%" cellpadding="0" cellspacing="0">
                          <tr>
                            <td style="color: #64748b; font-size: 14px;">Khu vực</td>
                            <td align="right" style="color: #1e293b; font-size: 14px; font-weight: 600;">${ticketArea}</td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 15px 20px; border-bottom: 1px solid #e2e8f0;">
                        <table width="100%" cellpadding="0" cellspacing="0">
                          <tr>
                            <td style="color: #64748b; font-size: 14px;">Đơn giá</td>
                            <td align="right" style="color: #1e293b; font-size: 14px;">${unitPrice.toLocaleString('vi-VN')} VNĐ</td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 15px 20px; border-bottom: 1px solid #e2e8f0;">
                        <table width="100%" cellpadding="0" cellspacing="0">
                          <tr>
                            <td style="color: #64748b; font-size: 14px;">Số lượng</td>
                            <td align="right" style="color: #1e293b; font-size: 14px;">×${quantity}</td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 15px 20px; background-color: #f8fafc;">
                        <table width="100%" cellpadding="0" cellspacing="0">
                          <tr>
                            <td style="color: #1e293b; font-size: 16px; font-weight: 600;">Tổng cộng</td>
                            <td align="right" style="color: #10b981; font-size: 20px; font-weight: 700;">${totalPrice.toLocaleString('vi-VN')} VNĐ</td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- QR Codes Section -->
              <tr>
                <td style="padding: 0 30px 20px 30px;">
                  <h3 style="color: #1e293b; margin: 0 0 15px 0; font-size: 18px; text-align: center;">
                    🎫 Vé của bạn
                  </h3>
                  <p style="color: #64748b; font-size: 14px; text-align: center; margin: 0 0 20px 0;">
                    Vui lòng xuất trình QR code dưới đây khi tham dự sự kiện
                  </p>
                </td>
              </tr>

              <!-- QR Code Cards -->
              <tr>
                <td>
                  <table width="100%" cellpadding="0" cellspacing="0" style="border-top: 2px solid #e2e8f0;">
                    ${qrCodeSections}
                  </table>
                </td>
              </tr>

              <!-- Instructions -->
              <tr>
                <td style="padding: 20px 30px;">
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 8px; padding: 16px;">
                    <tr>
                      <td>
                        <p style="color: #92400e; font-size: 14px; line-height: 1.6; margin: 0 0 10px 0;">
                          <strong>📱 Hướng dẫn sử dụng vé:</strong>
                        </p>
                        <ul style="color: #92400e; font-size: 14px; line-height: 1.6; margin: 0; padding-left: 20px;">
                          <li>Vui lòng lưu email này hoặc chụp ảnh QR code</li>
                          <li>Xuất trình QR code khi check-in tại sự kiện</li>
                          <li>Mỗi QR code chỉ được sử dụng một lần</li>
                          <li>Đến sớm 15-30 phút để check-in thuận tiện</li>
                        </ul>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                  <p style="color: #64748b; font-size: 14px; margin: 0 0 10px 0;">
                    Nếu bạn có bất kỳ thắc mắc nào, vui lòng liên hệ với chúng tôi.
                  </p>
                  <p style="color: #94a3b8; font-size: 12px; margin: 0;">
                    © 2024 Pladivo. All rights reserved.
                  </p>
                </td>
              </tr>
              
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `
}
