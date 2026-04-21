export interface PostAuthRegister {
    username: string;
    password:  string;
    email:     string;
    name:      string;
}

export interface PostAuthLogin {
    username: string;
    password:  string;
}

export interface PostAuthForgotPassword {
    email: string;
}

export interface PostAuthForgotPasswordVerify {
    token: string;
    password:  string;
}
