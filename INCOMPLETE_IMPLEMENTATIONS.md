# Incomplete Implementations Report

Bu rapor, projede eksik kalan implementasyonları sayfa ve modül bazında listelemektedir.

**Rapor Tarihi**: 2025-11-30

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

## Phase 3: DRY İhlalleri ve Standardizasyon Planı

### 3.1 Yüksek Öncelikli - Composable'lar (Hızlı Kazanımlar)

#### 3.1.1 `useAsyncLoading` Composable ✅ TAMAMLANDI

**Durum:** Composable oluşturuldu ve 6 dosyaya entegre edildi.

**Oluşturulan Dosya:** `src/composables/useAsyncLoading.ts`

**Güncellenen Dosyalar:**
- ✅ `src/views/classification/_components/applications/ApplicationsList.vue`
- ✅ `src/views/classification/_components/webAddresses/WebAddressesList.vue`
- ✅ `src/views/hrSettings/_components/employees/EmployeesList.vue`
- ✅ `src/views/hrSettings/_components/holidays/HolidaysList.vue`
- ✅ `src/views/hrSettings/_components/annuals/AnnualsList.vue`
- ✅ `src/views/settings/_components/companies/CompaniesList.vue`

**Kazanımlar:**
- try-finally pattern ile loading state her zaman reset ediliyor
- Tekrarlayan kod kaldırıldı (~30 satır)
- Tutarlı error handling pattern'i

---

#### 3.1.2 `useOperationFeedback` Composable ✅ Oluşturulacak

**Sorun:** Success/error mesajları tutarsız, bazı işlemler sessiz kalıyor

| Dosya | Success Msg | Error Handling |
|-------|-------------|----------------|
| EmployeesTable.vue | ✅ | ✅ |
| ApplicationsTable.vue | ❌ | ✅ |
| HolidaysList.vue | ❌ | ❌ (console.error) |
| CompaniesList.vue | ❌ | ❌ (console.error) |

**Çözüm:**
```typescript
// src/composables/useOperationFeedback.ts
export const useOperationFeedback = () => {
  const { showSuccessMessage, showErrorMessage } = useFToast();

  const executeWithFeedback = async (
    operation: () => Promise<void>,
    successMsg: string
  ) => {
    try {
      await operation();
      showSuccessMessage(successMsg);
    } catch (error) {
      showErrorMessage(error as Error);
      throw error;
    }
  };
  return { executeWithFeedback };
};
```

---

#### 3.1.3 `createSkeletonData` Utility ✅ TAMAMLANDI

**Durum:** Utility oluşturuldu ve 6 table component'e entegre edildi.

**Oluşturulan Dosya:** `src/helpers/skeleton.ts`

**Güncellenen Dosyalar:**
- ✅ `ApplicationsTable.vue`
- ✅ `WebAddressesTable.vue`
- ✅ `EmployeesTable.vue`
- ✅ `HolidaysTable.vue`
- ✅ `AnnualsTable.vue`
- ✅ `CompaniesTable.vue`

**Kazanımlar:**
- Tekrarlayan `Array.from({ length: N }, ...)` pattern'i kaldırıldı
- Generic tip desteği ile tip güvenliği sağlandı
- ~40 satır tekrarlayan kod kaldırıldı

---

### 3.2 Orta Öncelikli - Modal ve Store Standardizasyonu

#### 3.2.1 Modal Form Initialization Pattern

**Sorun:** 3+ modal'da aynı `getInitialFormData` + `resetForm` pattern'i

**Etkilenen Dosyalar:**
- `HolidayModal.vue` (104-126)
- `AnnualModal.vue` (128-147)
- `CompanyModal.vue` (123-154)

**Çözüm:** `useModalFormInit` composable

---

#### 3.2.2 Store Loading State Standardizasyonu

**Sorun:** Store'larda loading state tutarsızlığı

| Store | Loading State | Naming |
|-------|---------------|--------|
| companies.ts | ✅ Var | `loading` |
| reports.ts | ✅ Var | `isLoading`, `isFiltersLoading` |
| applications.ts | ❌ Yok | - |
| holidays.ts | ❌ Yok | - |
| annuals.ts | ❌ Yok | - |

**Çözüm:** Tüm store'lara standart loading state ekle, `isLoading` naming convention'ı kullan

---

#### 3.2.3 Data Refresh Strategy Standardizasyonu

**Sorun:** Veri yenileme 3 farklı pattern ile yapılıyor

| Pattern | Örnek | Sorun |
|---------|-------|-------|
| Store auto-refresh | EmployeesStore.updateEnabled() | ✅ İyi |
| Emit-based refresh | HolidayModal → emit('fetchHolidays') | ⚠️ Kırılgan |
| Parent-triggered | HolidaysList → @fetchHolidays | ⚠️ Tight coupling |

**Çözüm:** Store'da auto-refresh pattern'i standart yap, emit-based pattern'i kaldır

---

### 3.3 Düşük Öncelikli - UI/UX Standardizasyonu

#### 3.3.1 Search UI Pattern'leri

**Sorun:** 2 farklı search UI pattern'i var

| Pattern | Dosyalar |
|---------|----------|
| Teleport to #table-search | ApplicationsList, WebAddressesList |
| DataTable header search | EmployeesTable, HolidaysTable, CompaniesTable |

**Önerilen:** DataTable header search pattern'i standart yap

---

#### 3.3.2 Pagination Pattern'leri

**Sorun:** Server-side vs client-side pagination tutarsızlığı

| Pattern | Dosyalar |
|---------|----------|
| Server-side (payload ile) | ApplicationsList, WebAddressesList |
| Client-side (no params) | EmployeesList, HolidaysList, CompaniesList |

**Önerilen:** Dataset boyutuna göre seçim yap, `useListPagination` composable oluştur

---

### 3.4 Öncelik Sıralaması

| # | Task | Etki | Efor | Dosya Sayısı | Durum |
|---|------|------|------|--------------|-------|
| 1 | `useAsyncLoading` composable | Yüksek | Düşük | 6 | ✅ TAMAMLANDI |
| 2 | `createSkeletonData` utility | Orta | Düşük | 6 | ✅ TAMAMLANDI |
| 3 | `useOperationFeedback` composable | Yüksek | Düşük | 8+ | ⏳ Bekliyor |
| 4 | Store loading state standardizasyonu | Orta | Orta | 8 | ⏳ Bekliyor |
| 5 | Modal form init composable | Orta | Orta | 3+ | ⏳ Bekliyor |
| 6 | Data refresh standardizasyonu | Yüksek | Orta | 12+ | ⏳ Bekliyor |
| 7 | Search UI standardizasyonu | Düşük | Orta | 5+ | ⏳ Bekliyor |
| 8 | Pagination standardizasyonu | Orta | Yüksek | 6+ | ⏳ Bekliyor |

**Tahmini Kod Azaltımı:** ~600-800 satır tekrarlayan/tutarsız kod

---

*Bu rapor 2025-11-30 tarihinde güncellenmiştir.*
