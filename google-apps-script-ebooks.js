/**
 * NoorEldean Coaching - E-Books Script
 * =====================================
 * سكريبت إرسال الكتب بالإيميل (منفصل)
 * 
 * طريقة الإعداد:
 * 1. اعمل مشروع جديد في Google Apps Script
 * 2. الصق الكود ده
 * 3. اعمل Deploy > New Deployment > Web App
 * 4. اختار Anyone can access
 * 5. انسخ الـ URL وحطه في ebooks.html (EBOOKS_SCRIPT_URL)
 * 
 * ⚠️ مهم: غير الـ LINK_X بروابط الكتب الفعلية
 */

function doPost(e) {
    try {
        var data = JSON.parse(e.postData.contents);
        var email = data.email;
        var bookName = data.book_name;
        var bookLink = data.book_link;

        // 1. تسجيل البيانات في الشيت
        logDownload(email, bookName);

        // 2. إرسال الإيميل بتصميم احترافي
        sendBookEmail(email, bookName, bookLink);

        return ContentService.createTextOutput(JSON.stringify({
            "status": "success",
            "message": "تم إرسال الكتاب بنجاح"
        })).setMimeType(ContentService.MimeType.JSON);

    } catch (error) {
        Logger.log("Error: " + error.toString());
        return ContentService.createTextOutput(JSON.stringify({
            "status": "error",
            "message": error.toString()
        })).setMimeType(ContentService.MimeType.JSON);
    }
}

// ==================== تسجيل التحميل ====================
function logDownload(email, bookName) {
    try {
        // يمكنك تغيير هذا لـ ID شيت معين
        var ss = SpreadsheetApp.getActiveSpreadsheet();

        // البحث عن شيت الكتب أو إنشاؤه
        var sheet = ss.getSheetByName("E-Books Downloads");
        if (!sheet) {
            sheet = ss.insertSheet("E-Books Downloads");
            sheet.appendRow(["📅 التاريخ", "📧 الإيميل", "📚 الكتاب"]);
            sheet.getRange(1, 1, 1, 3).setBackground("#2563eb").setFontColor("white").setFontWeight("bold");
            sheet.setColumnWidth(1, 180);
            sheet.setColumnWidth(2, 250);
            sheet.setColumnWidth(3, 200);
        }

        var timestamp = new Date().toLocaleString("ar-EG", { timeZone: "Africa/Cairo" });
        sheet.appendRow([timestamp, email, bookName]);

        Logger.log("Download logged: " + email + " - " + bookName);
    } catch (e) {
        Logger.log("Sheet Error: " + e.toString());
    }
}

// ==================== إرسال الإيميل ====================
function sendBookEmail(email, bookName, bookLink) {
    var htmlBody = `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
        <meta charset="UTF-8">
        <style>
            body { 
                margin: 0; 
                padding: 0; 
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                background-color: #f0f9ff; 
            }
            .container { 
                max-width: 600px; 
                margin: 20px auto; 
                background-color: #ffffff; 
                border-radius: 20px; 
                overflow: hidden; 
                box-shadow: 0 10px 40px rgba(37, 99, 235, 0.15); 
            }
            .header { 
                background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
                color: #ffffff; 
                padding: 40px 30px; 
                text-align: center; 
            }
            .header h1 {
                margin: 0;
                font-size: 28px;
                font-weight: 800;
            }
            .header p {
                margin: 10px 0 0;
                opacity: 0.9;
            }
            .content { 
                padding: 40px 30px; 
                text-align: right; 
                color: #333333; 
                line-height: 1.8; 
            }
            .content h2 {
                color: #2563eb;
                margin-top: 0;
            }
            .book-box {
                background: linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 100%);
                padding: 25px;
                border-radius: 15px;
                margin: 25px 0;
                border-right: 5px solid #2563eb;
            }
            .book-name {
                font-size: 1.3rem;
                font-weight: 800;
                color: #1e40af;
                margin: 0;
            }
            .btn-container { 
                text-align: center; 
                margin: 30px 0; 
            }
            .btn { 
                background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
                color: #ffffff !important; 
                padding: 18px 45px; 
                text-decoration: none; 
                border-radius: 50px; 
                font-weight: bold; 
                font-size: 18px; 
                display: inline-block; 
                box-shadow: 0 8px 25px rgba(37, 99, 235, 0.3); 
            }
            .link-fallback {
                font-size: 14px;
                color: #666;
                word-break: break-all;
            }
            .link-fallback a {
                color: #2563eb;
            }
            .upsell { 
                background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
                padding: 20px; 
                border-radius: 12px; 
                margin-top: 25px; 
                border-right: 4px solid #f59e0b; 
            }
            .upsell strong {
                color: #92400e;
            }
            .footer { 
                background-color: #1f2937; 
                padding: 25px; 
                text-align: center; 
                font-size: 13px; 
                color: #9ca3af;
            }
            .footer a {
                color: #60a5fa;
                text-decoration: none;
            }
        </style>
    </head>
    <body>
        <div class="container">
            
            <div class="header">
                <h1>🏋️ NoorEldean Coaching</h1>
                <p>كتابك جاهز للتحميل!</p>
            </div>

            <div class="content">
                <h2>أهلاً يا بطل! 💪</h2>
                <p>أحييك على خطوتك الأولى. المعلومات الصحيحة هي نص الطريق للفورمة.</p>
                
                <div class="book-box">
                    <p class="book-name">📚 ${bookName}</p>
                </div>
                
                <div class="btn-container">
                    <a href="${bookLink}" class="btn">تحميل الكتاب الآن 🚀</a>
                </div>

                <p class="link-fallback">
                    لو الزرار مش شغال، افتح الرابط ده:<br>
                    <a href="${bookLink}">${bookLink}</a>
                </p>

                <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

                <div class="upsell">
                    <strong>💡 نصيحة من كوتش نور:</strong><br><br>
                    الكتاب ده فيه "المعلومات"، بس التطبيق محتاج استمرارية وخطة متفصلة ليك.
                    لو محتاج حد يتابعك ويحسبلك سعراتك وتمرينك.. أنا موجود.
                    <br><br>
                    <a href="https://nooreldeancoaching.tech" style="color: #92400e; font-weight: bold;">شوف تفاصيل التدريب الأونلاين 👈</a>
                </div>
            </div>

            <div class="footer">
                <p>تم الإرسال من موقع <a href="https://nooreldeancoaching.tech">NoorEldean Coaching</a></p>
                <p>نتمنى لك فورمة قوية وصحة حديد! 🔥</p>
            </div>

        </div>
    </body>
    </html>
    `;

    var textBody = `
أهلاً يا بطل! 💪

كتاب "${bookName}" جاهز للتحميل.

رابط التحميل:
${bookLink}

---
نصيحة من كوتش نور:
الكتاب ده فيه المعلومات، بس التطبيق محتاج استمرارية وخطة متفصلة ليك.
لو محتاج حد يتابعك.. أنا موجود.

https://nooreldeancoaching.tech
    `;

    MailApp.sendEmail({
        to: email,
        subject: "📚 الكتاب وصل! " + bookName,
        body: textBody,
        htmlBody: htmlBody
    });

    Logger.log("Email sent to: " + email);
}

// ==================== للاختبار ====================
function testEbookEmail() {
    var testData = {
        postData: {
            contents: JSON.stringify({
                email: "test@example.com",
                book_name: "دليل الجيم للمبتدئين",
                book_link: "https://example.com/book.pdf"
            })
        }
    };

    var result = doPost(testData);
    Logger.log(result.getContent());
}
