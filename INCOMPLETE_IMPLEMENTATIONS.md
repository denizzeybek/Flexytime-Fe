# Incomplete Implementations Report

Bu rapor, projede eksik kalan implementasyonları sayfa ve modül bazında listelemektedir.

**Rapor Tarihi**: 2025-11-29
**Toplam Eksik Implementasyon**: 23 adet

---

## Phase 1: Kritik İş Mantığı Eksikleri (Yüksek Öncelik)

Bu phase'deki eksikler, kullanıcı deneyimini doğrudan etkileyen ve temel fonksiyonelliği engelleyen eksiklerdir.

### 1.1 Worktime Usage Module

#### `src/views/worktimeUsage/index.vue`

| Satır | Fonksiyon | Durum | Açıklama |
|-------|-----------|-------|----------|
| 297 | `handleDownload()` | TODO | Rapor indirme fonksiyonu sadece console.log içeriyor, gerçek download işlemi yok |
| 302 | `handleToggleDomain(webClock, newDomain)` | TODO | Domain toggle API çağrısı yapılmıyor, sadece log atıyor |

**Mevcut Kod:**
```typescript
// Line 297
const handleDownload = () => {
  console.log('Download report clicked')
  // TODO: Implement download functionality
}

// Line 302
const handleToggleDomain = (webClock: any, newDomain: string) => {
  console.log('Toggle domain', webClock, newDomain)
  // TODO: Implement domain toggle API call
}
```

**Gerekli Aksiyonlar:**
- [ ] Download için API endpoint belirlenmeli
- [ ] Export formatı (PDF, Excel, CSV) belirlenmeli
- [ ] Domain toggle için PATCH/PUT endpoint'i oluşturulmalı

---

### 1.2 HR Settings Module

#### `src/views/hrSettings/_components/employees/EmployeesTable.vue`

| Satır | Fonksiyon | Durum | Açıklama |
|-------|-----------|-------|----------|
| 178 | `handleAlwaysOnChange(event)` | TODO | Çalışan enabled durumu güncelleme API'si çağrılmıyor |

**Mevcut Kod:**
```typescript
const handleAlwaysOnChange = (event: any) => {
  // TODO: Implement update employee enabled status
  // employeeStore.updateEmployeeStatus(event)
}
```

**Gerekli Aksiyonlar:**
- [ ] `employeeStore.updateEmployeeStatus()` metodu implemente edilmeli
- [ ] API endpoint'i belirlenmeli (PUT /employees/:id/status)
- [ ] Optimistic update veya loading state eklenmeli

---

### 1.3 Settings Module - Companies

#### `src/views/settings/_components/companies/CompaniesTable.vue`

| Satır | Fonksiyon | Durum | Açıklama |
|-------|-----------|-------|----------|
| 160 | `handleDelete(companyID)` | TODO | Şirket silme işlemi sadece log atıyor, gerçek silme yok |
| 151 | `handlePage(e)` | Stub | Pagination handler sadece log atıyor |

**Mevcut Kod:**
```typescript
// Line 160
const handleDelete = (companyID: number) => {
  console.log('companyID', companyID)
  // TODO: Implement delete functionality
  // companyStore.deleteCompany(companyID)
}

// Line 151
const handlePage = (e: any) => {
  console.log('e', e)
  // Handle pagination if needed
}
```

**Gerekli Aksiyonlar:**
- [ ] Silme öncesi onay modalı eklenmeli
- [ ] `companyStore.deleteCompany()` metodu implemente edilmeli
- [ ] Pagination backend ile entegre edilmeli

---

## Phase 2: Timesheet Module Eksikleri (Orta Öncelik)

Bu phase, timesheet modülündeki eksik implementasyonları içerir.

### 2.1 Time Management

#### `src/views/timesheets/_views/TimeManagement.vue`

| Satır | Fonksiyon | Durum | Açıklama |
|-------|-----------|-------|----------|
| 104 | Watch (route meta) | TODO | DatePicker'dan startDate ve endDate payload'a dahil edilmiyor |
| 118 | Initial form value | TODO | Hardcoded tarih aralığı kullanılıyor, datePicker'dan değer alınmalı |

**Gerekli Aksiyonlar:**
- [ ] DatePicker component'inden tarih değerleri alınmalı
- [ ] API çağrılarına tarih aralığı parametreleri eklenmeli
- [ ] Tarih formatı backend ile uyumlu hale getirilmeli

---

### 2.2 Time Entries

#### `src/views/timesheets/_views/TimeEntries.vue`

| Satır | Fonksiyon | Durum | Açıklama |
|-------|-----------|-------|----------|
| 58 | Watch (route meta) | TODO | DatePicker'dan startDate ve endDate payload'a dahil edilmiyor |

---

### 2.3 Unclassified Time Entries

#### `src/views/timesheets/_views/UnclassifiedTimeEntries.vue`

| Satır | Fonksiyon | Durum | Açıklama |
|-------|-----------|-------|----------|
| 118 | submitHandler | Dead Code | Tüm submitHandler kodu yorum satırında |
| 176 | `getSelectedTrueObjects(data)` | TODO | Backend bağımlılığı - payload yapısı belirsiz |
| 223 | Watch (fields) | TODO | Değişiklik algılama mantığı implemente edilmemiş |

