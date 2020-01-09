import { elements } from './base'

export const clearInput = () => {
    elements.searchInput.value = ''
}
export const clearResults = () => {
    elements.searchList.textContent = '';
}

export const highlightSelected = (id) => {
    const resultArr = Array.from(document.querySelectorAll('.results__link'))
    resultArr.forEach(el => el.classList.remove('results__link--active'))
    document.querySelector(`a[href='#${id}']`).classList.add('results__link--active')
}

export const clearButtons = () => {
    elements.searchResults.textContent = ''
}

const limitRecipeTitle = (title, limit = 20) => {
    const newTitle = []
    if(title.length > limit) {
        title.split(' ').reduce((acc,cur) => {
            if (acc + cur.length <= limit) {
                newTitle.push(cur)
            }
           return acc + cur.length
        }, 0)
        return `${newTitle.join(' ')} ...`
    }

    return title
}

export const getInput = () => elements.searchInput.value

const renderRecipe = recipe => {
    const markup =
    `<li>
      <a class="results__link" href="#${recipe.recipe_id}">
       <figure class="results__fig">
           <img src="${recipe.image_url}" alt="${recipe.title}">
       </figure>
       <div class="results__data">
           <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
           <p class="results__author">${recipe.publisher}</p>
       </div>
      </a>
    </li>`
   elements.searchList.insertAdjacentHTML('beforeend', markup)
}

const createButton = (page,type) => {
                    return `<button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
                                <svg class="search__icon">
                                    <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'rigth'}"></use>
                                </svg>
                                <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
                            </button>`
}

const renderButtons =  (page, numResults, resPerPage) => {
    const pages = Math.ceil(numResults / resPerPage)

    let button
    if(page === 1 && pages > 1) {
        //button to next page
        button = createButton(page,'next')
    } else if (page === pages) {
        //only button to prev page
        button = createButton(page, 'prev')
    }else if (page < pages) {
        //both pages
        button = `${createButton(page,'next')}
                  ${createButton(page,'prev')}`
    }

    elements.searchResults.insertAdjacentHTML('afterbegin', button)
}

export const renderResults = (recipes, page = 2, resPerPage = 10) => {
    //render results of current page
    const start =  (page - 1) * resPerPage
    const end = page * resPerPage

    recipes.slice(start, end).forEach(renderRecipe)

   //render buttons
    renderButtons(page, recipes.length, resPerPage)
}