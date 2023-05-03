// Search button event handler:
const searchForm = document.getElementById("top-search");
searchForm.onsubmit = (ev) => {
  // Clear the page.
  const jokes = document.querySelector('#joke-results');
  while (jokes.firstChild) {
    jokes.removeChild(jokes.firstChild);
  }
  console.log("submitted top-search with", ev);
  ev.preventDefault();
  const formData = new FormData(ev.target);
  const queryText = formData.get("query");
  console.log("queryText", queryText);

  getJokes(queryText);
};

// Get the jokes after clicking the "Go!" button:
// It is set to only produce programming jokes.
const getJokes = (word) => {

  // Case for no search entry
  if (word.length == 0) {
    console.log("attempting to get a random joke");
    let joke = new XMLHttpRequest();
    joke.addEventListener("load", function (ev) {
      const structuredData = JSON.parse(ev.target.responseText);
      const data = structuredData;
      console.log(data);
      makeJokeButtons(data);
    });
    joke.open("GET", `https://v2.jokeapi.dev/joke/Programming?blacklistFlags=nsfw&amount=5`);
    joke.send();

    // Case for searching entry
  } else {
    console.log("attempting to get jokes for", word);
    let joke = new XMLHttpRequest();
    joke.addEventListener("load", function (ev) {
      const structuredData = JSON.parse(ev.target.responseText);
      const data = structuredData;
      console.log(data);
      makeJokeButtons(data);
    });
    joke.open("GET", `https://v2.jokeapi.dev/joke/Programming?contains=${word}&amount=5`);
    joke.send();
  }
};

// Create button elements to display joke results
function makeJokeButtons(data) {
  const jokeResultsUL = document.getElementById("joke-results");

  // "error" is a boolean value - true if no jokes were found, false otherwise 
  const err = data.error;
  console.log("error:", err);

  // If jokes were found, add them to the results
  if (!err) {
    theJokes = data.jokes;
    theJokes.forEach((joke) => {
      // Create button for the joke.
      let jokeButton = document.createElement('button');
      // One-liners
      if (joke.type == "single") {
        const text = joke.joke;
        jokeButton = document.createElement('button');
        jokeButton.innerHTML = text;
        jokeResultsUL.appendChild(jokeButton);
        jokeButton.addEventListener('click', function () {
          // Get the memes from meme API: https://imgflip.com/api
          let meme = new XMLHttpRequest();
          meme.addEventListener("load", function (ev) {
            const structuredData = JSON.parse(ev.target.responseText);
            const data = structuredData;
            console.log(data);
            makeMemes(data, text, '');
          });
          meme.open("GET", 'https://api.imgflip.com/get_memes');
          meme.send();
        })

        // Setup and delivery
      } else {
        const setup = joke.setup;
        const deliv = joke.delivery;
        jokeButton = document.createElement('button');
        jokeButton.innerHTML = setup + "\n" + deliv;
        jokeResultsUL.appendChild(jokeButton);
        jokeButton.addEventListener('click', function () {
          // Get the memes from meme API: https://imgflip.com/api
          let meme = new XMLHttpRequest();
          meme.addEventListener("load", function (ev) {
            const structuredData = JSON.parse(ev.target.responseText);
            const data = structuredData;
            console.log(data);
            makeMemes(data, setup, deliv);
          });
          meme.open("GET", 'https://api.imgflip.com/get_memes');
          meme.send();
        })
      }
    });
    // Otherwise return an error message  
  } else {
    noJoke = document.createElement('li');
    noJoke.innerHTML = 'No jokes were found that match your provided filter.'
    jokeResultsUL.appendChild(noJoke);
  }

  function makeMemes(data, jokeZero, jokeOne) {
    // Make caption requester.
    const captionCaller = new XMLHttpRequest();
    let captionZero = jokeZero;
    let captionOne = jokeOne;
    console.log('caption 0', captionZero);
    console.log('caption 1', captionOne);
    theMemes = data.data;
    console.log(theMemes);
    let memeArray = theMemes.memes
    let meme = memeArray[Math.floor(Math.random() * memeArray.length)];
    let memeID = meme.id;
    captionCaller.addEventListener('load', function (ev) {
      const structuredData = JSON.parse(ev.target.responseText);
      const data = structuredData;
      console.log(data);
      displayMeme(data);
    })

    captionCaller.open('POST', `https://api.imgflip.com/caption_image?template_id=${memeID}&username=abalbuena2000&password=abalbuena2000!$&text0=${captionZero}&text1=${captionOne}`);
    captionCaller.send();
  }

  function displayMeme(data) {
    let memeObject = data.data;
    let memeURL = memeObject.url;
    console.log(memeURL);
    const jokes = document.querySelector('#joke-results');
    while (jokes.firstChild) {
      jokes.removeChild(jokes.firstChild);
    }
    var img = new Image();
    img.src = memeURL;
    jokes.appendChild(img);
  }
}




