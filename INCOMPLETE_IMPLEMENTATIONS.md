# Incomplete Implementations Report

Bu rapor, projede eksik kalan implementasyonları sayfa ve modül bazında listelemektedir.

**Rapor Tarihi**: 2025-11-30
**Toplam Eksik Implementasyon**: 3 aktif

---

## Phase 1: Timesheet Components - @addList Placeholder'ları

Aşağıdaki dosyalarda `@addList` event'leri sadece `console.log` atıyor:

| Dosya | Satırlar |
|-------|----------|
| `src/views/timesheets/_modals/UpdateTimeEntriesModal.vue` | 70, 81 |

**Gerekli Aksiyonlar:**
- [ ] Inline proje ekleme modal/form oluşturulmalı
- [ ] Inline tag ekleme modal/form oluşturulmalı

> **Not:** `EnterTime.vue` ve `EnteredTimes.vue` dosyalarında `headerAddBtn` prop'u kullanılıyor ancak `@addList` event handler'ı yok - bu kasıtlı olabilir.

---

## Phase 2: Backend Bağımlı Eksikler

### 2.1 Time Entry Saniye Hassasiyeti

**Durum:** Backend sadece dakika hassasiyetinde çalışıyor

| Alan | Sorun |
|------|-------|
| `TimeSpanText` | Backend `HH:mm` formatında dönüyor, `HH:mm:ss` olmalı |
| Timer mode | 1 dakikadan kısa çalışmalar `00:00` olarak görünüyor |

**Jira Task:** Backend'e saniye desteği için task açıldı (SaveTimeEntry / GetTimeEntries endpoint'leri)

---


*Bu rapor 2025-11-30 tarihinde güncellenmiştir.*
