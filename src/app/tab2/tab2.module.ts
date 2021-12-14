import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Tab2Page } from './tab2.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { Tab2PageRoutingModule } from './tab2-routing.module';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    TranslateModule,
    ExploreContainerComponentModule,
    Tab2PageRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [Tab2Page],
  providers:[TranslateService]
})
export class Tab2PageModule { }
