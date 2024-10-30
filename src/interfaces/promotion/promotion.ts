export interface IPromotion {
  ID: string;
  CompanyId: string;
  UserId: string | null;
  EmailAddress: string;
  SendDate: string;
  SignUpDate: string | null;
  UsageDate: string | null;
  InstallDate: string | null;
  IsDownloaded: boolean;
}

export interface IPromote {
    PromotionLink: string;
}

export interface IPromotionResponse {
  Earned: IPromotion[];
  Promoted: IPromotion[];
}

