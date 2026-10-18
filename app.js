const money = new Intl.NumberFormat('th-TH');
const el = (id) => document.getElementById(id);
const latestResult = {
  drawDateThai: 'งวดวันที่ 16 ตุลาคม 2569', updatedAt: '18 ตุลาคม 2569', first: ['011781'], adjacent: ['011780', '011782'],
  second: ['715282','487283','924796','987375','040201'], third: ['707243','725216','977152','933071','715465','018120','330201','193638','406667','777615'],
  fourth: ['192998','163132','285080','855894','779377','482795','011559','917085','837858','166937','571441','909758','329547','381117','247128','217879','930033','380113','806854','539027','364611','846032','084602','109645','349296','231413','434948','216806','007066','734768','430591','598357','686433','049472','815652','478977','076098','490329','184865','297951','907619','408935','730249','859236','921595','218478','075252','930554','818290','072131'],
  fifth: ['632573','097971','751294','160964','858629','586622','649003','553592','112188','128839','616934','574617','088404','518639','706067','507464','931692','500826','020244','969818','070806','952557','805847','753057','850982','332178','638817','892111','283326','321989','259756','124627','787357','564273','366570','458456','093084','694543','281982','120388','307981','146261','079540','377452','020249','636285','592906','861162','420233','055132','888072','632227','748095','133135','729597','553509','339453','227090','591666','687790','295630','267602','242473','117782','352532','013538','429008','500854','518624','894125','759055','566054','282404','011708','553669','494542','944365','767368','122668','581378','739597','739924','392874','377722','280460','334497','439859','688480','712155','115589','282324','003858','027630','901261','074678','041761','971178','416659','634175','598340'],
  front3: ['402','392'], back3: ['171','255'], last2: ['48']
};
function nextScheduledDraw() { const now = new Date(); const bangkok = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Bangkok' })); const day = bangkok.getDate(); let month = bangkok.getMonth(); const nextDay = day < 16 ? 16 : 1; if (day >= 16) month += 1; return new Intl.DateTimeFormat('th-TH', { dateStyle: 'long', timeZone: 'Asia/Bangkok' }).format(new Date(bangkok.getFullYear(), month, nextDay)); }
function prize(label, numbers, amount) { return { label, numbers, amount }; }
function prizeGroups() { return [prize('รางวัลที่ 1', latestResult.first, 6000000), prize('รางวัลข้างเคียงรางวัลที่ 1', latestResult.adjacent, 100000), prize('รางวัลที่ 2', latestResult.second, 200000), prize('รางวัลที่ 3', latestResult.third, 80000), prize('รางวัลที่ 4', latestResult.fourth, 40000), prize('รางวัลที่ 5', latestResult.fifth, 20000), prize('เลขหน้า 3 ตัว', latestResult.front3, 4000), prize('เลขท้าย 3 ตัว', latestResult.back3, 4000), prize('เลขท้าย 2 ตัว', latestResult.last2, 2000)]; }
function render() {
  el('latest-heading').textContent = latestResult.drawDateThai; el('updatedAt').textContent = `อัปเดตล่าสุด ${latestResult.updatedAt}`; el('statusBadge').textContent = 'ประกาศผลแล้ว'; el('statusBadge').className = 'status verified';
  const top = [prize('รางวัลที่ 1', latestResult.first, 6000000), prize('เลขหน้า 3 ตัว', latestResult.front3, 4000), prize('เลขท้าย 3 ตัว', latestResult.back3, 4000), prize('เลขท้าย 2 ตัว', latestResult.last2, 2000)];
  el('prizeGrid').innerHTML = top.map((item, i) => `<article class="prize ${i === 0 ? 'first' : ''}"><span>${item.label}</span><strong>${item.numbers.join('  ')}</strong><small>รางวัลละ ${money.format(item.amount)} บาท</small></article>`).join('');
  el('allPrizes').innerHTML = prizeGroups().map((item) => `<div class="prize-list"><b>${item.label}</b><strong>${item.numbers.join(' ')}</strong><span>รางวัลละ ${money.format(item.amount)} บาท</span></div>`).join('');
}
function checkNumber(number) {
  const wins = []; for (const item of prizeGroups().slice(0, 6)) if (item.numbers.includes(number)) wins.push(item);
  if (latestResult.front3.includes(number.slice(0, 3))) wins.push(prize('เลขหน้า 3 ตัว', [number.slice(0, 3)], 4000));
  if (latestResult.back3.includes(number.slice(-3))) wins.push(prize('เลขท้าย 3 ตัว', [number.slice(-3)], 4000));
  if (latestResult.last2.includes(number.slice(-2))) wins.push(prize('เลขท้าย 2 ตัว', [number.slice(-2)], 2000)); return wins;
}
el('nextDraw').textContent = nextScheduledDraw(); el('year').textContent = new Date().getFullYear() + 543;
el('lotteryNumber').addEventListener('input', (event) => { event.target.value = event.target.value.replace(/\D/g, ''); });
el('lotteryForm').addEventListener('submit', (event) => { event.preventDefault(); const number = el('lotteryNumber').value; const box = el('checkResult'); box.hidden = false; box.className = 'check-result'; if (!/^\d{6}$/.test(number)) { box.textContent = 'กรุณากรอกเลขสลากให้ครบ 6 หลัก'; box.classList.add('error'); return; } const wins = checkNumber(number); if (wins.length) { const total = wins.reduce((sum, win) => sum + win.amount, 0); box.classList.add('win'); box.innerHTML = `<img class="winner-logo" src="winner-logo.jpg" alt="ตกใจกับการถูกรางวัล"><div><strong>เชี่ย!!! มึงดวงดีฃิบหาย</strong><span>เลข ${number} ถูกรางวัล: ${wins.map((win) => `${win.label} (${money.format(win.amount)} บาท)`).join(', ')}<br>รวมเงินรางวัล ${money.format(total)} บาท</span></div>`; } else { box.classList.add('lose'); box.innerHTML = `<img class="loser-logo" src="loser-logo.jpg" alt="ไม่ถูกรางวัลงวดนี้"><div><strong>ว้าย!!!ถูกหวยแดกสมน้ำหน้าอีคนบาป</strong><span>เลข ${number} ไม่ถูกรางวัลในงวดวันที่ 16 ตุลาคม 2569</span></div>`; } });
render();
