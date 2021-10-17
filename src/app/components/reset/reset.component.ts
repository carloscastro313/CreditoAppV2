import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { QrService } from '../../services/qr.service';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss'],
})
export class ResetComponent implements OnInit {
  loading: boolean = false;

  constructor(
    private modalController: ModalController,
    private qr: QrService
  ) {}

  ngOnInit() {}

  cancelar() {
    this.modalController.dismiss();
  }

  async reset() {
    this.loading = true;
    await this.qr.resetCredit();
    this.loading = false;
    this.cancelar();
  }
}
