# JavaScript Code Documentation

## Functions

### populateBookPreviews()
- Populates the book previews on the page with initial data.
- Retrieves data from the `matches` array and creates HTML elements for each book preview.
- Appends the created elements to the DOM.

### initSearchFilters()
- Initializes search filters for genres and authors.
- Creates HTML option elements for genres and authors and appends them to the corresponding select elements in the DOM.

### mediaMatch()
- Checks the user's preferred color scheme and sets the theme accordingly.
- If no theme is set in local storage and the user prefers dark mode, it sets the theme to 'night'.
- Updates CSS variables for colors based on the selected theme.

### saveToLocalStorage(theme)
- Saves the selected theme to local storage.

### contentUpdates()
- Updates content on the page, particularly the "Show more" button text and its disabled state based on the number of remaining books to display.

### eventListeners()
- Adds event listeners to various elements in the DOM.
- Handles form submission for search filters, displaying book details on click, theme settings form submission, "Show more" button click, and closing search/settings overlays.

## Event Listeners

1. **Search Form Submission:**
   - Filters books based on the submitted form data (title, author, genre).
   - Updates the displayed books according to the search results.

2. **Book Preview Click:**
   - Displays detailed information about a book when its preview is clicked.

3. **Settings Form Submission:**
   - Updates the theme based on the selected option and saves it to local storage.

4. **"Show more" Button Click:**
   - Displays the next page of book previews when clicked.

5. **Cancel Buttons (Search and Settings Overlays):**
   - Closes the corresponding overlay when clicked.

6. **Header Icons (Search and Settings):**
   - Opens the search or settings overlay when clicked.

7. **Book Details Close Button:**
   - Closes the book details overlay when clicked.

## Initialization

- **DOMContentLoaded Event:**
   - Calls the `init()` function when the DOM content is loaded.

- **init() Function:**
   - Initiates the application by populating book previews, initializing search filters, handling media match for theme, saving theme settings to local storage, updating content, and setting event listeners.
