import dayjs from 'dayjs';

export interface ParsedLicense {
  userCount: number | null;
  month: number | null;
  expireDate: string | null;
}

/**
 * Backend returns UserCount and Month as 0 regardless of the stored value.
 * The canonical values are encoded in the License string, format:
 *   "{used}/{userCount} kullanıcı {DD.MM.YYYY}"
 * Month is approximated as the whole-month diff between today and the parsed ExpireDate
 * (backend does not expose the license update timestamp, so "today" is the best reference).
 */
export const parseLicense = (license?: string | null): ParsedLicense => {
  if (!license) return { userCount: null, month: null, expireDate: null };

  const match = license.match(/(\d+)\s*\/\s*(\d+)[^\d]+(\d{1,2}\.\d{1,2}\.\d{2,4})/);
  if (!match) return { userCount: null, month: null, expireDate: null };

  const userCount = Number(match[2]);
  const expireDate = match[3];

  const expire = dayjs(expireDate, 'DD.MM.YYYY');
  const month = expire.isValid()
    ? expire.diff(dayjs().startOf('day'), 'month')
    : null;

  return { userCount, month, expireDate };
};
