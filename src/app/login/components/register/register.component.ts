import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegisterService } from '../../services/register.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private register: RegisterService,
    public nav: NavController
  ) {
    this.registerForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      clave: ['', [Validators.required, Validators.minLength(6)]],
      perfil: ['', [Validators.required]],
      sexo: ['', [Validators.required]],
    });
  }

  ngOnInit() {}

  async onSubmit() {
    const { correo, clave, perfil, sexo } = this.registerForm.value;
    this.loading = true;
    await this.register.createUser(correo, clave, perfil, sexo);
    this.loading = false;
  }
}
