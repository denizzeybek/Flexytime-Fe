# Vue 3 + TypeScript Refactor Plan

Bu rapor, projede Vue 3 ve TypeScript best practice'lere uymayan kodları analiz ederek refactor planı sunmaktadır.

**Rapor Tarihi**: 2025-11-30
**Analiz Edilen**: Views, Components, Stores, Composables, Helpers, Interfaces

---

## Kritiklik Seviyeleri

| Seviye | Acil | Etki |
|--------|------|------|
| **HIGH** | Hemen | Type safety, runtime hatalar |
| **MEDIUM** | Yakın vadede | Kod kalitesi, maintainability |
| **LOW** | Backlog | Code style, consistency |

---

## 1. ANY Type Kullanimi (HIGH)

### 1.1 Interface/Type Tanimlari

| Dosya | Satirlar | Sorun |
|-------|----------|-------|
| `src/interfaces/common/userModel.ts` | 77-79 | `GoogleCalendars: any[]`, `OfficeCalendars: any[]`, `OutlookCalendars: any[]` |
| `src/interfaces/worktimeUsage/section.ts` | 39, 84-86, 133, 150, 164, 169, 180, 212, 252, 255 | Coklu `any[]` ve `any` tipler |
| `src/interfaces/hrSettings/employee.ts` | 6-9, 19-20, 24-25 | `ManagementTitleId`, `EmployeeTitleId`, `Password`, `Email`, `ImageData` any |
| `src/interfaces/classification/application.ts` | 5 | `Errors: any[]` |
| `src/interfaces/classification/webAddress.ts` | 5 | `Errors: any[]` |
| `src/common/interfaces/option.interface.ts` | 3 | `value: any` |

**Aksiyon**: Backend API response tiplerine gore dogru interface tanimlari olusturulmali.

---

### 1.2 Store State ve Actions

| Dosya | Satirlar | Sorun |
|-------|----------|-------|
| `src/stores/auth.ts` | 20, 71 | `setAuth(payload: any)`, `getProfile(result: any)` |
| `src/stores/users.ts` | 7-9, 20 | `user?: any`, `authentication?: any`, `profile?: any` |
| `src/stores/worktimeUsage/worktimeStore.ts` | 111-112, 122-123, 127, 144, 147, 168, 189 | Coklu `any[]` ve `any` return tipler |
| `src/stores/classification/applications.ts` | 17 | `Timeout: any` |
| `src/stores/classification/webAddresses.ts` | 18 | `Timeout: any` |
| `src/stores/timeSheets/timeEntries.ts` | 9-10, 19, 29, 46 | `manualTimeEntries: any[]`, `unclassifiedTimeEntries: any[]` |
| `src/stores/timeSheets/timeManagement.ts` | 37, 58 | `.then((response: any) =>` |
| `src/stores/hrSettings/Employees.ts` | 20 | `tags: any[]` |

**Aksiyon**: Her store icin API response tipi tanimlanmali, state ve action parametreleri tiplendirilmeli.

---

### 1.3 Component Props ve Emits

| Dosya | Satirlar | Sorun |
|-------|----------|-------|
| `src/components/ui/global/Select.vue` | 82, 113 | `value: any` emit ve event handler |
| `src/components/ui/global/MultiSelect.vue` | 70, 93, 125 | `value: any`, `(event: 'selected', value: any)` |
| `src/components/ui/global/Text.vue` | 16 | `innerText?: any` |
| `src/components/ui/global/SelectSwitchButton.vue` | 45, 73 | `value: any` |
| `src/components/ui/global/DateTimePicker.vue` | 68 | `(event: 'change', value: any)` |

**Aksiyon**: Generic tipler kullanilarak (`T extends string | number | object`) daha esnek ve type-safe yapilar olusturulmali.

---

### 1.4 View Event Handlers

