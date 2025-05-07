export interface Login {
  email: string;
  password: string;
}

export interface Register {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ResetPassword {
  email: string;
}


