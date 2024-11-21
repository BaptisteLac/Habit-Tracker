import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {TrainingPageRoutingModule} from './training-routing.module';

import {TrainingPage} from './training.page';
import {TrainingFormComponent} from "../../components/training-form/training-form.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TrainingPageRoutingModule,
    TrainingPage,
    TrainingFormComponent
  ],
})
export class TrainingPageModule {
}
