import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatSelectModule} from "@angular/material/select";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {MatTooltipModule} from "@angular/material/tooltip";

const MATERIAL_MODULES = [
  MatPaginatorModule,
  MatSelectModule,
  MatToolbarModule,
  MatCardModule,
  MatButtonModule,
  MatInputModule,
  MatIconModule,
  MatTooltipModule,
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MATERIAL_MODULES,
  ],
  exports: [
    MATERIAL_MODULES,
  ]
})
export class AngularMaterialModule { }
