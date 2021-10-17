import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  formLogin: FormGroup;
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    public nav: NavController
  ) {
    this.formLogin = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      clave: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit() {}

  async onSubmit() {
    this.loading = true;
    const { clave, correo } = this.formLogin.value;
    await this.auth.login(correo, clave);
    this.loading = false;
  }

  async fastAccess(correo, clave) {
    this.formLogin.setValue({ correo, clave });
  }
}
