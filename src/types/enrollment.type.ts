export interface PutVideoEnrollmentRequest {
    isCompleted: boolean;
}

export interface PostTopUpWithdrawRequest {
    amount: number;
    paymentMethod: string;
}