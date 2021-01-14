import { Component, Input, OnInit } from '@angular/core';

import { IRecipe } from '../../../models/recipe.model'

@Component({
  selector: 'app-recipie-item',
  templateUrl: './recipie-item.component.html',
  styleUrls: ['./recipie-item.component.scss'],
})
export class RecipieItemComponent implements OnInit {
  @Input() public recipieItem: IRecipe;

  constructor() { }

  ngOnInit() { }

}
