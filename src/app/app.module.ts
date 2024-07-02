import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { BooklistComponent } from './booklist/booklist.component';
import { BookformComponent } from './bookform/bookform.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { BookhomeComponent } from './bookhome/bookhome.component';
import { RemunerationPipe } from './pipes/remuneration.pipe';
import { ExampleoptionsComponent } from './exampleoptions/exampleoptions.component';
import { NotificationareaComponent } from './notificationarea/notificationarea.component';

@NgModule({
  declarations: [
    AppComponent,
    BooklistComponent,
    BookformComponent,
    BookhomeComponent,
    RemunerationPipe,
    ExampleoptionsComponent,
    NotificationareaComponent,
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
