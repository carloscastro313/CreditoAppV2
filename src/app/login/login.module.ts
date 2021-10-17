import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/environments/environment';
import {
  AngularFirestore,
  AngularFirestoreModule,
} from '@angular/fire/compat/firestore';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { IonicStorageModule } from '@ionic/storage-angular';
import { Network } from '@ionic-native/network/ngx';
import { LoginComponent } from './components/login/login.component';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './components/register/register.component';
import {
  AngularFireStorage,
  AngularFireStorageModule,
} from '@angular/fire/compat/storage';
import { Storage } from '@ionic/storage-angular';

@NgModule({
  declarations: [LoginComponent, RegisterComponent],
  imports: [
    CommonModule,
    IonicModule,
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    ReactiveFormsModule,
  ],
  exports: [LoginComponent, RegisterComponent],
  providers: [
    AngularFirestore,
    Network,
    ReactiveFormsModule,
    AngularFireStorage,
    Storage,
  ],
})
export class LoginModule {}