| Dosya | Satirlar | Sorun |
|-------|----------|-------|
| `src/views/classification/_components/applications/ApplicationsTable.vue` | 110, 117 | `onPageChange(event: any)`, `onSortOrder(event: any)` |
| `src/views/classification/_components/webAddresses/WebAddressesTable.vue` | 118, 125 | `onPageChange(event: any)`, `onSortOrder(event: any)` |
| `src/views/profile/_components/Basic.vue` | 199 | `onFileSelect(event: any)` |
| `src/views/settings/_views/Advanced.vue` | 88, 112, 117 | `submit(settingType, value: any)`, `handleDateChange/SwitchChange(field: any)` |
| `src/views/worktimeUsage/_composables/useWorktimeNavigation.ts` | 53 | `getNavigationTarget(field: string, rowData: any)` |
| `src/views/worktimeUsage/_components/common/Breadcrumb.vue` | 60 | `handleNavigate(item: any)` |
| `src/views/worktimeUsage/_components/common/BadgeGroup.vue` | 36 | `value: any` |
| `src/views/worktimeUsage/_components/common/SummaryBadge.vue` | 39 | `value: any` |
| `src/views/company/_views/reports/ElasticReports.vue` | 236, 286, 289 | `(ds: any) =>`, `(d: any) =>` |
| `src/views/worktimeUsage/_components/tabs/DistributionTab.vue` | 143 | `transformDataToChartFormat(rawData: any[])` |
| `src/views/timesheets/_modals/UpdateTimeEntriesModal.vue` | 80 | `data?: any` |
| `src/views/hrSettings/_components/employees/_modals/EmployeeModal.vue` | 267, 438, 499 | `validationSchema: any`, `payload: any` |

**Aksiyon**: PrimeVue event tipleri (DataTablePageEvent, DataTableSortEvent vb.) kullanilmali.

---

### 1.5 Error Handling

| Dosya | Satirlar | Sorun |
|-------|----------|-------|
| `src/views/timesheets/_components/timeEntries/EnteredTimes.vue` | 229 | `catch (error: any)` |
| `src/views/timesheets/_components/timeEntries/EnterTime.vue` | 246 | `catch (error: any)` |
| `src/views/promotion/_views/Promotion.vue` | 117 | `catch (error: any)` |
| `src/views/hrSettings/_components/holidays/_modals/HolidayModal.vue` | 159 | `catch (error: any)` |
| `src/views/auth/Login.vue` | 171 | `catch (error: any)` |
| `src/views/auth/Register.vue` | 196 | `catch (error: any)` |
| `src/views/company/_views/WorkingHours.vue` | 169 | `catch (error: any)` |

**Aksiyon**: `catch (error: unknown)` kullanilmali, error type guard ile kontrol edilmeli:
```typescript
catch (error: unknown) {
  if (error instanceof Error) {
    showErrorMessage(error);
  }
}
```

---

## 2. Console.log Temizligi (MEDIUM)

### 2.1 Router ve Core

| Dosya | Satirlar |
|-------|----------|
| `src/router/index.ts` | 88, 147 |
| `src/main.ts` | 22 |
| `src/client/core/CancelablePromise.ts` | 120 |

### 2.2 Composables

| Dosya | Satirlar |
|-------|----------|
| `src/composables/useGoogleLogin.ts` | 81 |
| `src/views/timesheets/_composables/useTimeManagement.ts` | 18, 31 |

### 2.3 Stores

| Dosya | Satirlar |
|-------|----------|
| `src/stores/worktimeUsage/worktimeStore.ts` | 241, 290, 312 |
| `src/stores/promotion/promotion.ts` | 42, 65, 89 |
| `src/stores/settings/download.ts` | 39 |
| `src/stores/settings/companies.ts` | 66, 90, 117 |

### 2.4 Views

| Dosya | Satirlar |
|-------|----------|
| `src/views/timesheets/_modals/UpdateTimeEntriesModal.vue` | 49, 60, 195 |
| `src/views/timesheets/_components/timeEntries/EnteredTimes.vue` | 96, 107, 227 |
| `src/views/timesheets/_components/timeEntries/EnterTime.vue` | 103, 114 |
| `src/views/company/_views/OrganizationChart.vue` | 116 |
| `src/views/timesheets/_views/UnclassifiedTimeEntries.vue` | 118, 220 |
| `src/views/worktimeUsage/index.vue` | 299, 307 |
| `src/views/hrSettings/_components/holidays/HolidaysList.vue` | 47 |
| `src/views/settings/_components/companies/CompaniesList.vue` | 44 |

**Aksiyon**: Tum console.log ifadeleri kaldirilmali veya proper logging sistemi kurulmali.

---

## 3. Eksik Return Type Annotations (MEDIUM)

### 3.1 Helpers

| Dosya | Satirlar | Fonksiyon |
|-------|----------|-----------|
| `src/helpers/utils.ts` | 22 | `debounced(...args)` - nested function |
| `src/helpers/utils.ts` | 56 | `isEmail(email: string)` |
| `src/helpers/utils.ts` | 58 | `isValidRegex(pattern: string)` |
| `src/helpers/utils.ts` | 67 | `copyToClipboard(text: string)` |
| `src/helpers/utils.ts` | 76 | `transformTimeValue(event: InputEvent)` |
| `src/helpers/utils.ts` | 90 | `calculateTimeDifference(start: string, end: string)` |
| `src/helpers/utils.ts` | 107 | `convertTimeToDate(time)` - parametre tipi de eksik |
| `src/helpers/utils.ts` | 123 | `convertDateToTime(date)` - parametre tipi de eksik |
| `src/helpers/utils.ts` | 127 | `convertDateToString(dateString: string, extractTime)` |

