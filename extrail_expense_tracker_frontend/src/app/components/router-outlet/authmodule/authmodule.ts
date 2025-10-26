import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../../services/auth/auth';
import { UserAuthModel } from '../../../models/user-auth-model';

@Component({
  selector: 'app-authmodule',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './authmodule.html',
  styleUrl: './authmodule.css',
})
export class Authmodule {

  loading = false;
  errorMsg = '';
  readonly year = new Date().getFullYear();
  form: any;

  constructor(private fb: FormBuilder, private auth: Auth, private router: Router) {
    this.form = this.fb.nonNullable.group({
      userName: ['', [Validators.required, Validators.minLength(2)]],
      passwordHash: ['', [Validators.required, Validators.minLength(4)]],
    });
  }

  submit() {
    this.errorMsg = '';
    if (this.form.invalid || this.loading) return;
    this.loading = true;
    const credentials: UserAuthModel = this.form.getRawValue();
    this.auth.validate(credentials).subscribe({
      next: (res) => {
        // Persist auth state
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.errorMsg = err?.error?.message || 'Invalid username or password';
        this.loading = false;
      },
      complete: () => (this.loading = false),
    });
  }
}
