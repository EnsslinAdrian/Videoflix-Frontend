import { isFormGroup, ValidatorFn } from "@angular/forms";

export const passwordMatch: ValidatorFn = function (control) {
  if (!isFormGroup(control)) {
    return null;
  }
  const pwd1 = control.get("password")?.value;
  const pwd2 = control.get("confirmPassword")?.value;
  
  if (pwd1 !== pwd2) {
    return { passwordMismatch: true };
  }
  return null;
}
