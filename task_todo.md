# Deniz Zeybek - Jira Task Planı

> Bu dosya Jira'da Deniz Zeybek'e atanmış açık task'ların analizini ve uygulama planını içerir.
> Son güncelleme: 2026-01-02

---

## Özet

| Durum | Sayı |
|-------|------|
| To Do | 7 |
| **Toplam** | **7** |

---

## FRONTEND YAPILACAKLAR (Deniz)

### 1. KAN-60: Time entries ekranında görev saati giriş ve bitiş kutusu görünümü bozuldu
- **Durum:** To Do
- **Öncelik:** Medium
- **Konum:** `src/views/timesheets/_components/timeEntries/_components/ManualTimeInputs.vue`

**Plan:**
1. ManualTimeInputs.vue dosyasını incele
2. Time input component'lerinin CSS'ini kontrol et
3. PrimeVue DatePicker/InputMask styling sorunlarını düzelt
4. Responsive davranışı test et

**Tahmini Zorluk:** Kolay (CSS fix)

---

### 2. KAN-59: Time entries ekranı çalışmıyor
- **Durum:** To Do
- **Öncelik:** Medium
- **Konum:** `src/views/timesheets/_views/TimeSheets.vue`

**Plan:**
1. Ekranı aç ve console hatalarını kontrol et
2. API çağrılarını incele
3. Store state'ini kontrol et
4. Component mount lifecycle'ı debug et

**Tahmini Zorluk:** Orta (Debug gerekli)

---

### 3. KAN-58: Manual time entries ekranında proje ekleme tuşu proje giriş kutusunun altında olsun
- **Durum:** To Do
- **Öncelik:** Medium
- **Konum:** `src/views/timesheets/_views/ManualTimeEntries.vue`

**Plan:**
1. ManualTimeEntries.vue'yu incele
2. Proje ekleme butonunun mevcut konumunu bul
3. Butonu proje select/dropdown'ın altına taşı
4. Layout'u düzelt

**Tahmini Zorluk:** Kolay (UI düzenlemesi)

---

### 4. KAN-64: HR Settings > Annual Leaves - küsüratlı girişler aşağı yuvarlanıyor
- **Durum:** To Do
- **Öncelik:** Medium
- **Konum:** `src/views/hrSettings/_views/Annuals.vue`, `src/views/hrSettings/_components/annuals/AnnualsTable.vue`

**Plan:**
1. AnnualsTable.vue'da sayı gösterimini incele
2. `Math.floor` yerine `toFixed(2)` veya benzeri kullan
3. Decimal precision'ı koru
4. Backend'den gelen veriyi kontrol et

**Tahmini Zorluk:** Kolay (Number formatting)

---

### 5. KAN-65: Company > Organization chart - sağdaki yazıların anlamını yazalım
- **Durum:** To Do
- **Öncelik:** Medium
- **Konum:** `src/views/company/_views/OrganizationChart.vue`

**Plan:**
1. Organization chart ekranını incele
2. "Min rest time" vb. alanları bul
3. Tooltip veya info icon ekle
4. i18n ile çeviri ekle

**Tahmini Zorluk:** Kolay (UI enhancement)

---

## BACKEND GEREKTİREN TASKLAR (Neyfer'e Bildirilecek)

### 6. KAN-67: Tüm zamanların yerelleştirilmesi (Timezone)
- **Durum:** To Do
- **Öncelik:** Medium

**Analiz:**
Bu task hem frontend hem backend değişikliği gerektiriyor:
- Backend: Tüm zaman verilerini UTC olarak saklama ve döndürme
- Frontend: Kullanıcının timezone'una göre gösterim

**Frontend Planı (Backend hazır olunca):**
1. Kullanıcı timezone tercihini profile'dan al
2. dayjs ile UTC → Local dönüşümü yap
3. Tüm zaman gösterimlerini güncelle

**Backend Gereksinimi:**
- API response'larında zamanlar UTC formatında olmalı
- Kullanıcı timezone bilgisi endpoint'i gerekli

**Durum:** ⏸️ Backend bağımlı - Neyfer ile koordinasyon gerekli

---

### 7. KAN-54: Organization Chart Oluşturulmasında Problemler
- **Durum:** To Do
- **Öncelik:** Medium

**Analiz:**
1. ✅ Frontend yapılabilir: İsimler seçilebilir olmalı (Autocomplete/Select kullan)
2. ❌ Backend: Veritabanına yazarken problem var
3. ⚠️ Tartışmalı: Otomatik kayıt (auto-save vs manual save)

**Frontend Planı:**
1. Serbest metin girişi yerine employee listesinden seçim yap
2. Autocomplete component ekle

**Backend Gereksinimi:**
- Organizasyon chart kaydetme API'si düzeltilmeli

**Durum:** ⏸️ Kısmen backend bağımlı

---

