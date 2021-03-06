export const elements = {
  searchForm: document.querySelector( ".search" ),
  searchInput: document.querySelector( ".search__field" ),
  searchList: document.querySelector( ".results__list" ),
  searchResults: document.querySelector('.results__pages'),
  recipeList: document.querySelector('.recipe'),
  shoppingList: document.querySelector('.shopping__list')
}
export const elementString = {
  loader: 'loader'
}

export const renderLoader = parent => {
  const loader =
    `<div class="${elementString.loader}">
        <svg>
            <use href="img/icons.svg#icon-cw"></use>
        </svg>
    </div>`
  parent.insertAdjacentHTML("afterbegin", loader)
}

export const clearLoader = () => {
  const loader = document.querySelector(`.${elementString.loader}`)
  if(loader) {
    loader.parentElement.removeChild(loader)
  }
}