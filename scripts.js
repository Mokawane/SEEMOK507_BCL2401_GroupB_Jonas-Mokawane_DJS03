import { books, authors, genres, BOOKS_PER_PAGE } from './data.js'

// Current page number
let page = 1;
// Array to hold books matching search criteria
let matches = books


// Selectors object to hold references to various DOM elements
const selectors = {
    listItems: document.querySelector('[data-list-items]'),
    searchGenres: document.querySelector('[data-search-genres]'),
    searchAuthors: document.querySelector('[data-search-authors]'),
    settingsTheme: document.querySelector('[data-settings-theme]'),
    listButton: document.querySelector('[data-list-button]'),
    searchForm: document.querySelector('[data-search-form]'),
    listMessage: document.querySelector('[data-list-message]'),
    searchOverlay: document.querySelector('[data-search-overlay]'),
    listActive: document.querySelector('[data-list-active]'),
    listBlur: document.querySelector('[data-list-blur]'),
    listImage: document.querySelector('[data-list-image]'),
    listTitle: document.querySelector('[data-list-title]'),
    listSubtitle: document.querySelector('[data-list-subtitle]'),
    listDescription: document.querySelector('[data-list-description]'),
    settingsForm: document.querySelector('[data-settings-form]'),
    settingsOverlay: document.querySelector('[data-settings-overlay]'),
    searchCancel: document.querySelector('[data-search-cancel]'),
    settingsCancel: document.querySelector('[data-settings-cancel]'),
    headerSearch: document.querySelector('[data-header-search]'),
    searchTitle: document.querySelector('[data-search-title]'),
    headerSettings: document.querySelector('[data-header-settings]'),
    listClose: document.querySelector('[data-list-close]'),
};

// Function to populate book previews on the initial page load
function populateBookPreviews() {
    const starting = document.createDocumentFragment()

    for (const { author, id, image, title } of matches.slice(0, BOOKS_PER_PAGE)) {
        const element = document.createElement('button')
        element.classList = 'preview'
        element.setAttribute('data-preview', id)

        element.innerHTML = `
            <img
                class="preview__image"
                src="${image}"
            />
        
            <div class="preview__info">
                <h3 class="preview__title">${title}</h3>
                <div class="preview__author">${authors[author]}</div>
            </div>
        `

        starting.appendChild(element)
    }

    selectors.listItems.appendChild(starting)
}

// Function to initialize search filters for genres and authors
function initSearchFilters() {
    const genreHtml = document.createDocumentFragment()
    const firstGenreElement = document.createElement('option')
    firstGenreElement.value = 'any'
    firstGenreElement.innerText = 'All Genres'
    genreHtml.appendChild(firstGenreElement)

    for (const [id, name] of Object.entries(genres)) {
        const element = document.createElement('option')
        element.value = id
        element.innerText = name
        genreHtml.appendChild(element)
    }


    selectors.searchGenres.appendChild(genreHtml)

    const authorsHtml = document.createDocumentFragment()
    const firstAuthorElement = document.createElement('option')
    firstAuthorElement.value = 'any'
    firstAuthorElement.innerText = 'All Authors'
    authorsHtml.appendChild(firstAuthorElement)

    for (const [id, name] of Object.entries(authors)) {
        const element = document.createElement('option')
        element.value = id
        element.innerText = name
        authorsHtml.appendChild(element)
    }

    selectors.searchAuthors.appendChild(authorsHtml)
}

// Function to set the theme based on user preference or system settings
function mediaMatch() {
    let theme = localStorage.getItem('theme');

    // Check system theme preference if no theme is saved in local storage
    if(!theme && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        theme = 'night';
    }

    // Apply the selected theme
    if (theme === 'night') {
        selectors.settingsTheme.value = 'night';
        document.documentElement.style.setProperty('--color-dark', '255, 255, 255');
        document.documentElement.style.setProperty('--color-light', '10, 10, 20');
    } else {
        selectors.settingsTheme.value = 'day'
        document.documentElement.style.setProperty('--color-dark', '10, 10, 20');
        document.documentElement.style.setProperty('--color-light', '255, 255, 255');
    }
}

// Function to save the selected theme to local storage
function saveToLocalStorage(theme) {
    localStorage.setItem('theme', theme);
}

// Function to update the "Show more" button content and state
function contentUpdates () {
    selectors.listButton.innerText = `Show more (${books.length - BOOKS_PER_PAGE})`
selectors.listButton.disabled = (matches.length - (page * BOOKS_PER_PAGE)) === 0

selectors.listButton.innerHTML = `
    <span>Show more</span>
    <span class="list__remaining"> (${(matches.length - (page * BOOKS_PER_PAGE)) > 0 ? (matches.length - (page * BOOKS_PER_PAGE)) : 0})</span>
`
}

