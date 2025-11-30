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

#### 3.1.1 Store-Based Loading Pattern ✅ TAMAMLANDI

**Durum:** Loading state store'larda tutulmaya başlandı. Component-based `useAsyncLoading` composable'ı kaldırıldı.

**Seçilen Yaklaşım:** Store-based loading (loading state store'da, component'te değil)

**Silinen Dosya:** `src/composables/useAsyncLoading.ts` (store-based pattern tercih edildi)

**Güncellenen Store'lar** (`loading` state + `isLoading` getter eklendi):
- ✅ `src/stores/classification/applications.ts`
- ✅ `src/stores/classification/webAddresses.ts`
- ✅ `src/stores/hrSettings/Employees.ts`
- ✅ `src/stores/hrSettings/holidays.ts`
- ✅ `src/stores/hrSettings/annuals.ts`
- ✅ `src/stores/settings/companies.ts` (zaten vardı)

**Güncellenen List Component'ler** (store.isLoading kullanıyor):
- ✅ `src/views/classification/_components/applications/ApplicationsList.vue`
- ✅ `src/views/classification/_components/webAddresses/WebAddressesList.vue`
- ✅ `src/views/hrSettings/_components/employees/EmployeesList.vue`
- ✅ `src/views/hrSettings/_components/holidays/HolidaysList.vue`
- ✅ `src/views/hrSettings/_components/annuals/AnnualsList.vue`
- ✅ `src/views/settings/_components/companies/CompaniesList.vue`

**OpenAPI Type Migration** (Employee components):
- ✅ `EmployeesList.vue` - `TheMemberViewModel` kullanıyor
- ✅ `EmployeesTable.vue` - `TheMemberViewModel` kullanıyor
- ✅ `EmployeeModal.vue` - `TheMemberViewModel` kullanıyor

**Pattern:**
```typescript
// Store'da:
state: { loading: false },
getters: { isLoading: (state) => state.loading },
actions: {
  async filter() {
    try {
      this.loading = true;
      // ... fetch logic
    } finally {
      this.loading = false;
    }
  }
}

// Component'te:
const isLoading = computed(() => store.isLoading);
```

**Kazanımlar:**
- Tek kaynak (single source of truth) - loading state store'da
- Component'ler daha basit
- try-finally pattern ile loading state her zaman reset ediliyor
- Tutarlı naming convention (`loading` state, `isLoading` getter)

---

#### 3.1.2 `useOperationFeedback` Composable ✅ TAMAMLANDI

**Durum:** Composable oluşturuldu ve 4 dosyaya entegre edildi.

**Oluşturulan Dosya:** `src/composables/useOperationFeedback.ts`

**Güncellenen Dosyalar:**
- ✅ `HolidayModal.vue`
- ✅ `AnnualModal.vue`
- ✅ `EmployeesTable.vue`
- ✅ `CompanyModal.vue`

**Özellikler:**
- `executeWithFeedback()`: Otomatik success/error toast mesajları
- `executeAsync()`: Sadece loading state yönetimi (manuel feedback)
- `showLoading` option ile loading state kontrolü
- Generic tip desteği

**Kazanımlar:**
- Tutarlı success/error handling pattern'i
- try-catch boilerplate kodu kaldırıldı
- ~50 satır tekrarlayan kod azaltıldı

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

#### 3.2.1 Modal Form Utilities ✅ TAMAMLANDI

**Durum:** Minimal `useModalForm` composable oluşturuldu.

**Oluşturulan Dosya:** `src/composables/useModalFormInit.ts`

**Güncellenen Modal'lar:**
- ✅ `HolidayModal.vue` - `useModalForm` + OpenAPI tipi (`HolidayViewModel`)
- ✅ `AnnualModal.vue` - `useModalForm` + OpenAPI tipi (`AnnualViewModel`)
- ✅ `CompanyModal.vue` - `useModalForm` + OpenAPI tipi (`CompanyViewModel`)

**OpenAPI Type Migration:**
- ✅ `HolidaysList.vue`, `HolidaysTable.vue` - `HolidayViewModel`
- ✅ `AnnualsList.vue`, `AnnualsTable.vue` - `AnnualViewModel`
- ✅ `CompaniesList.vue`, `CompaniesTable.vue` - `CompanyViewModel`

**Pattern:**
```typescript
// Minimal composable - sadece isEditing ve handleClose
const { isEditing, handleClose } = useModalForm(open, props.data, resetForm);

// Form init logic modal'da kalıyor (daha okunabilir)
const getInitialFormData = computed(() => { ... });

onMounted(() => {
  resetForm({ values: getInitialFormData.value });
});
```

**Kazanımlar:**
- Basit ve okunabilir API
- `isEditing` ve `handleClose` tekrarı kaldırıldı
- Form init logic görünür ve anlaşılır kaldı
- OpenAPI tipleri ile tip güvenliği

---

#### 3.2.2 Store Loading State Standardizasyonu ✅ TAMAMLANDI

**Durum:** Tüm store'lara standart loading state eklendi.

| Store | Loading State | Naming |
|-------|---------------|--------|
| companies.ts | ✅ Var | `loading` state, `isLoading` getter |
| reports.ts | ✅ Var | `isLoading`, `isFiltersLoading` |
| applications.ts | ✅ Eklendi | `loading` state, `isLoading` getter |
| webAddresses.ts | ✅ Eklendi | `loading` state, `isLoading` getter |
| holidays.ts | ✅ Eklendi | `loading` state, `isLoading` getter |
| annuals.ts | ✅ Eklendi | `loading` state, `isLoading` getter |
| Employees.ts | ✅ Eklendi | `loading` state, `isLoading` getter |

**Standart Pattern:** `loading` state + `isLoading` getter + try-finally in actions

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
| 1 | Store-based loading pattern | Yüksek | Düşük | 11 | ✅ TAMAMLANDI |
| 2 | `createSkeletonData` utility | Orta | Düşük | 6 | ✅ TAMAMLANDI |
| 3 | `useOperationFeedback` composable | Yüksek | Düşük | 4 | ✅ TAMAMLANDI |
| 4 | Store loading state standardizasyonu | Orta | Orta | 7 | ✅ TAMAMLANDI |
| 5 | Modal form utilities (`useModalForm`) | Orta | Düşük | 9 | ✅ TAMAMLANDI |
| 6 | Data refresh standardizasyonu | Yüksek | Orta | 12+ | ⏳ Bekliyor |
| 7 | Search UI standardizasyonu | Düşük | Orta | 5+ | ⏳ Bekliyor |
| 8 | Pagination standardizasyonu | Orta | Yüksek | 6+ | ⏳ Bekliyor |

**Tamamlanan:** 5/8 task
**Tahmini Kod Azaltımı:** ~600-800 satır tekrarlayan/tutarsız kod

---

*Bu rapor 2025-11-30 tarihinde güncellenmiştir.*
