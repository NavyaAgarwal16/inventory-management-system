import {Component, ChangeDetectorRef,NgZone} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {

  isLogin = true;

  signupName = '';
  signupEmail = '';
  signupPassword = '';

  loginEmail = '';
  loginPassword = '';

  signupEmailError = '';
  signupPasswordError = '';

  loginEmailError = '';
  loginPasswordError = '';
  loginBackendError = '';

  showOtpPopup = false;

  showForgotPasswordPopup = false;

  showForgotOtpBox = false;

forgotEmail = '';

forgotOtp = '';

forgotPassword = '';
  

otp = '';

canResendOtp = false;

showLoginPassword = false;

isRegisterLoading = false;

showSignupPassword = false;

resendTimer = 120;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  validateEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  }

  validatePassword(password: string): boolean {
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    return passwordPattern.test(password);
  }

  register() {
    console.log("Register clicked");
    this.isRegisterLoading = true;
    this.signupEmailError = '';
    this.signupPasswordError = '';

    let isValid = true;

    if (!this.validateEmail(this.signupEmail)) {
      this.signupEmailError = 'Invalid Email Format';
      isValid = false;
    }

    if (!this.validatePassword(this.signupPassword)) {
      this.signupPasswordError = 'Password must contain uppercase, lowercase, number and special character';
      isValid = false;
    }

    if (!isValid) {

  this.isRegisterLoading = false;

  return;

}

    const data = {
      name: this.signupName,
      email: this.signupEmail,
      password: this.signupPassword
    };

this.authService.sendOtp({
  email: this.signupEmail
}).subscribe({

  next: (res: any) => {

    this.isRegisterLoading = false;

    this.showOtpPopup = true;
    
    this.startResendTimer();

  },

  error: (err: any) => {

    this.isRegisterLoading = false;
    console.log(err);
    alert(JSON.stringify(err));

  }

});
  }
   submit() {

  this.loginEmailError = '';
  this.loginPasswordError = '';
  this.loginBackendError = '';

  let isValid = true;

  // FRONTEND EMAIL VALIDATION
  if (!this.validateEmail(this.loginEmail)) {

    this.loginEmailError = 'Please enter correct email format';
    isValid = false;

  }

  // FRONTEND PASSWORD VALIDATION
  if (this.loginPassword.length < 8) {

    this.loginPasswordError =
      'Password must be at least 8 characters';

    isValid = false;

  }

  // STOP API CALL IF FRONTEND VALIDATION FAILS
  if (!isValid) return;

  const data = {

    email: this.loginEmail,
    password: this.loginPassword

  };

  this.authService.login(data).subscribe({

    next: (res: any) => {

      if (res.token) {

        localStorage.setItem('token', res.token);

        localStorage.setItem(
          'message',
          `Welcome ${res.user.name}`
        );

        this.router.navigate(['/dashboard']);

      }

    },

   error: (err: any) => {

  this.loginEmailError = '';
  this.loginPasswordError = '';
  this.loginBackendError = '';

  // EMAIL NOT FOUND
  if (err.error.message === 'User Not Found') {

    this.loginEmailError =
      'Email not found';

  }

  // WRONG PASSWORD
  else if (err.error.message === 'Wrong Password') {

    this.loginPasswordError =
      'Incorrect password';

  }

  // OTHER ERROR
  else {

    this.loginBackendError =
      'Login failed';

  }

  // FORCE UI UPDATE
  this.cdr.detectChanges();

}
    }
  )
}

verifyOtp() {

  const data = {

    name: this.signupName,
    email: this.signupEmail,
    password: this.signupPassword,
    otp: this.otp

  };

  this.authService.verifyOtp(data)
    .subscribe({

      next: (res: any) => {

        alert('Registration Successful');

        this.showOtpPopup = false;

      },

      error: (err: any) => {

        alert('Invalid OTP');

      }

    });
  }

  startResendTimer() {

  this.canResendOtp = false;

  this.resendTimer = 120;

  const interval = setInterval(() => {

    this.ngZone.run(() => {

      this.resendTimer--;

      if (this.resendTimer <= 0) {

        this.canResendOtp = true;

        clearInterval(interval);

      }

    });

  }, 1000);

}

resendOtp() {

  if (!this.canResendOtp) return;

  this.authService.sendOtp({

    email: this.signupEmail

  }).subscribe({

    next: (res: any) => {

      alert('OTP Resent');

      this.startResendTimer();

    },

    error: (err: any) => {

      alert('Failed to resend OTP');

    }

  });

}

sendForgotOtp() {

  this.authService.sendOtp({

    email: this.forgotEmail

  }).subscribe({

    next: (res: any) => {

      this.showForgotOtpBox = true;

      alert('OTP Sent');

    },

    error: (err: any) => {

      alert('Failed to send OTP');

    }

  });

}
}