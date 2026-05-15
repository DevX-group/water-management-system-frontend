export const formatPaymentMethod = (method: string | null | undefined) => {
    if (!method) return "-";

    return method
        .toLowerCase()
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
};