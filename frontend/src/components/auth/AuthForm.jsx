// This file seems redundant if we have separate LoginForm and RegisterForm.
// However, I will populate it as a wrapper or a switcher if needed,
// or simply export the others from here if that was the intent.
// For now, I will export the others.

import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import ForgotPasswordForm from "./ForgotPasswordForm";
import ResetPasswordForm from "./ResetPasswordForm";

export { LoginForm, RegisterForm, ForgotPasswordForm, ResetPasswordForm };
