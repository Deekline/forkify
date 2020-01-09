import Search from './models/Search'
import Recipe from './models/Recipe'
import List from './models/List'
import * as listView from './views/listView'
import * as searchView from './views/searchView'
import * as recipeView from './views/recipeView'
import { elements, renderLoader, clearLoader } from './views/base'
import { deleteItem } from './views/listView'

// global state of the app
const state = {}
window.state= state


// SEARCH CONTROLLER
const controlSearch = async () => {
  //1. get query from the view
  const query = searchView.getInput()

  if ( query ) {
    //2. New search object and add it to state
    state.search = new Search( query )
    //3. Prepare UI for result
    searchView.clearInput()
    searchView.clearResults()
    renderLoader( elements.searchList.parentNode )
    try {
      //4. Search for recipes
      await state.search.getResults()
      clearLoader()
      //5. Render results on UI
      searchView.renderResults( state.search.result )

    } catch ( e ) {
      console.log( e )
      clearLoader()
    }
  }
}

elements.searchForm.addEventListener( 'submit', e => {
  e.preventDefault()
  controlSearch()
} )

elements.searchResults.addEventListener( 'click', e => {
  e.preventDefault()
  const btn = e.target.closest( '.btn-inline' )
  if ( btn ) {
    const goToPage = parseInt( btn.dataset.goto, 10 )
    searchView.clearResults()
    searchView.clearButtons()
    searchView.renderResults( state.search.result, goToPage )
  }
} )


//RECIPE CONTROLLER


const controlRecipe = async () => {

  const id = window.location.hash.replace( '#', '' )

  if ( id ) {
    //prepare ui for changes
    recipeView.clearRecipe()
    renderLoader( elements.recipeList )
    if ( state.search ) searchView.highlightSelected( id )
    //create new recipe obj
    state.recipe = new Recipe( id )

    try {
      //get recipe data
      await state.recipe.getRecipe()
      state.recipe.parseIngredients()

      //calc serving and time
      state.recipe.calcTime()
      state.recipe.calcServings()

      //render recipe
      clearLoader()
      recipeView.renderRecipe( state.recipe )
    } catch ( e ) {
      console.log( e )
    }
  }
}

[ 'hashchange' ].forEach( event => window.addEventListener( event, controlRecipe ) )

//LIST CONTROLLER

const controlList = () => {

  if ( !state.list ) state.list = new List()


  state.recipe.ingredients.forEach( ( el, i ) => {
    state.list.addItem( el.count, el.unit, el.ingredient )
    listView.renderItem( state.list.items[ i ] )
  } )

}

elements.shoppingList.addEventListener( 'click', e => {

  const id = e.target.closest( '.shopping__item' ).dataset.itemid
  if ( e.target.matches( '.shopping__delete, .shopping__delete *' ) ) {

    state.list.deleteItem( id )
    listView.deleteItem( id )

  } else if ( e.target.matches( '.shopping__count-value' ) ) {

    const val = parseFloat( e.target.value, 10 )
    state.list.updateCount( id, val )

  }
} )


elements.recipeList.addEventListener( 'click', e => {
  e.preventDefault()

  if ( e.target.matches( '.btn-dec, .btn-dec  *' ) ) {

    if ( state.recipe.servings > 1 ) {

      state.recipe.upgradeServings( 'dec' )
      recipeView.updateServingsIng( state.recipe )

    }

  } else if ( e.target.matches( '.btn-inc, .btn-inc *' ) ) {

    state.recipe.upgradeServings( 'inc' )
    recipeView.updateServingsIng( state.recipe )

  } else if ( e.target.matches( '.recipe__btn--add, .recipe__btn--add *' ) ) {

    controlList()

  }
} )