## ÖNCELIK SIRASI (Önerilen)

### Hemen Yapılabilir (Backend bağımlılığı yok):
1. **KAN-60** - Time entries görünüm bozukluğu (CSS fix)
2. **KAN-58** - Proje ekleme butonu konumu (UI fix)
3. **KAN-64** - Annual leaves decimal formatı (Number fix)
4. **KAN-65** - Organization chart açıklamalar (Tooltip)

### Debug Gerekli:
5. **KAN-59** - Time entries çalışmıyor (Debug)

### Backend Bağımlı:
6. **KAN-54** - Organization chart (Kısmen backend)
7. **KAN-67** - Timezone (Tam backend bağımlı)

---

## Neyfer'e Açılması Gereken Yeni Task'lar

| Task | Konu | Neden |
|------|------|-------|
| ✅ KAN-68 | Distribution API veri tutarsızlığı | Zaten açıldı |
| ⏳ Yeni | Timezone desteği için backend API | KAN-67 için gerekli |
| ⏳ Yeni | Organization chart kaydetme hatası | KAN-54 için gerekli |
| ⏳ Yeni | Lightweight Lookup API'leri | Select component'ler için (detay aşağıda) |

---

## Backend için Lightweight Lookup API İhtiyacı

### Problem

Projede birçok modal ve form'da dropdown/select component'leri var. Bunların doldurulması için şu anda ağır API'ler kullanılıyor veya hiç veri gelmiyor (input olarak bırakılmış).

### Mevcut API'ler ve Sorunları

| Veri | Mevcut API | Sorun |
|------|------------|-------|
| Employees | `GET /webapi/definition/employees` | Çok ağır - tüm detayları döndürüyor |
| Teams | Aynı API içinde | Employees API'ye bağımlı |
| Sections/Departments | `GET /webapi/company/reports` içinde `SectionList` | Report API'ye bağımlı |
| Report Types | `GET /webapi/company/reports` içinde `ReportTypes` | Report API'ye bağımlı |
| Titles | `GET /webapi/company/organization` içinde `Titles` | Organization API'ye bağımlı |
| Members (Org Chart) | `GET /webapi/company/organization` içinde `Members` | Organization API'ye bağımlı |
| Projects | `GET /webapi/timesheet/projects` | ✅ Zaten var |
| Tags | `GET /webapi/timesheet/tags` | ✅ Zaten var |

### Önerilen Çözüm: Tek Lookup Endpoint

```
GET /webapi/lookup
Response: {
  employees: [{ id: string, name: string }],
  teams: [{ id: string, name: string }],
  sections: [{ id: string, name: string }],
  titles: [{ id: string, name: string }],
  reportTypes: [{ id: string, name: string }],
  roles: [{ id: number, name: string }]
}
```

**Avantajları:**
- Tek API çağrısı ile tüm lookup verileri alınır
- Sadece id + name döner (lightweight)
- App başlangıcında bir kez çağrılıp cache'lenebilir
- Modal'lar anında açılır (veri zaten hazır)

### Frontend'de Kullanım Alanları

| Konum | İhtiyaç | Mevcut Durum |
|-------|---------|--------------|
| `AnnualModal.vue` | Employee seçimi | `annualsStore.members` - ağır API |
| `DefaultReportModal.vue` | Team seçimi | `reportsStore.sectionList` - report API bağımlı |
| `DefaultReportModal.vue` | Report type seçimi | `reportsStore.reportTypes` - report API bağımlı |
| `EmployeeModal.vue` | Team seçimi | Store'dan - ağır API |
| `EmployeeModal.vue` | Title seçimi | Store'dan - ağır API |
| `OrganizationChart` node edit | Member seçimi | Şu an input (select olmalı) |
| `HolidayModal.vue` | Employee seçimi | Kontrol edilmeli |

### Alternatif: Ayrı Lightweight Endpoint'ler

Eğer tek endpoint çok büyük olursa:

```
GET /webapi/lookup/employees → [{ id, name }]
GET /webapi/lookup/teams → [{ id, name }]
GET /webapi/lookup/sections → [{ id, name }]
GET /webapi/lookup/titles → [{ id, name }]
GET /webapi/lookup/report-types → [{ id, name }]
```

### Öncelik Sırası

1. **Employees** - En çok kullanılan (Annual, Holiday, Org Chart modal'ları)
2. **Teams** - Employee modal, Report modal
3. **Sections** - Report modal
4. **Titles** - Employee modal, Org Chart
5. **Report Types** - Report modal

---

## Notlar

- KAN-67 (timezone) büyük bir iş, önce backend hazır olmalı
- KAN-54'ün frontend kısmı (autocomplete) yapılabilir, backend kısmı Neyfer'e
- Lookup API hazır olunca birçok modal düzeltilebilir
- Projects ve Tags API'leri zaten lightweight formatta mevcut ✅

