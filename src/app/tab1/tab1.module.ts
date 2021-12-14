import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Tab1Page } from './tab1.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Tab1PageRoutingModule } from './tab1-routing.module';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TranslateModule,
    ExploreContainerComponentModule,
    Tab1PageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [Tab1Page],
  providers:[TranslateService]
})
export class Tab1PageModule {}