// Function to set up event listeners for various interactions
function eventListeners() {
    // Search form submission event listener
    selectors.searchForm.addEventListener('submit', (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const filters = Object.fromEntries(formData)
    const result = []

    // Filter books based on search criteria
    for (const book of books) {
        let genreMatch = filters.genre === 'any'

        for (const singleGenre of book.genres) {
            if (genreMatch) break;
            if (singleGenre === filters.genre) { genreMatch = true }
        }

        if (
            (filters.title.trim() === '' || book.title.toLowerCase().includes(filters.title.toLowerCase())) && 
            (filters.author === 'any' || book.author === filters.author) && 
            genreMatch
        ) {
            result.push(book)
        }
    }

    page = 1;
    matches = result

    // Show or hide "No results" message
    if (result.length < 1) {
        selectors.listMessage.classList.add('list__message_show')
    } else {
        selectors.listMessage.classList.remove('list__message_show')
    }

    // Update book previews with search results
    selectors.listItems.innerHTML = ''
    const newItems = document.createDocumentFragment()

    for (const { author, id, image, title } of result.slice(0, BOOKS_PER_PAGE)) {
        const element = document.createElement('button')
        element.classList = 'preview'
        element.setAttribute('data-preview', id)
    
        element.innerHTML = `
            <img
                class="preview__image"
                src="${image}"
            />
            
            <div class="preview__info">
                <h3 class="preview__title">${title}</h3>
                <div class="preview__author">${authors[author]}</div>
            </div>
        `

        newItems.appendChild(element)
    }

    selectors.listItems.appendChild(newItems)
    selectors.listButton.disabled = (matches.length - (page * BOOKS_PER_PAGE)) < 1

    window.scrollTo({top: 0, behavior: 'smooth'});
    selectors.searchOverlay.open = false
    })

    // Event listener for clicking on a book preview
    selectors.listItems.addEventListener('click', (event) => {
        const pathArray = Array.from(event.path || event.composedPath())
        let active = null
    
        // Find the clicked book preview
        for (const node of pathArray) {
            if (active) break
    
            if (node?.dataset?.preview) {
                let result = null
        
                for (const singleBook of books) {
                    if (result) break;
                    if (singleBook.id === node?.dataset?.preview) result = singleBook
                } 
            
                active = result
            }
        }
        
        // Display the selected book details
        if (active) {
            selectors.listActive.open = true
            selectors.listBlur.src = active.image
            selectors.listImage.src = active.image
            selectors.listTitle.innerText = active.title
            selectors.listSubtitle.innerText = `${authors[active.author]} (${new Date(active.published).getFullYear()})`
            selectors.listDescription.innerText = active.description
        }
    })

    // Settings form submission event listener
    selectors.settingsForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const {theme} = Object.fromEntries(formData);
    
        // Apply the selected theme
        if(theme === 'night') {
            document.documentElement.style.setProperty('--color-dark', '255, 255, 255');
            document.documentElement.style.setProperty('--color-light', '10, 10, 20');
        } else {
            document.documentElement.style.setProperty('--color-dark', '10, 10, 20');
            document.documentElement.style.setProperty('--color-light', '255, 255, 255');
        }
    
        saveToLocalStorage(theme);
        selectors.settingsOverlay.open = false;
    });

    // "Show more" button click event listener
    selectors.listButton.addEventListener('click', () => {
        const fragment = document.createDocumentFragment()
    
        // Add more book previews to the list
        for (const { author, id, image, title } of matches.slice(page * BOOKS_PER_PAGE, (page + 1) * BOOKS_PER_PAGE)) {
            const element = document.createElement('button')
            element.classList = 'preview'
            element.setAttribute('data-preview', id)
        
            element.innerHTML = `
                <img
                    class="preview__image"
                    src="${image}"
                />
                
                <div class="preview__info">
                    <h3 class="preview__title">${title}</h3>
                    <div class="preview__author">${authors[author]}</div>
                </div>
            `
    
            fragment.appendChild(element)
        }
    
        selectors.listItems.appendChild(fragment)
        page += 1
        remainingPages()
    });

    // Event listener to close the search overlay
    selectors.searchCancel.addEventListener('click', () => {
        selectors.searchOverlay.open = false
    })
    
    // Event listener to close the settings overlay
    selectors.settingsCancel.addEventListener('click', () => {
        selectors.settingsOverlay.open = false
    })
    
    // Event listener to open the search overlay
    selectors.headerSearch.addEventListener('click', () => {
        selectors.searchOverlay.open = true 
        selectors.searchTitle.focus()
    })
    
    // Event listener to open the settings overlay
    selectors.headerSettings.addEventListener('click', () => {
        selectors.settingsOverlay.open = true 
    })
    
    // Event listener to close the active book details overlay
    selectors.listClose.addEventListener('click', () => {
        selectors.listActive.open = false
    })
    
}

// Function to update the "Show more" button with the remaining pages
function remainingPages() {
    selectors.listButton.innerHTML = `
    <span>Show more</span>
    <span class="list__remaining"> (${(matches.length - (page * BOOKS_PER_PAGE)) > 0 ? (matches.length - (page * BOOKS_PER_PAGE)) : 0})</span>
`
}


// Event listener for DOM content loaded to initialize the app
document.addEventListener('DOMContentLoaded', function() {
    init();
})

// Function to initialize the app
function init() {
    populateBookPreviews();
    initSearchFilters();
    mediaMatch();
    saveToLocalStorage(localStorage.getItem('theme'));
    contentUpdates();
    eventListeners();
}