### 3.2 Stores

| Dosya | Fonksiyonlar |
|-------|--------------|
| `src/stores/worktimeUsage/worktimeStore.ts` | 111, 122, 144, 168, 189 satirlarindaki getterlar |
| `src/stores/settings/companies.ts` | Tum action'lar |

**Aksiyon**: Tum public fonksiyonlara explicit return type annotation eklenmeli.

---

## 4. Composable Timer Pattern (MEDIUM)

| Dosya | Satir | Sorun |
|-------|-------|-------|
| `src/views/timesheets/_composables/useTimer.ts` | 6 | `let timerInterval: any = null` |

**Aksiyon**: `NodeJS.Timeout | null` veya `ReturnType<typeof setInterval> | null` kullanilmali.

---

## 5. Template Debug Kodu (LOW)

| Dosya | Satirlar | Sorun |
|-------|----------|-------|
| `src/views/timesheets/_modals/UpdateTimeEntriesModal.vue` | 49, 60 | `@addList="console.log('addList')"` |
| `src/views/timesheets/_components/timeEntries/EnteredTimes.vue` | 96, 107 | `@addList="console.log('addList')"` |
| `src/views/timesheets/_components/timeEntries/EnterTime.vue` | 103, 114 | `@addList="console.log('addList')"` |
| `src/views/hrSettings/_components/employees/_modals/EmployeeModal.vue` | 21 | `values.emails {{ values.emails }}` debug text |

**Aksiyon**: Placeholder event handler'lar proper fonksiyonlara donusturulmeli veya kaldirilmali.

---

## 6. Generic Constraint Gevşekligi (MEDIUM)

| Dosya | Satir | Sorun |
|-------|-------|-------|
| `src/helpers/utils.ts` | 16 | `<T extends (...args: any[]) => any>` |

**Aksiyon**: Daha spesifik generic constraint kullanilmali:
```typescript
export function debounce<T extends (...args: unknown[]) => unknown>(fn: T, delay: number)
```

---

## 7. Fonksiyon Parametre Tipleri (HIGH)

| Dosya | Satirlar | Sorun |
|-------|----------|-------|
| `src/views/settings/_views/Permissions.vue` | 93 | `transformPermissions(permissions)` - parametre tipi eksik |
| `src/views/classification/_components/applications/ApplicationsTable.vue` | 122 | `onAlwaysOnChange(event)` - tip eksik |
| `src/views/hrSettings/_components/employees/EmployeesList.vue` | 32 | `handleEdit(employee)` - tip eksik |

**Aksiyon**: Tum fonksiyon parametrelerine explicit tip annotation eklenmeli.

---

## Refactor Onceliklendirme

### Sprint 1 (Kritik - HIGH)
1. `any` tipleri interface/store/component'larda duzeltme
2. Error handling pattern'i standardize etme
3. Fonksiyon parametre tiplerini ekleme

### Sprint 2 (Orta - MEDIUM)
1. Console.log temizligi
2. Return type annotation'lar
3. Generic constraint iyilestirme
4. Timer pattern duzeltme

### Sprint 3 (Dusuk - LOW)
1. Template debug kodlari
2. Placeholder event handler'lar

---

## Onerilen Yeni Tipler

```typescript
// src/types/events.ts
import type { DataTablePageEvent, DataTableSortEvent } from 'primevue/datatable';

export type { DataTablePageEvent, DataTableSortEvent };

export interface FileSelectEvent {
  originalEvent: Event;
  files: File[];
}

// src/types/common.ts
export type TimerId = ReturnType<typeof setInterval> | null;

// src/types/errors.ts
export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

export const isApiError = (error: unknown): error is ApiError => {
  return typeof error === 'object' && error !== null && 'message' in error;
};
```

---

## Istatistikler

| Kategori | Sayi | Kritiklik |
|----------|------|-----------|
| `any` type kullanimi | 75+ | HIGH |
| Console.log ifadeleri | 45+ | MEDIUM |
| Eksik return type | 15+ | MEDIUM |
| Eksik parametre tipi | 10+ | HIGH |
| Template debug kodu | 8 | LOW |
| Generic constraint | 2 | MEDIUM |

---

*Bu plan 2025-11-30 tarihinde olusturulmustur.*
