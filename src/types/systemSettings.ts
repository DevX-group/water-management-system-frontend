export interface SystemDetailsRequest {
    companyName: string;
    officeAddress: string;
    officeContactNumber: string;
    officeEmail: string;
    defaultCurrency: string;
    bankName: string;
    branch: string;
    accountNumber: string;
    accountName: string;
    overdueThreshold?: number;
    disconnectionGracePeriodDays?: number;
    reconnectionFee?: number;
}

export interface SystemDetailsResponse {
    companyName: string;
    officeAddress: string;
    officeContactNumber: string;
    officeEmail: string;
    defaultCurrency: string;
    bankName: string;
    branch: string;
    accountNumber: string;
    accountName: string;
    overdueThreshold?: number;
    disconnectionGracePeriodDays?: number;
    reconnectionFee?: number;
}
