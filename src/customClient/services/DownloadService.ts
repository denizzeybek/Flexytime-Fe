/* Custom service - not auto-generated */
/* istanbul ignore file */
/* tslint:disable */
import { OpenAPI } from '@/client/core/OpenAPI';

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
   * Download report by downloadKey
   * Redirects browser to download URL
   * @param downloadKey The download key from report API response
   * @returns void
   */
  public static downloadReport(downloadKey: string): void {
    const url = `${OpenAPI.BASE}/Download/DownloadReport/?downloadKey=${downloadKey}`;
    window.location.href = url;
  }
}
