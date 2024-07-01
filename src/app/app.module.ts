import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { BooklistComponent } from './booklist/booklist.component';
import { BookformComponent } from './bookform/bookform.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { BookhomeComponent } from './bookhome/bookhome.component';
import { RemunerationPipe } from './pipes/remuneration.pipe';

@NgModule({
  declarations: [
    AppComponent,
    BooklistComponent,
    BookformComponent,
    BookhomeComponent,
    RemunerationPipe,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
