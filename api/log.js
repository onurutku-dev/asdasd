const fs = require('fs');
const path = require('path');

const LOG_FILE = path.join('/tmp', 'log.json');

function readLogs() {
    try {
        if (fs.existsSync(LOG_FILE)) {
            return JSON.parse(fs.readFileSync(LOG_FILE, 'utf-8'));
        }
    } catch (e) {}
    return [];
}

function writeLogs(logs) {
    fs.writeFileSync(LOG_FILE, JSON.stringify(logs, null, 2), 'utf-8');
}

module.exports = (req, res) => {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // GET — logları getir
    if (req.method === 'GET') {
        const logs = readLogs();
        return res.status(200).json({ toplam: logs.length, loglar: logs });
    }

    // POST — yeni log ekle
    if (req.method === 'POST') {
        const logs = readLogs();
        const ip = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'bilinmiyor';

        const yeniLog = {
            id: logs.length + 1,
            tarih: new Date().toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' }),
            buton: req.body?.buton || 'bilinmiyor',
            cihaz: {
                tarayici: req.body?.tarayici || '',
                isletimSistemi: req.body?.isletimSistemi || '',
                cihazTuru: req.body?.cihazTuru || '',
                ekranBoyutu: req.body?.ekranBoyutu || '',
                dil: req.body?.dil || '',
            },
            ip: typeof ip === 'string' ? ip.split(',')[0].trim() : 'bilinmiyor',
            userAgent: req.body?.userAgent || '',
        };

        logs.push(yeniLog);
        writeLogs(logs);

        return res.status(200).json({ basarili: true, log: yeniLog });
    }

    return res.status(405).json({ hata: 'Sadece GET ve POST destekleniyor' });
};
