import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Network } from '@ionic-native/network/ngx';
import { NavController } from '@ionic/angular';
import { SystemService } from 'src/app/utility/services/system.service';
import { perfil, sexo, User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  constructor(
    private register: AngularFireAuth,
    private db: AngularFirestore,
    private nav: NavController,
    private system: SystemService,
    private network: Network
  ) {}

  async createUser(correo: string, clave: string, perfil: perfil, sexo: sexo) {
    try {
      var loading = await this.system.presentLoading('Creado usuario');
      loading.present();
      if (this.network.type === this.network.Connection.NONE)
        throw new Error('No internet');
      const { user } = await this.register.createUserWithEmailAndPassword(
        correo,
        clave
      );

      const newUser: User = {
        correo,
        clave,
        perfil,
        sexo,
        uid: user.uid,
      };

      await this.db.collection('/user').doc(user.uid).set(newUser);
      this.system.presentToast('La cuenta se a creado con éxito!');
    } catch (error) {
      const err = error === 'No internet' ? 'No internet' : error['code'];
      this.system.presentToast(err);
    } finally {
      loading.dismiss();
    }
  }
}
