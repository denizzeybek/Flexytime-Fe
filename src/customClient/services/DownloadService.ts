/* Custom service - not auto-generated */
/* istanbul ignore file */
/* tslint:disable */
import { OpenAPI } from '@/client/core/OpenAPI';

import type { ReportQueryDto } from '@/client';

export class DownloadService {
  /**
   * Download section report by downloadKey
   * Redirects browser to download URL (same as v1)
   * @param downloadKey The download key from clock/section API response
   * @returns void
   */
  public static downloadSection(downloadKey: string): void {
    const url = `${OpenAPI.BASE}/Download/DownloadSection/?downloadKey=${downloadKey}`;
    window.location.href = url;
  }

  /**
   * Legacy v1 redirect path; still exported in case any caller depends on it.
   * Prefer downloadReportXlsx for the new BE pipeline.
   */
  public static downloadReport(downloadKey: string): void {
    const url = `${OpenAPI.BASE}/Download/DownloadReport/?downloadKey=${downloadKey}`;
    window.location.href = url;
  }

  /**
   * Hits POST /webapi/report/download with the same body as POST /webapi/report/query
   * and triggers a client-side .xlsx file download. Replaces the v1 downloadKey
   * redirect flow.
   */
  public static async downloadReportXlsx(body: ReportQueryDto): Promise<void> {
    const url = `${OpenAPI.BASE}/webapi/report/download`;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    const token = typeof OpenAPI.TOKEN === 'string' ? OpenAPI.TOKEN : undefined;
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(url, {
      method: 'POST',
      headers,
      credentials: 'include',
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      throw new Error(`Report download failed: ${response.status} ${response.statusText}`);
    }

    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = objectUrl;
    a.download = DownloadService.timestampedFileName('report', 'xlsx');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(objectUrl);
  }

  private static timestampedFileName(prefix: string, ext: string): string {
    const stamp = new Date().toISOString().slice(0, 16).replace(/[:T]/g, '-');
    return `${prefix}-${stamp}.${ext}`;
  }
}
