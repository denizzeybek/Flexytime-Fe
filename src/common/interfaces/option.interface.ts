export interface IOption<T = any> {
  name: string;
  value: any;
  icon?: string;

  data?: T;
  label: string;
  secondaryLabel?: string;
  helperLabel?: string;
  lightLabel?: string;
  subLabel?: string;
  disabled?: boolean;
}
