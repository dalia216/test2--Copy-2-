// Alternatives Calculator - NoorEldean Coaching
(function () {
    // Inject styles and HTML
    const container = document.getElementById('noor-premium-calc');
    if (!container) return;

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        #noor-premium-calc {
            --primary: #4f46e5;
            --primary-light: #818cf8;
            --accent: #10b981;
            --bg-body: #f8fafc;
            --glass-bg: rgba(255, 255, 255, 0.95);
            --glass-border: 1px solid rgba(255, 255, 255, 0.6);
            --shadow-soft: 0 10px 40px -10px rgba(0,0,0,0.08);
            --radius-xl: 24px;
            --radius-md: 16px;
            --c-pro: #3b82f6; --c-carb: #ef4444; --c-fat: #eab308;
            font-family: 'Tajawal', sans-serif;
            direction: rtl; text-align: right;
            background: linear-gradient(135deg, #eff6ff 0%, #f5f3ff 100%);
            padding: 25px; border-radius: var(--radius-xl);
            max-width: 800px; margin: 0 auto; color: #1e293b;
            box-shadow: var(--shadow-soft); position: relative; overflow: hidden;
        }
        #noor-premium-calc * { box-sizing: border-box; outline: none; }
        .header-box { text-align: center; margin-bottom: 25px; }
        .main-title { font-size: 26px; font-weight: 900; color: #1e1b4b; margin: 0; }
        .sub-title { font-size: 14px; color: #64748b; margin-top: 5px; }
        .glass-card { background: var(--glass-bg); border: var(--glass-border); border-radius: var(--radius-md); padding: 20px; margin-bottom: 15px; }
        .label-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
        .label-text { font-size: 15px; font-weight: 800; color: #334155; }
        .manual-link { font-size: 12px; color: var(--primary); cursor: pointer; font-weight: 700; border-bottom: 1px dashed var(--primary); }
        .smart-scroller { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 10px; scrollbar-width: none; }
        .smart-scroller::-webkit-scrollbar { display: none; }
        .pill-btn { flex: 0 0 auto; padding: 10px 18px; background: #fff; border: 1px solid #e2e8f0; border-radius: 50px; color: #475569; font-size: 13px; font-weight: 700; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
        .pill-btn.active { background: var(--primary); color: white; border-color: var(--primary); box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3); }
        .modern-input { width: 100%; padding: 14px 16px; border-radius: 12px; border: 2px solid #e2e8f0; background: #f8fafc; font-family: 'Tajawal'; font-size: 16px; font-weight: 600; transition: all 0.2s; }
        .modern-input:focus { border-color: var(--primary); background: #fff; box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1); }
        .search-wrap { position: relative; margin-bottom: 10px; }
        .amount-chips { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }
        .chip { background: #eff6ff; color: var(--primary); padding: 8px 14px; border-radius: 10px; font-size: 12px; font-weight: 700; cursor: pointer; border: 1px solid transparent; transition: 0.2s; }
        .chip:hover { background: #e0e7ff; transform: translateY(-2px); }
        .mode-wrapper { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
        .mode-lbl { background: #fff; border: 2px solid #e2e8f0; border-radius: 12px; padding: 10px; text-align: center; cursor: pointer; transition: 0.2s; }
        .mode-emoji { font-size: 20px; display: block; margin-bottom: 2px; }
        .mode-txt { font-size: 12px; font-weight: 700; color: #64748b; }
        .mode-inp:checked + .mode-lbl { border-color: var(--primary); background: #eef2ff; color: var(--primary); box-shadow: 0 4px 10px rgba(79, 70, 229, 0.15); }
        .mode-inp { display: none; }
        .hero-btn { width: 100%; padding: 18px; border-radius: 16px; border: none; background: linear-gradient(135deg, #4f46e5 0%, #4338ca 100%); color: white; font-size: 18px; font-weight: 800; font-family: 'Tajawal'; cursor: pointer; box-shadow: 0 10px 20px rgba(79, 70, 229, 0.25); transition: all 0.3s; display: flex; align-items: center; justify-content: center; gap: 10px; }
        .hero-btn:hover { transform: translateY(-3px); }
        .result-panel { display: none; margin-top: 30px; border-top: 2px dashed #e2e8f0; padding-top: 20px; animation: slideUp 0.5s; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .res-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        @media (max-width: 600px) { .res-grid { grid-template-columns: 1fr; } }
        .res-card { background: white; padding: 20px; border-radius: 16px; text-align: center; border: 1px solid #f1f5f9; position: relative; }
        .res-card.winner { background: #f0fdf4; border: 2px solid #10b981; }
        .winner-badge { position: absolute; top: -12px; left: 50%; transform: translateX(-50%); background: #10b981; color: white; font-size: 11px; font-weight: 800; padding: 4px 12px; border-radius: 20px; }
        .food-name { font-size: 15px; font-weight: 800; margin-bottom: 5px; min-height: 40px; display: flex; align-items: center; justify-content: center; }
        .food-val { font-size: 28px; font-weight: 900; color: var(--primary); display: block; margin-bottom: 10px; }
        .food-val.win { color: #047857; }
        .macro-bars { display: flex; height: 8px; border-radius: 4px; overflow: hidden; background: #e2e8f0; margin: 15px 0; }
        .stat-row { display: flex; justify-content: space-between; font-size: 12px; color: #64748b; margin-bottom: 4px; font-weight: 600; }
        .coach-note { background: #ecfdf5; border: 1px solid #a7f3d0; color: #065f46; padding: 15px; border-radius: 12px; font-size: 14px; text-align: center; margin: 20px 0; font-weight: 600; }
        .btns-container { display: flex; gap: 10px; }
        .action-btn { flex: 1; padding: 12px; border: none; border-radius: 12px; font-weight: 700; cursor: pointer; font-family: 'Tajawal'; display: flex; align-items: center; justify-content: center; gap: 5px; transition: 0.2s; }
        .btn-copy { background: #f1f5f9; color: #475569; }
        .btn-whats { background: #22c55e; color: white; }
        .manual-form { display: none; background: #fff7ed; padding: 15px; border-radius: 12px; margin-top: 10px; border: 1px dashed #fdba74; }
        .inputs-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 10px; }
    `;
    document.head.appendChild(style);

    // HTML
    container.innerHTML = `
        <div class="header-box">
            <h1 class="main-title">حاسبة البدائل الذكية ⚡</h1>
            <p class="sub-title">غير أكلك بذكاء، وحافظ على هدفك</p>
        </div>
        <div class="glass-card">
            <div class="label-row"><span class="label-text">1️⃣ بتاكل إيه دلوقتي؟</span><span class="manual-link" onclick="toggleManual('src')">إضافة يدوي ✍️</span></div>
            <div class="smart-scroller" id="category-container"></div>
            <div id="src-db-view">
                <div class="search-wrap"><input type="text" id="search-src" class="modern-input" placeholder="🔍 ابحث..." onkeyup="filterList('src')"></div>
                <select id="src-food" class="modern-input"></select>
            </div>
            <div id="src-manual-view" class="manual-form">
                <input type="text" id="src-m-name" class="modern-input" placeholder="اسم الأكلة">
                <div class="inputs-row">
                    <input type="number" id="src-m-c" class="modern-input" placeholder="سعرات">
                    <input type="number" id="src-m-p" class="modern-input" placeholder="بروتين">
                    <input type="number" id="src-m-k" class="modern-input" placeholder="كارب">
                    <input type="number" id="src-m-f" class="modern-input" placeholder="دهون">
                </div>
            </div>
        </div>
        <div class="glass-card">
            <div class="label-row"><span class="label-text">2️⃣ الكمية (جم) ⚖️</span></div>
            <input type="number" id="inp-amount" class="modern-input" placeholder="100">
            <div class="amount-chips">
                <div class="chip" onclick="setAmount(15)">🥄 ملعقة (15g)</div>
                <div class="chip" onclick="setAmount(30)">🥄 سكوب (30g)</div>
                <div class="chip" onclick="setAmount(100)">💯 100g</div>
                <div class="chip" onclick="setAmount(200)">🥛 كوب (200g)</div>
            </div>
        </div>
        <div class="glass-card">
            <div class="label-row"><span class="label-text">3️⃣ عايز تبدله بـ إيه؟ 🔄</span><span class="manual-link" onclick="toggleManual('tgt')">إضافة يدوي ✍️</span></div>
            <div id="tgt-db-view">
                <div class="search-wrap"><input type="text" id="search-tgt" class="modern-input" placeholder="🔍 ابحث عن البديل..." onkeyup="filterList('tgt')"></div>
                <select id="tgt-food" class="modern-input"></select>
            </div>
            <div id="tgt-manual-view" class="manual-form">
                <input type="text" id="tgt-m-name" class="modern-input" placeholder="اسم البديل">
                <div class="inputs-row">
                    <input type="number" id="tgt-m-c" class="modern-input" placeholder="سعرات">
                    <input type="number" id="tgt-m-p" class="modern-input" placeholder="بروتين">
                    <input type="number" id="tgt-m-k" class="modern-input" placeholder="كارب">
                    <input type="number" id="tgt-m-f" class="modern-input" placeholder="دهون">
                </div>
            </div>
        </div>
        <div class="glass-card">
            <div class="label-row"><span class="label-text">4️⃣ نساوي على أساس إيه؟ 🎯</span></div>
            <div class="mode-wrapper">
                <label><input type="radio" name="target-mode" value="c" class="mode-inp" checked><div class="mode-lbl"><span class="mode-emoji">🔥</span><span class="mode-txt">سعرات</span></div></label>
                <label><input type="radio" name="target-mode" value="p" class="mode-inp"><div class="mode-lbl"><span class="mode-emoji">💪</span><span class="mode-txt">بروتين</span></div></label>
                <label><input type="radio" name="target-mode" value="k" class="mode-inp"><div class="mode-lbl"><span class="mode-emoji">🍞</span><span class="mode-txt">كارب</span></div></label>
                <label><input type="radio" name="target-mode" value="f" class="mode-inp"><div class="mode-lbl"><span class="mode-emoji">🥑</span><span class="mode-txt">دهون</span></div></label>
            </div>
        </div>
        <button onclick="calculate()" class="hero-btn">احسب النتيجة 🚀</button>
        <div id="res-container" class="result-panel">
            <h3 id="calc-msg" style="text-align:center; color:#4f46e5; margin-bottom:15px;"></h3>
            <div class="res-grid">
                <div class="res-card"><div class="food-name" id="name-src">-</div><span class="food-val" id="amt-src">0g</span><div id="bar-src" class="macro-bars"></div><div id="stats-src"></div></div>
                <div class="res-card winner"><div class="winner-badge">✅ البديل</div><div class="food-name" id="name-tgt">-</div><span class="food-val win" id="amt-tgt">0g</span><div id="bar-tgt" class="macro-bars"></div><div id="stats-tgt"></div></div>
            </div>
            <div class="coach-note" id="coach-tip"></div>
            <div class="btns-container">
                <button class="action-btn btn-copy" onclick="copyResult()">📋 نسخ</button>
                <button class="action-btn btn-whats" onclick="sendWhatsapp()">💬 واتساب</button>
            </div>
        </div>
    `;

    // Database - استخدام قاعدة البيانات الموسعة
    var db = FOOD_DATABASE; // استخدام القاعدة الموسعة من food-database.js

    var curList = [], lastResult = {}, allItems = getAllFoodsFlat(); // استخدام الدالة المساعدة

    function init() {
        var scroller = document.getElementById('category-container');
        var keys = ['📋 الكل', ...Object.keys(db)];
        keys.forEach((key, i) => {
            var btn = document.createElement('div');
            btn.className = `pill-btn ${i === 0 ? 'active' : ''}`;
            btn.innerText = key === '📋 الكل' ? 'الكل' : key;
            btn.onclick = () => {
                document.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                loadList(key);
            };
            scroller.appendChild(btn);
        });
        loadList('📋 الكل');
    }

    function loadList(catName) {
        if (catName === '📋 الكل') {
            curList = allItems;
        } else {
            curList = db[catName] || [];
        }
        populateSelect('src-food', curList);
        populateSelect('tgt-food', curList);
        document.getElementById('res-container').style.display = 'none';
    }

    function populateSelect(id, list) {
        var sel = document.getElementById(id);
        sel.innerHTML = '';
        list.forEach((item, idx) => { var opt = document.createElement('option'); opt.value = idx; opt.text = item.n; sel.add(opt); });
    }

    window.filterList = function (type) {
        var q = document.getElementById('search-' + type).value.toLowerCase();
        var sel = document.getElementById(type + '-food');
        sel.innerHTML = '';
        curList.forEach((item, idx) => { if (item.n.toLowerCase().includes(q)) { var opt = document.createElement('option'); opt.value = idx; opt.text = item.n; sel.add(opt); } });
    };

    window.toggleManual = function (type) {
        var dbV = document.getElementById(type + '-db-view');
        var mnV = document.getElementById(type + '-manual-view');
        dbV.style.display = dbV.style.display === 'none' ? 'block' : 'none';
        mnV.style.display = mnV.style.display === 'block' ? 'none' : 'block';
    };

    window.setAmount = function (val) { document.getElementById('inp-amount').value = val; };

    function getItemData(type) {
        var mnV = document.getElementById(type + '-manual-view');
        if (mnV.style.display === 'block') {
            return { n: document.getElementById(type + '-m-name').value || 'يدوي', m: { c: parseFloat(document.getElementById(type + '-m-c').value) || 0, p: parseFloat(document.getElementById(type + '-m-p').value) || 0, k: parseFloat(document.getElementById(type + '-m-k').value) || 0, f: parseFloat(document.getElementById(type + '-m-f').value) || 0 } };
        }
        return curList[document.getElementById(type + '-food').value];
    }

    function renderStats(divId, m, amt) {
        var f = amt / 100;
        document.getElementById(divId).innerHTML = `<div class="stat-row"><span>سعرات</span><span>${Math.round(m.c * f)}</span></div><div class="stat-row"><span>بروتين</span><span>${Math.round(m.p * f)}g</span></div><div class="stat-row"><span>كارب</span><span>${Math.round(m.k * f)}g</span></div><div class="stat-row"><span>دهون</span><span>${Math.round(m.f * f)}g</span></div>`;
    }

    function renderBar(divId, m, amt) {
        var f = amt / 100, p = m.p * f * 4, k = m.k * f * 4, ft = m.f * f * 9, t = p + k + ft;
        if (t === 0) { document.getElementById(divId).innerHTML = ''; return; }
        document.getElementById(divId).innerHTML = `<div style="width:${(p / t) * 100}%; background:var(--c-pro)"></div><div style="width:${(k / t) * 100}%; background:var(--c-carb)"></div><div style="width:${(ft / t) * 100}%; background:var(--c-fat)"></div>`;
    }

    window.calculate = function () {
        var amt = parseFloat(document.getElementById('inp-amount').value);
        if (!amt || amt <= 0) { alert('دخل الكمية! ⚖️'); return; }
        var i1 = getItemData('src'), i2 = getItemData('tgt');
        if (!i1 || !i2) return;
        var mode = document.querySelector('input[name="target-mode"]:checked').value;
        var labels = { c: 'السعرات', p: 'البروتين', k: 'الكارب', f: 'الدهون' };
        var v1 = i1.m[mode], v2 = i2.m[mode];
        if (v1 > 0 && v2 <= 0) { alert('البديل مفيهوش العنصر ده!'); return; }
        var tAmt = (v1 === 0 && v2 === 0) ? amt : Math.round(((amt * v1) / 100 * 100) / v2);

        document.getElementById('name-src').innerText = i1.n;
        document.getElementById('amt-src').innerText = amt + 'g';
        renderStats('stats-src', i1.m, amt);
        renderBar('bar-src', i1.m, amt);
        document.getElementById('name-tgt').innerText = i2.n;
        document.getElementById('amt-tgt').innerText = tAmt + 'g';
        renderStats('stats-tgt', i2.m, tAmt);
        renderBar('bar-tgt', i2.m, tAmt);
        document.getElementById('calc-msg').innerText = `ساوينا الكمية بناءً على: ${labels[mode]}`;
        document.getElementById('coach-tip').innerText = i2.m.p > 20 ? "🔥 عاش! بروتين عالي." : "✅ اختيار ممتاز!";
        document.getElementById('res-container').style.display = 'block';
        document.getElementById('res-container').scrollIntoView({ behavior: "smooth" });
        lastResult = { sN: i1.n, sA: amt, tN: i2.n, tA: tAmt, m: labels[mode] };
    };

    window.copyResult = function () {
        if (!lastResult.sN) return;
        var t = `♻️ *تبديل ذكي*\n🛑 ${lastResult.sN} (${lastResult.sA}g)\n✅ ${lastResult.tN} (${lastResult.tA}g)\n🎯 التساوي: ${lastResult.m}`;
        navigator.clipboard.writeText(t).then(() => alert('تم النسخ!'));
    };

    window.sendWhatsapp = function () {
        if (!lastResult.sN) return;
        var t = `♻️ *تبديل ذكي*\n🛑 ${lastResult.sN} (${lastResult.sA}g)\n✅ ${lastResult.tN} (${lastResult.tA}g)\n🎯 التساوي: ${lastResult.m}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(t)}`, '_blank');
    };

    init();
})();
