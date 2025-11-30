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

## Phase 3: Refactor - Büyük Component'ler (400+ satır)

Aşağıdaki dosyalar 400 satırı aşıyor ve subcomponent'lere bölünmeli:

| Dosya | Satır | Durum | Öneri |
|-------|-------|-------|-------|
| ~~`src/views/company/_views/OrganizationChartV2.vue`~~ | ~~601~~ → 190 | ✅ Tamamlandı | Toolbar, EmptyState, DeleteDialog, useOrganizationChart composable |
| ~~`src/views/hrSettings/_components/employees/_modals/EmployeeModal.vue`~~ | ~~517~~ → 266 | ✅ Tamamlandı | BasicInfo, Role, TagsSalary, Password sections + validation composable |
| ~~`src/views/timesheets/_views/UnclassifiedTimeEntries.vue`~~ | ~~500~~ → 293 | ✅ Tamamlandı | LoadingState, EmptyState, SelectionBar, ClockCard + domain helpers composable |
| `src/views/timesheets/_components/timeEntries/EnterTime.vue` | 470 | ⏳ Bekliyor | Timer controls, manual inputs, project/tag selectors ayrı component'lere |

### OrganizationChartV2 Refactor Detayları (Tamamlandı)

Oluşturulan dosyalar:
- `OrganizationChartToolbar.vue` - Search, undo/redo, expand/collapse butonları
- `OrganizationChartEmptyState.vue` - Boş durum gösterimi
- `OrganizationChartDeleteDialog.vue` - Silme onay dialog'u
- `useOrganizationChart.ts` - Tüm chart logic'i (CRUD, drag-drop, undo-redo)

### EmployeeModal Refactor Detayları (Tamamlandı)

Oluşturulan dosyalar:
- `_components/EmployeeBasicInfoSection.vue` - MemberName, Email, Enabled alanları
- `_components/EmployeeRoleSection.vue` - Title, Team, OperatingUser alanları
- `_components/EmployeeTagsSalarySection.vue` - Tags, Salary alanları
- `_components/EmployeePasswordSection.vue` - Password alanı
- `_composables/useEmployeeModalValidation.ts` - Tab bazlı validation şemaları

### UnclassifiedTimeEntries Refactor Detayları (Tamamlandı)

Oluşturulan dosyalar:
- `_components/unclassified/UnclassifiedLoadingState.vue` - Skeleton loading gösterimi
- `_components/unclassified/UnclassifiedEmptyState.vue` - Boş durum gösterimi
- `_components/unclassified/UnclassifiedSelectionBar.vue` - Seçili item'lar özet bar'ı
- `_components/unclassified/UnclassifiedClockCard.vue` - Clock card item'ı (details ile)
- `_composables/useUnclassifiedDomainHelpers.ts` - Domain renk/ikon helper fonksiyonları

**Refactor Kuralları:**
- Her component max 300 satır hedeflenmeli
- Tekrar kullanılabilir parçalar `_components` klasörüne
- Props/emits ile iletişim
- Composable'lar ile shared logic

---

*Bu rapor 2025-11-30 tarihinde güncellenmiştir.*
