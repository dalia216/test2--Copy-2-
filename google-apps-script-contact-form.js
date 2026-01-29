/**
 * NoorEldean Coaching - Contact Form Script
 * ==========================================
 * سكريبت فورم التواصل (منفصل)
 * 
 * طريقة الإعداد:
 * 1. اعمل مشروع جديد في Google Apps Script
 * 2. الصق الكود ده
 * 3. غير الـ SPREADSHEET_ID لو عايز شيت مختلف
 * 4. اعمل Deploy > New Deployment > Web App
 * 5. اختار Anyone can access
 * 6. انسخ الـ URL وحطه في contact.html
 */

// ==================== الإعدادات ====================
const CONTACT_EMAIL = "nooreldeancoaching@gmail.com";
const WHATSAPP_NUMBER = "201515835183";
const SPREADSHEET_ID = "16MSJDRQD-QZB41z3QSHwzabww97wUBpBP_fWMJyyLqE"; // نفس الشيت أو شيت جديد

// ==================== نقطة الدخول ====================
function doPost(e) {
    try {
        const data = JSON.parse(e.postData.contents);
        const { name, email, phone, message } = data;

        // 1. إرسال إيميل
        sendEmail(name, email, phone, message);

        // 2. تسجيل في الشيت
        logToSheet(name, email, phone, message);

        // 3. إرجاع رابط الواتساب
        const whatsappMsg = encodeURIComponent(`مرحباً، أنا ${name}\n${message}`);
        const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMsg}`;

        return ContentService.createTextOutput(JSON.stringify({
            success: true,
            whatsappLink: whatsappLink,
            message: "تم إرسال رسالتك بنجاح!"
        })).setMimeType(ContentService.MimeType.JSON);

    } catch (error) {
        Logger.log("Error: " + error.toString());
        return ContentService.createTextOutput(JSON.stringify({
            success: false,
            message: "حصل خطأ: " + error.toString()
        })).setMimeType(ContentService.MimeType.JSON);
    }
}

// ==================== إرسال الإيميل ====================
function sendEmail(name, email, phone, message) {
    try {
        const subject = `📬 رسالة جديدة من ${name} - NoorEldean Coaching`;

        const htmlBody = `
        <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #2563eb, #1e40af); padding: 30px; border-radius: 15px 15px 0 0;">
                <h1 style="color: white; margin: 0; text-align: center;">📬 رسالة جديدة</h1>
            </div>
            
            <div style="background: #f8fafc; padding: 30px; border: 1px solid #e5e7eb;">
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 15px; border-bottom: 1px solid #e5e7eb;">
                            <strong>👤 الاسم:</strong>
                        </td>
                        <td style="padding: 15px; border-bottom: 1px solid #e5e7eb;">
                            ${name}
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 15px; border-bottom: 1px solid #e5e7eb;">
                            <strong>📧 الإيميل:</strong>
                        </td>
                        <td style="padding: 15px; border-bottom: 1px solid #e5e7eb;">
                            <a href="mailto:${email}">${email}</a>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 15px; border-bottom: 1px solid #e5e7eb;">
                            <strong>📱 الموبايل:</strong>
                        </td>
                        <td style="padding: 15px; border-bottom: 1px solid #e5e7eb;">
                            ${phone || 'لم يُذكر'}
                        </td>
                    </tr>
                </table>
                
                <div style="margin-top: 20px; padding: 20px; background: white; border-radius: 10px; border: 1px solid #e5e7eb;">
                    <strong>💬 الرسالة:</strong>
                    <p style="margin-top: 10px; line-height: 1.8;">${message}</p>
                </div>
            </div>
            
            <div style="background: #1f2937; padding: 20px; border-radius: 0 0 15px 15px; text-align: center;">
                <p style="color: #9ca3af; margin: 0; font-size: 12px;">
                    📅 ${new Date().toLocaleString("ar-EG", { timeZone: "Africa/Cairo" })}
                </p>
            </div>
        </div>
        `;

        const textBody = `
رسالة جديدة من موقع NoorEldean Coaching
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 الاسم: ${name}
📧 الإيميل: ${email}
📱 الموبايل: ${phone || 'لم يُذكر'}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💬 الرسالة:
${message}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📅 ${new Date().toLocaleString("ar-EG", { timeZone: "Africa/Cairo" })}
        `;

        MailApp.sendEmail({
            to: CONTACT_EMAIL,
            subject: subject,
            body: textBody,
            htmlBody: htmlBody
        });

        Logger.log("Email sent successfully to: " + CONTACT_EMAIL);
    } catch (e) {
        Logger.log("Email Error: " + e.toString());
        throw e;
    }
}

// ==================== التسجيل في الشيت ====================
function logToSheet(name, email, phone, message) {
    try {
        const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

        // البحث عن شيت Contact أو إنشاؤه
        let sheet = ss.getSheetByName("Contact Form");
        if (!sheet) {
            sheet = ss.insertSheet("Contact Form");
            // إضافة العناوين مع تنسيق
            sheet.appendRow(["📅 التاريخ", "👤 الاسم", "📧 الإيميل", "📱 الموبايل", "💬 الرسالة", "✅ الحالة"]);
            sheet.getRange(1, 1, 1, 6).setBackground("#2563eb").setFontColor("white").setFontWeight("bold");
            sheet.setColumnWidth(1, 180);
            sheet.setColumnWidth(2, 150);
            sheet.setColumnWidth(3, 200);
            sheet.setColumnWidth(4, 130);
            sheet.setColumnWidth(5, 400);
            sheet.setColumnWidth(6, 100);
        }

        const timestamp = new Date().toLocaleString("ar-EG", { timeZone: "Africa/Cairo" });
        sheet.appendRow([timestamp, name, email, phone || "-", message, "جديد"]);

        Logger.log("Contact logged to sheet successfully");
    } catch (e) {
        Logger.log("Sheet Error: " + e.toString());
        throw e;
    }
}

// ==================== للاختبار ====================
function testContactForm() {
    const testData = {
        postData: {
            contents: JSON.stringify({
                name: "أحمد محمد",
                email: "test@example.com",
                phone: "01012345678",
                message: "دي رسالة تجريبية للتأكد من عمل الفورم"
            })
        }
    };

    const result = doPost(testData);
    Logger.log(result.getContent());
}
