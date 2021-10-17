import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { SystemService } from '../utility/services/system.service';
import { perfil, User } from '../login/models/user.model';
import { Storage } from '@ionic/storage-angular';
import { history, credit, valueQR } from '../models/credit.model';

@Injectable({
  providedIn: 'root',
})
export class QrService {
  private uid: string;
  private perfil: perfil;
  cash: number = 0;
  history: history[] = [];
  constructor(
    private system: SystemService,
    private db: AngularFirestore,
    private storage: Storage
  ) {}

  async init() {
    const loading = await this.system.presentLoading('Conectando...');
    loading.present();
    this.uid = await this.storage.get('uid');
    this.perfil = await (
      await this.db.collection<User>('user').doc(this.uid).ref.get()
    ).data().perfil;

    console.log(this.uid, this.perfil);

    if (!(await this.db.collection('credito').doc(this.uid).ref.get()).exists)
      await this.setUserCredit(0, []);

    this.db
      .collection<credit>('credito')
      .doc(this.uid)
      .valueChanges()
      .subscribe((cash) => {
        this.cash = cash?.total || 0;
        this.history =
          cash?.history.map((data) => {
            return { ...data, date: data.date.toDate() as any };
          }) || [];

        this.history = this.history.sort((a, b) => {
          if (a.date < b.date) return 1;
          if (a.date > b.date) return -1;
          return 0;
        });
      });

    loading.dismiss();
  }

  async addCash() {
    try {
      const { text, cancelled } = await this.system.getQr();
      if (cancelled) return;

      const ref = await this.db.collection<valueQR>('creditoQR').ref.get();
      const qrsArr = ref.docs.map((data) => data.data());

      const charge = qrsArr.find((data) => data.code === text.trim()) || null;

      if (!charge) throw 'QR - invalido';
      const isLog = charge.user.find((data) => data.user === this.uid) || null;

      if (isLog) {
        if (this.perfil !== 'admin' && isLog.count == 1) {
          return this.system.presentToast('QR ya utilizado');
        } else if (isLog.count == 2) {
          return this.system.presentToast('QR ya utilizado');
        }
      }

      const historyArr = this.history;
      historyArr.push({ value: charge.value, date: new Date() });
      await this.setUserCredit(this.cash + charge.value, historyArr);

      this.setCreditQR(charge, false);
    } catch (error) {
      this.system.presentToastError(error);
    }
  }

  async resetCredit() {
    await this.setUserCredit(0, this.history);
    const ref = await this.db.collection<valueQR>('creditoQR').ref.get();
    const qrsArr = ref.docs.map((data) => data.data());

    for (let i = 0; i < qrsArr.length; i++) {
      await this.setCreditQR(qrsArr[i], true);
    }
  }

  async setUserCredit(total: number, history: history[]) {
    return await this.db
      .collection<credit>('credito')
      .doc(this.uid)
      .set({ total, history });
  }

  async setCreditQR(qr: valueQR, reset: boolean) {
    const index = qr.user.findIndex((data) => data.user === this.uid);
    console.log(index);
    if (index === -1) {
      qr.user.push({ user: this.uid, count: 1 });
    } else {
      if (qr.user[index].count === 0) {
        qr.user[index].count = 1;
      } else if (qr.user[index].count === 1) {
        qr.user[index].count = 2;
      }
    }

    if (reset) qr.user[index].count = 0;

    await this.db.collection('creditoQR').doc(qr.code).set(qr);
  }
}
