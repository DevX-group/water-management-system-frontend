export interface SystemDetailsRequest {
    companyName: string,
    officeAddress: string,
    officeContactNumber: string,
    officeEmail: string,
    defaultCurrency: string,
    bankName: string,
    branch: string,
    accountNumber: string,
    accountName: string,
}

export interface SystemDetailsResponse {
    companyName: string,
    officeAddress: string,
    officeContactNumber: string,
    officeEmail: string,
    defaultCurrency: string,
    bankName: string,
    branch: string,
    accountNumber: string,
    accountName: string,
}
