import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResetComponent } from './reset/reset.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [ResetComponent],
  imports: [CommonModule, IonicModule],
  exports: [ResetComponent],
})
export class ComponentsModule {}
