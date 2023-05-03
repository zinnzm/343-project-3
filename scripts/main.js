// Search button event handler:
const searchForm = document.getElementById("top-search");
searchForm.onsubmit = (ev) => {
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

  // Case for no serch entry
  if (word.length == 0) {
    console.log("attempting to get a random joke");
    let joke = new XMLHttpRequest();
    joke.addEventListener("load", function (ev) {
      const structuredData = JSON.parse(ev.target.responseText);
      const data = structuredData;
      console.log(data);
      makeJokeList(data);
    });
    joke.open("GET", `https://v2.jokeapi.dev/joke/Programming?amount=5`);
    joke.send();

  // Case for searching entry
  } else {
    console.log("attempting to get jokes for", word);
    let joke = new XMLHttpRequest();
    joke.addEventListener("load", function (ev) {
      const structuredData = JSON.parse(ev.target.responseText);
      const data = structuredData;
      console.log(data);
      makeJokeList(data);
    });
    joke.open("GET", `https://v2.jokeapi.dev/joke/Programming?contains=${word}&amount=5`);
    joke.send();
  }
};

// Create Li elements to display joke results
function makeJokeList(data) {
  const jokeResultsUL = document.getElementById("joke-results");

  // "error" is a boolean value - true if no jokes were found, false otherwise 
  const err = data.error;
  console.log("error:", err);

  // If jokes were found, add them to the results
  if (!err) {
    theJokes = data.jokes;
    theJokes.forEach((joke) => {

      // One-liners
      if (joke.type == "single") {
        const text = joke.joke;
        let jokeLi = document.createElement('li');
        jokeLi.innerHTML = text;
        jokeResultsUL.appendChild(jokeLi);

      // Setup and delivery
      } else {
        const setup = joke.setup;
        const deliv = joke.delivery;
        let jokeLi = document.createElement('li');
        jokeLi.innerHTML = setup + "\n" + deliv;
        jokeResultsUL.appendChild(jokeLi);
      }
    });

  // Otherwise return an error message  
  } else {
    noJoke = document.createElement('li');
    noJoke.innerHTML = 'No jokes were found that match your provided filter.'
    jokeResultsUL.appendChild(noJoke);
  }

  // jokeListItemsArray.forEach((jokeLi) => {
  //   jokeResultsUL.appendChild(jokeLi);
  // });
}


// NOTES FOR IMPLEMENTATION:
//  - parse joke as JSON
//  - check the error feild first, if true, print "No jokes for keyword" or something
//  - otherwise check the type of joke: "single"  - has a "joke" feild
//                                      "twopart" - has a "setup" and "delivery" feild
//  - use conditional statements to get the results
//  - for "single" just put joke under the meme image
//  - for "twopart" put the setup on top and the delivery under the meme image

// DADJOKEZ WEBSITE IMPLEMENTATION:
//  - GET https://icanhazdadjoke.com/ for random joke
//  - GET https://icanhazdadjoke.com/search?term=${word} for search results

const jokeObj2DOMObj = (jokeObj) => {
  //this should be an array where each element has a structure like
  //
  // "word": "no",
  // "frequency": 28,
  // "score": "300",
  // "flags": "bc",
  // "syllables": "1"
  const jokeListItem = document.createElement("li");
  const jokeButton = document.createElement("button");
  jokeButton.classList.add('btn')
  jokeButton.classList.add('btn-info')
  jokeButton.textContent = jokeObj.word;
  jokeButton.onclick = searchForBook;
  jokeListItem.appendChild(jokeButton);
  return jokeListItem;
};

const searchForBook = (ev) => {
  const word = ev.target.textContent;
  console.log("search for", word);
  return fetch(`https://gutendex.com/books/?search=${word}`).then((r) =>
    r.json()
  ).then((bookResultsObj)=> {
    // console.log(bookResultsObj.hasOwnProperty('results'))
    const bookCardsArray = bookResultsObj.results.map(bookObj2DOMObj)
    console.log("bookCardsArray", bookCardsArray);
    const bookResultsElem = document.getElementById("book-results");
    bookCardsArray.forEach(book=>bookResultsElem.appendChild(book))
  })
};

const bookObj2DOMObj = (bookObj) => {
  // {"id":70252,"title":"Threads gathered up : $b A sequel to \"Virgie's Inheritance\"","authors":[{"name":"Sheldon, Georgie, Mrs.","birth_year":1843,"death_year":1926}],"translators":[],"subjects":["American fiction -- 19th century"],"bookshelves":[],"languages":["en"],"copyright":false,"media_type":"Text","formats":{"image/jpeg":"https://www.gutenberg.org/cache/epub/70252/pg70252.cover.medium.jpg","application/rdf+xml":"https://www.gutenberg.org/ebooks/70252.rdf","text/plain":"https://www.gutenberg.org/ebooks/70252.txt.utf-8","application/x-mobipocket-ebook":"https://www.gutenberg.org/ebooks/70252.kf8.images","application/epub+zip":"https://www.gutenberg.org/ebooks/70252.epub3.images","text/html":"https://www.gutenberg.org/ebooks/70252.html.images","application/octet-stream":"https://www.gutenberg.org/files/70252/70252-0.zip","text/plain; charset=us-ascii":"https://www.gutenberg.org/files/70252/70252-0.txt"},"download_count":745},

  // make a dom element
  // add bookObj.title to the element
  // return element

  const bookCardDiv = document.createElement("div");
  bookCardDiv.classList.add("card");

  const bookCardBody = document.createElement("div");
  bookCardBody.classList.add("card-body");

  const titleElem = document.createElement("h5");
  titleElem.textContent = bookObj.title;
  bookCardBody.appendChild(titleElem);
  const cardText = document.createElement("p");
  cardText.textContent =
    "Some quick example text to build on the card title and make up the bulk of the card's content.";
  bookCardBody.appendChild(cardText);
  if (bookObj?.formats?.["image/jpeg"]) {
    const bookCardImg = document.createElement("img");
    bookCardImg.classList.add("card-img-top");
    bookCardImg.src = bookObj?.formats?.["image/jpeg"];
    bookCardBody.appendChild(bookCardImg)
  }
  if (bookObj?.formats?.["text/plain"]) {
    const bookTextLink = document.createElement("a");
    bookTextLink.href = bookObj?.formats?.["text/plain"];
    bookTextLink.classList.add("btn");
    bookTextLink.classList.add("btn-primary");
    bookTextLink.textContent = "Read It!";
    bookCardBody.appendChild(bookTextLink);
  }
  bookCardDiv.appendChild(bookCardBody)
  return bookCardDiv
  
};