**Mevcut Kod (Line 176):**
```typescript
const getSelectedTrueObjects = (data: any) => {
  // TODO: Backend dependency
  // Unclear if should send IDs only, plain objects, or detailed data
}
```

**Gerekli Aksiyonlar:**
- [ ] Backend ile payload yapısı netleştirilmeli
- [ ] submitHandler aktif edilmeli
- [ ] Field değişiklik karşılaştırması implemente edilmeli

---

### 2.4 Timesheet Modals & Components

#### `src/views/timesheets/_modals/UpdateTimeEntriesModal.vue`

| Satır | Event | Durum | Açıklama |
|-------|-------|-------|----------|
| 49 | `@addList` | Placeholder | Yeni proje ekleme event'i sadece log atıyor |
| 60 | `@addList` | Placeholder | Yeni tag ekleme event'i sadece log atıyor |

#### `src/views/timesheets/_components/timeEntries/EnterTime.vue`

| Satır | Event | Durum | Açıklama |
|-------|-------|-------|----------|
| 103 | `@addList` | Placeholder | Yeni proje ekleme event'i sadece log atıyor |
| 114 | `@addList` | Placeholder | Yeni tag ekleme event'i sadece log atıyor |

#### `src/views/timesheets/_components/timeEntries/EnteredTimes.vue`

| Satır | Event | Durum | Açıklama |
|-------|-------|-------|----------|
| 96 | `@addList` | Placeholder | Yeni proje ekleme event'i sadece log atıyor |
| 107 | `@addList` | Placeholder | Yeni tag ekleme event'i sadece log atıyor |

**Gerekli Aksiyonlar:**
- [ ] Inline proje ekleme modal/form oluşturulmalı
- [ ] Inline tag ekleme modal/form oluşturulmalı
- [ ] Store'lara create metodları eklenmeli

---

### 2.5 Time Management Composable

#### `src/views/timesheets/_composables/useTimeManagement.ts`

| Satır | Fonksiyon | Durum | Açıklama |
|-------|-----------|-------|----------|
| 18 | `generateTableColumns()` | Unused Log | startDate/endDate log atılıyor ama kullanılmıyor |
| 31 | `generateTableData()` | Unused Log | startDate/endDate log atılıyor ama kullanılmıyor |

---

## Phase 3: Promotion Module (Düşük Öncelik)

### 3.1 Promotion Steps

#### `src/views/promotion/_views/Promotion.vue`

| Satır | Fonksiyon | Durum | Açıklama |
|-------|-----------|-------|----------|
| 65 | Steps initialization | TODO | Adımların aktivasyon mantığı implemente edilmemiş |

**Mevcut Kod:**
```typescript
// TODO: Collect required data for steps and activate them based on data
// Steps activation logic not implemented
```

**Gerekli Aksiyonlar:**
- [ ] Her adım için gerekli veri belirlenecek
- [ ] Veri durumuna göre adım aktivasyonu yapılacak
- [ ] Wizard pattern uygulanacak

---

## Phase 4: Debug Logging Temizliği (Düşük Öncelik)

Aşağıdaki dosyalarda production'a gitmemesi gereken debug log'ları bulunmaktadır:

### 4.1 Router

#### `src/router/index.ts`

| Satır | Açıklama |
|-------|----------|
| 99, 101, 119, 133 | Auth guard'da debug console.log'ları |

### 4.2 Auth Store

#### `src/stores/auth.ts`

| Satır | Açıklama |
|-------|----------|
| 36 | Login payload debug log'u |

### 4.3 Worktime Usage

#### `src/views/worktimeUsage/index.vue`

| Satır | Açıklama |
|-------|----------|
| 333 | Employee API response emoji'li log |

---

## Özet Tablosu

| Phase | Modül | Kritiklik | Eksik Sayısı |
|-------|-------|-----------|--------------|
| Phase 1 | Kritik İş Mantığı | Yüksek | 5 |
| Phase 2 | Timesheet | Orta | 11 |
| Phase 3 | Promotion | Düşük | 1 |
| Phase 4 | Debug Cleanup | Düşük | 4 |
| **Toplam** | | | **21** |

---

## Öneri: Uygulama Sırası

1. **Hemen Yapılmalı (Sprint 1)**
   - Worktime Usage download ve domain toggle
   - HR Settings employee status update
   - Companies silme işlemi

2. **Yakın Vadede (Sprint 2)**
   - Timesheet date picker entegrasyonu (3 yerde kullanılıyor)
   - Unclassified time entries backend entegrasyonu

3. **Orta Vadede (Sprint 3)**
   - Add project/tag inline formları

4. **Backlog**
   - Promotion steps aktivasyon mantığı
   - Debug log temizliği (production build öncesi)

---

*Bu rapor otomatik olarak oluşturulmuştur. Her bir eksik için ilgili dosya ve satır numarası belirtilmiştir.*
