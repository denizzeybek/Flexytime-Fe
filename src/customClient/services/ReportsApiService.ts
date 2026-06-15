/* Custom service - not auto-generated */
/* istanbul ignore file */
/* tslint:disable */
import { OpenAPI } from '@/client/core/OpenAPI';

import type { ReportQueryDto } from '@/client';

export interface ReportPresetMeta {
  id: string;
  name: string;
  dataSource: 'time-entry' | 'worktime';
  requiresWorktime: boolean;
}

export interface ReportRunRequest {
  presetId?: string;
  templateId?: string;
  override?: ReportQueryDto;
}

export interface ReportResultMeta {
  DataSource: 'time-entry' | 'worktime' | 'combined';
  Range: { Start: string; End: string };
  Tz: string;
}

export interface ReportRunResult {
  Summary: { Total: string; Billable: string; Unbillable: string };
  Graphs: {
    Main: { labels: string[]; datasets: Array<{ label: string; data: number[] }>; Unit: string };
    Group: Array<{ Label: string; Value: number }>;
  };
  Grouping: Array<{ Group1: string; Group2: string; Total: string }>;
  DownloadKey: string;
  Meta?: ReportResultMeta;
}

const baseHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const token = typeof OpenAPI.TOKEN === 'string' ? OpenAPI.TOKEN : undefined;
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

export class ReportsApiService {
  public static async listPresets(): Promise<ReportPresetMeta[]> {
    const url = `${OpenAPI.BASE}/webapi/report/presets`;
    const response = await fetch(url, {
      method: 'GET',
      headers: baseHeaders(),
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error(`listPresets failed: ${response.status} ${response.statusText}`);
    }
    return (await response.json()) as ReportPresetMeta[];
  }

  public static async run(req: ReportRunRequest): Promise<ReportRunResult> {
    const url = `${OpenAPI.BASE}/webapi/report/run`;
    const response = await fetch(url, {
      method: 'POST',
      headers: baseHeaders(),
      credentials: 'include',
      body: JSON.stringify(req),
    });
    if (!response.ok) {
      const text = await response.text().catch(() => '');
      throw new Error(`run failed: ${response.status} ${response.statusText} ${text}`);
    }
    return (await response.json()) as ReportRunResult;
  }

  /**
   * Hit POST /webapi/report/download/preset to fetch the preset-specific
   * rich workbook (Overview + per-employee + per-project + per-day sheets,
   * etc.) and trigger a client-side download. Optional `override` is forwarded
   * as the body's `override` field — the BE uses it to override the preset's
   * defaultInterval (e.g., `{ Interval: '01.05.2026-30' }` for a 30-day window
   * starting 01.05.2026).
   */
  public static async downloadPreset(
    presetId: string,
    override?: ReportQueryDto,
  ): Promise<void> {
    const url = `${OpenAPI.BASE}/webapi/report/download/preset`;
    const body: { presetId: string; override?: ReportQueryDto } = { presetId };
    if (override) body.override = override;
    const response = await fetch(url, {
      method: 'POST',
      headers: baseHeaders(),
      credentials: 'include',
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      const text = await response.text().catch(() => '');
      throw new Error(
        `preset download failed: ${response.status} ${response.statusText} ${text}`,
      );
    }

    const disposition = response.headers.get('Content-Disposition') ?? '';
    const fileName =
      /filename="?([^"]+)"?/i.exec(disposition)?.[1] ??
      `${presetId}-${new Date().toISOString().slice(0, 10)}.xlsx`;

    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = objectUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(objectUrl);
  }
}
