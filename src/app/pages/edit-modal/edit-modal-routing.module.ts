import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditModalPage } from './edit-modal.page';

const routes: Routes = [
  {
    path: '',
    component: EditModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditModalPageRoutingModule {}
