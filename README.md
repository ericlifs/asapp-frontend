# City Selector

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

## UI Issues

### Preferred cities selection

The first issue I found on the provided UI/UX was that there was no place where you (as an user) can see which are the cities that you had already defined as preferred unless you accidentaly come accross one preferred suggestion while scrolling through the available options.

As a solution for this, I added a left bar on desktop (and a top bar on mobile that you can toggle) where you can see and also toggle all the preferred cities that you had already added.

### Position of checkbox

The second issue I found was the position of the checkbox within each city suggestion. As we are used to read from left to right, the expected position of the checkbox would be on the very right of each suggestion.

Also, as a solution for non left to right languages such as the arabic one, I have added a `rtl` prop to the `CitySuggestion` component which when set to true, will place the button to the left and the city information on the right hand side.
