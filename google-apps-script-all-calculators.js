/**
 * NoorEldean Coaching - AI Chat Script
 * =====================================
 * شات الذكاء الاصطناعي مع دعم تاريخ المحادثة
 */

const GEMINI_API_KEY = "AIzaSyC4tyym21yxH3a_XJXaq9TuOYxuY0z550U";
const MAKE_WEBHOOK_URL = "https://hook.us2.make.com/njqlau838pmr3nyekd47ijrsurba4nfx";
const SPREADSHEET_ID = "16MSJDRQD-QZB41z3QSHwzabww97wUBpBP_fWMJyyLqE";
const CONTACT_EMAIL = "nooreldeancoaching@gmail.com";
const WHATSAPP_NUMBER = "201515835183";

function doPost(e) {
    try {
        const requestData = JSON.parse(e.postData.contents);

        // ==================== معالجة فورم التواصل ====================
        if (requestData.type === "contact") {
            const { name, email, phone, message } = requestData;

            // 1. إرسال إيميل
            sendContactEmail(name, email, phone, message);

            // 2. تسجيل في الشيت
            logContactToSheet(name, email, phone, message);

            // 3. إرجاع رابط الواتساب
            const whatsappMsg = encodeURIComponent(`مرحباً، أنا ${name}\n${message}`);
            const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMsg}`;

            return ContentService.createTextOutput(JSON.stringify({
                "success": true,
                "whatsappLink": whatsappLink,
                "message": "تم إرسال رسالتك بنجاح!"
            })).setMimeType(ContentService.MimeType.JSON);
        }

        // ==================== معالجة الشات ====================
        if (requestData.history || requestData.query) {
            let history = requestData.history;

            // دعم النظام القديم (query فقط)
            if (!history && requestData.query) {
                history = [{ role: "user", parts: [{ text: requestData.query }] }];
            }

            // استخراج آخر رسالة للوج
            const lastUserMsg = getLastUserMessage(history);

            // الحصول على الرد
            const reply = smartAssistant(history);

            // تسجيل المحادثة
            logToSheet("Website", lastUserMsg, reply);

            return ContentService.createTextOutput(JSON.stringify({ "reply": reply }))
                .setMimeType(ContentService.MimeType.JSON);
        }

        return ContentService.createTextOutput(JSON.stringify({ "reply": "مفيش رسالة وصلت!" }))
            .setMimeType(ContentService.MimeType.JSON);

    } catch (error) {
        Logger.log("Error: " + error.toString());
        return ContentService.createTextOutput(JSON.stringify({ "reply": "خطأ تقني بسيط، ابعت رسالتك تاني! 🔄" }))
            .setMimeType(ContentService.MimeType.JSON);
    }
}

// ==================== إرسال إيميل التواصل ====================
function sendContactEmail(name, email, phone, message) {
    try {
        const subject = `📬 رسالة جديدة من ${name} - NoorEldean Coaching`;
        const body = `
رسالة جديدة من موقع NoorEldean Coaching

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 الاسم: ${name}
📧 الإيميل: ${email}
📱 الموبايل: ${phone || 'لم يُذكر'}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💬 الرسالة:
${message}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📅 التوقيت: ${new Date().toLocaleString("ar-EG", { timeZone: "Africa/Cairo" })}
        `;

        MailApp.sendEmail(CONTACT_EMAIL, subject, body);
    } catch (e) {
        Logger.log("Email Error: " + e.toString());
    }
}

// ==================== تسجيل التواصل في الشيت ====================
function logContactToSheet(name, email, phone, message) {
    try {
        if (!SPREADSHEET_ID) return;
        const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

        // البحث عن شيت التواصل أو إنشاؤه
        let contactSheet = ss.getSheetByName("Contact");
        if (!contactSheet) {
            contactSheet = ss.insertSheet("Contact");
            contactSheet.appendRow(["التاريخ", "الاسم", "الإيميل", "الموبايل", "الرسالة"]);
        }

        const timestamp = new Date().toLocaleString("ar-EG", { timeZone: "Africa/Cairo" });
        contactSheet.appendRow([timestamp, name, email, phone, message]);
    } catch (e) {
        Logger.log("Contact Sheet Error: " + e.toString());
    }
}

// ==================== استخراج آخر رسالة من المستخدم ====================
function getLastUserMessage(history) {
    if (!history || history.length === 0) return "";
    for (let i = history.length - 1; i >= 0; i--) {
        if (history[i].role === "user") {
            return history[i].parts[0].text;
        }
    }
    return "";
}

// ==================== المخ الذكي (الترتيب: 2.5 Flash -> 3 Flash -> 2.5 Lite -> Make) ====================
function smartAssistant(history) {
    // قائمة الموديلات المتاحة بالترتيب (من الصورة المرفقة)
    const models = ["gemini-2.5-flash", "gemini-3-flash", "gemini-2.5-flash-lite"];

    for (let i = 0; i < models.length; i++) {
        try {
            return callGemini(history, models[i]);
        } catch (e) {
            Logger.log("Model " + models[i] + " failed: " + e.toString());
            continue;
        }
    }

    // لو كل الموديلات فشلت، جرب Make
    try {
        Logger.log("All Gemini models failed, trying Make...");
        const lastMsg = getLastUserMessage(history);
        return callMake(lastMsg);
    } catch (e) {
        Logger.log("Make also failed: " + e.toString());
        return "🛑 السيرفرات عليها ضغط عالي حالياً. دقيقة وجرب تاني يا بطل! 🙏";
    }
}

// ==================== دالة الاتصال بـ Gemini ====================
function callGemini(history, modelName) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${GEMINI_API_KEY}`;

    // ===================== دستور الكوتش =====================
    const systemPromptText = `
🔴 تعليمات النظام (System Persona):
أنت الكوتش "نور الدين". صاحب جدع، دمك خفيف، وبتستخدم إيموجي كتير 🤩🔥.
أسلوبك: "خير الكلام ما قل ودل". ردودك كبسولات مفيدة.

1️⃣ التعامل والأسلوب (Tone):
- **مع الولاد:** حماسي (يا بطل، يا وحش، يا عالمي) 💪🔥.
- **مع البنات:** نبرة أهدى ومحترمة (يا دكتورة، يا فنانة) 🌸✨.
- **المواساة:** لو حد محبط، واسيه بجدعنة (أنت قدها، كلنا بنقع ونقوم) ❤️.

2️⃣ سياسة المساعدة (Content Rules):
- **الدراسة:** رشح كتاب "دليل الاستمرارية" كحل للمشاكل 📚.
- **التغذية:** إيمانك بـ "حساب السعرات الدقيق". رشح كتاب الوصفات كهدية 🥗.
- **الإصابات:** "لازم دكتور متخصص فوراً، صحتك مش لعبة" 🛑.
- **المنافسين:** "شخص محترم جداً، بس كل شيخ وله طريقته" 🤝.

3️⃣ 🎁 الهدايا المجانية (كتب وأدوات):
استخدم دول عشان تجر ناعم وتفيد العميل قبل ما تبيع:

أ) الأدوات التقنية (لو سأل عن أرقام أو حسابات):
- حاسبة السعرات: https://nooreldeancoaching.tech/ar/page/اله-حاسبة-سعرات
- حاسبة البدائل: https://nooreldeancoaching.tech/ar/page/حاسبة-البدال
- حاسبة الماكروز للوجبة: https://nooreldeancoaching.tech/ar/page/حاسبة-سعرات-الوجبة
- حاسبة القوة (1RM): https://nooreldeancoaching.tech/ar/page/حاسبة-1rm

ب) مكتبة الكتب: https://nooreldeancoaching.tech/ar/page/الكتب-المجانية

4️⃣ 📦 الباقات المتاحة (من الأقل للأعلى):

🎓 **خطة 6 أسابيع - 750 جنيه** (بدل 1500):
   - الباقة الاقتصادية - مثالية كبداية قوية للتغيير
   - نظام غذائي + برنامج تمرين + تطبيق احترافي + مكالمة شهرية + فريق متابعة

⭐ **خطة 12 أسبوع - 1200 جنيه** (بدل 3000) - الأكثر اختياراً:
   - المدة الكافية لظهور نتائج مبهرة
   - يعني حوالي 13 جنيه في اليوم بس! 😉
   - نفس المميزات + متابعة أطول

💪 **خطة 6 شهور - 2100 جنيه** (بدل 6000):
   - باقة الملتزمين - التوازن الحقيقي بين الدراسة والفيتنس

👑 **خطة السنة - 3800 جنيه** (بدل 12000):
   - توفير جبار! - بناء نمط حياة صحي لا يتوقف

5️⃣ سياسة البيع الذكي:
- **التشخيص:** افهم المشكلة الأول (طالب/موظف؟).
- **الإقناع:** قسم السعر يومياً واعرض الخصم.
- لو سأل عن الباقات، رشح باقة الـ 12 أسبوع كأفضل اختيار.

6️⃣ طرق الدفع (عبر بوابة Kashier الآمنة):
- انستا باي
- المحافظ الإلكترونية (فودافون كاش، اتصالات كاش، أورانج كاش، وي باي)
- فيزا / ماستركارد / ميزة
- تقسيط عن طريق البنوك (يتواصل مع بنكه لمعرفة العروض)
`;

    // بناء المحتوى مع System Prompt في الأول
    const systemPrompt = {
        role: "user",
        parts: [{ text: systemPromptText }]
    };

    // دمج التعليمات مع التاريخ
    let contents = [systemPrompt];

    // إضافة تاريخ المحادثة
    if (history && history.length > 0) {
        history.forEach(function (msg) {
            contents.push({
                role: msg.role === "ai" ? "model" : "user",
                parts: msg.parts
            });
        });
    }

    const payload = { "contents": contents };

    const response = UrlFetchApp.fetch(url, {
        method: "post",
        contentType: "application/json",
        payload: JSON.stringify(payload),
        muteHttpExceptions: true
    });

    if (response.getResponseCode() !== 200) {
        throw new Error("Gemini Error: " + response.getContentText());
    }

    const data = JSON.parse(response.getContentText());

    if (!data.candidates || data.candidates.length === 0) {
        throw new Error("No candidates in response");
    }

    return data.candidates[0].content.parts[0].text;
}

// ==================== دالة الاتصال بـ Make.com ====================
function callMake(msg) {
    if (!MAKE_WEBHOOK_URL) throw new Error("No Make URL");

    const payload = { "user_question": msg };

    const response = UrlFetchApp.fetch(MAKE_WEBHOOK_URL, {
        method: "post",
        contentType: "application/json",
        payload: JSON.stringify(payload),
        muteHttpExceptions: true
    });

    if (response.getResponseCode() !== 200) {
        throw new Error("Make Error");
    }

    const data = JSON.parse(response.getContentText());
    return data.reply || data.answer || "وصلت رسالتك للكوتش وهيرد عليك بنفسه! 😎";
}

// ==================== دالة الحفظ ====================
function logToSheet(source, question, answer) {
    try {
        if (!SPREADSHEET_ID) return;
        const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheets()[0];
        const timestamp = new Date().toLocaleString("ar-EG", { timeZone: "Africa/Cairo" });
        sheet.appendRow([timestamp, source, question, answer]);
    } catch (e) {
        Logger.log("Logging Error: " + e.toString());
    }
}
