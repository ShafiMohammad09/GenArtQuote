// Get stored values from local storage
const imagePromptFromLocalStorage = localStorage.getItem("imagePrompt") // Retrieve the stored image prompt
const quotePromptFromLocalStorage = localStorage.getItem("quotePrompt") // Retrieve the stored quote prompt
const imageUrlFromLocalStorage = localStorage.getItem("imageUrl") // Retrieve the stored image URL
const quoteFromLocalStorage = localStorage.getItem("quote") // Retrieve the stored quote

// Get references to HTML elements
const quoteSpan = document.querySelector(".quote-span") // Get the element with class "quote-span"
const quoteWrapper = document.querySelector(".quote-wrapper") // Get the element with class "quote-wrapper"
const nameSpan = document.querySelector(".name-span") // Get the element with class "name-span"
const loader = document.getElementById("loader") // Get the element with id "loader"

// Function to show loading state
function startLoading() {
  nameSpan.style.display = "none" // Hide the name span
  quoteWrapper.style.display = "none" // Hide the quote wrapper
  loader.style.display = "block" // Show the loader
  document.body.backgroundImage = "" // Clear the background image
}

// Function to stop loading and display content
function stopLoading(name, url, quote) {
  nameSpan.style.display = "inline" // Show the name span
  quoteWrapper.style.display = "block" // Show the quote wrapper
  loader.style.display = "none" // Hide the loader
  nameSpan.textContent = `${name} - ${getDate()}` // Set the name span text with the name and current date
  document.body.style.backgroundImage = `url(${url})` // Set the background image
  quoteSpan.textContent = quote // Set the quote span text with the quote
}

// Function to generate text and image
export async function generateTextAndImage(
  name,
  favActivity,
  favPlace,
  temperature
) {
  startLoading() // Start loading
  let url = await getImage(favPlace) // Get the image URL based on the favorite place
  let quote = await getQuote(favActivity, favPlace, temperature) // Get the quote based on the favorite activity, place, and temperature
  stopLoading(name, url, quote) // Stop loading and display the content
  return
}

// Function to get current date in "Month Year" format
function getDate() {
  const date = new Date() // Get the current date
  const monthIndex = date.getMonth() // Get the current month index
  const year = date.getFullYear() // Get the current year

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ] // Array of month names

  const monthName = monthNames[monthIndex] // Get the current month name

  return `${monthName} ${year}` // Return the date in "Month Year" format
}

// Function to fetch a random image based on a query
async function getImage(query) {
  const response = await fetch(
    `https://apis.scrimba.com/unsplash/photos/random/?count=1&query=${query}`
  ) // Fetch a random image from Unsplash based on the query

  if (response.ok) {
    const data = await response.json() // Parse the response JSON
    const imageUrl = data[0].urls.full // Get the full image URL
    return imageUrl // Return the image URL
  } else {
    console.error(`Error: ${response.status}`) // Log an error if the response is not ok
  }
}

// Function to fetch a quote based on favorite activity and place
async function getQuote(favActivity, favPlace, temperature) {
  let quotePrompt = `Create a poetic phrase about ${favActivity} and ${favPlace} in the insightful, witty and satirical style of Oscar Wilde. Omit Oscar Wilde's name.` // Create the quote prompt

  if (quotePrompt === quotePromptFromLocalStorage) {
    return quoteFromLocalStorage // Return the stored quote if the prompt matches
  }

  localStorage.setItem("quotePrompt", quotePrompt) // Store the new quote prompt
  let body = {
    model: "text-davinci-003",
    prompt: quotePrompt,
    temperature: temperature,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  } // Create the request body for the OpenAI API

  let res = await fetch("https://apis.scrimba.com/openai/v1/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  }) // Fetch the quote from the OpenAI API

  let response = await res.json() // Parse the response JSON
  let newQuote = response.choices[0].text // Get the new quote
  localStorage.setItem("quote", newQuote) // Store the new quote
  return newQuote // Return the new quote
}
