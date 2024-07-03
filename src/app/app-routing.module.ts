import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookhomeComponent } from './bookhome/bookhome.component';

const routes: Routes = [
  {
    path: '',
    component: BookhomeComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
