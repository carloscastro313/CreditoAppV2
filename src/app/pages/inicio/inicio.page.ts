import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { QrService } from '../../services/qr.service';
import { ResetComponent } from '../../components/reset/reset.component';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {
  constructor(public qr: QrService, private modalController: ModalController) {}

  async ngOnInit() {
    await this.qr.init();
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: ResetComponent,
      swipeToClose: true,
      presentingElement: await this.modalController.getTop(), // Get the top-most ion-modal
    });
    return await modal.present();
  }
}
