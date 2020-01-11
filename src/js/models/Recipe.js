import axios from 'axios'

export default class Recipe {
  constructor( id ) {
    this.id = id
  }

  async getRecipe() {
    try {
      const res = await axios( `https://forkify-api.herokuapp.com/api/get?rId=${ this.id }` )
      this.title = res.data.recipe.title
      this.author = res.data.recipe.publisher
      this.image = res.data.recipe.image_url
      this.url = res.data.recipe.source_url
      this.ingredients = res.data.recipe.ingredients

    } catch ( e ) {
      console.log( e )
      alert( 'something goes wrong' )
    }
  }

  calcTime() {
    const numIng = this.ingredients.length
    const periods = Math.ceil( numIng / 3 )
    this.time = periods * 15
  }

  calcServings() {
    this.servings = 4
  }

  parseIngredients() {
    const unitsLong = [ 'tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds' ]
    const unitShort = [ 'tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound' ]
    const units = [ ...unitShort, 'kg', 'g' ]


    const newIngredients = this.ingredients.map( el => {
      //uniform units
      let ingredient = el.toLowerCase()
      unitsLong.forEach( ( unit, i ) => {
        ingredient = ingredient.replace( unit, units[ i ] )
      } )
      //remove parentheses
      ingredient = ingredient.replace( / *\([^]*\) */g, ' ' )
      // parse ingredients into count unit
      const arrIng = ingredient.split( ' ' )
      const unitIndex = arrIng.findIndex( el2 => units.includes( el2 ) )

      let objIng
      if ( unitIndex > -1 ) {
        //there is unit
        const arrCount = arrIng.slice( 0, unitIndex )

        let count
        if ( arrCount.length === 1 ) {
          count = eval( arrIng[ 0 ].replace( '-', '+' ) )
        } else {
          count = eval( arrIng.slice( 0, unitIndex )
                              .join( '+' ) )
        }

        objIng = {
          count,
          unit: arrIng[ unitIndex ],
          ingredient: arrIng.slice( unitIndex + 1 )
                            .join( ' ' )
        }
      } else if ( unitIndex === -1 && !parseInt( arrIng[ 0 ], 10 ) ) {
        //there no unit
        objIng = {
          count: 1,
          unit: '',
          ingredient
        }
      } else if ( parseInt( arrIng[ 0 ], 10 ) ) {
        //no unit but 1st is number
        objIng = {
          count: parseInt( arrIng[ 0 ], 10 ),
          unit: '',
          ingredient: arrIng.slice( 1 )
                            .join( ' ' )
        }
      }

      return objIng
    } )

    this.ingredients = newIngredients
  }

  upgradeServings( type ) {
    const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1

    this.ingredients.forEach( ing => ing.count *= (newServings / this.servings))

    this.servings = newServings
  }
}
