import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Network } from '@ionic-native/network/ngx';
import { NavController, ToastController } from '@ionic/angular';
import { SystemService } from '../../utility/services/system.service';
import { Storage } from '@ionic/storage-angular';

/*

  Comandos utilizados:

  ng add @angular/fire
  npm install @ionic/storage-angular
  ionic cordova plugin add cordova-plugin-network-information
  npm install @ionic-native/network

  NOTA: Se recomienda crear una PAGE llamado main y que esta
  contenga las rutas hacia el resto de la aplicacion. El metodo
  init se puede llamar en el app.component.ts para verificar la
  sesion del usuario.
*/

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userIsLog: boolean = false;

  constructor(
    private auth: AngularFireAuth,
    private storage: Storage,
    private network: Network,
    private nav: NavController,
    private system: SystemService
  ) {}

  async init() {
    if (await this.storage.get('uid')) {
      this.userIsLog = true;
      this.nav.navigateForward('/main');
    }
  }

  async login(correo: string, clave: string) {
    try {
      var loading = await this.system.presentLoading('Iniciando sesión');
      loading.present();
      if (this.network.type === this.network.Connection.NONE)
        throw new Error('No internet');
      const { user } = await this.auth.signInWithEmailAndPassword(
        correo,
        clave
      );
      await this.storage.set('uid', user.uid);

      await this.system.playAudio('login');
      this.userIsLog = true;
      this.nav.navigateForward('/main');
    } catch (error) {
      const err = error === 'No internet' ? 'No internet' : error['code'];
      this.system.presentToastError(err);
    } finally {
      loading.dismiss();
    }
  }

  async logout() {
    await this.auth.signOut();
    await this.storage.remove('uid');
    this.userIsLog = false;
    this.nav.navigateRoot('/');
  }

  async isLog() {
    return this.userIsLog;
  }
}
