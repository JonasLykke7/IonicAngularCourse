import { Injectable } from '@angular/core';

import { IRecipe } from '../../models/recipe.model';

@Injectable({
  providedIn: 'root'
})
export class RecipesService {
  private _recipes: IRecipe[] = [
    {
      id: 'r1',
      title: 'Schnitzel',
      imageURL: 'https://madensverden.dk/wp-content/uploads/2019/04/schnitzel.jpg',
      ingredients: ['French Fries', 'Pork Meat', 'Salad']
    },
    {
      id: 'r2',
      title: 'Spaghetti',
      imageURL: 'https://www.knorr.com/content/dam/unilever/global/recipe_image/162/16270/162708-default.jpg/_jcr_content/renditions/cq5dam.web.800.600.jpeg',
      ingredients: ['Spaghetti', 'Meat', 'Tomatoes']
    }
  ];

  constructor() { }

  public getAllRecipes() {
    return [...this._recipes];
  }

  public getRecipe(id: string) {
    return {
      ...this._recipes.find(x => {
        return x.id === id;
      })
    };
  }

  public deleteRecipe(id: string) {
    this._recipes = this._recipes.filter(x => {
      return x.id !== id;
    });
  }
}
