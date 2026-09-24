const wsUri = "ws://localhost:3000/";
let websocket = null;
let pingInterval;
let counter = 0;

const logElement = document.querySelector("#socket");
function log(text) {
  logElement.innerText = `${text}\n`;
  logElement.scrollTop = logElement.scrollHeight;
}

/////////////This section ensures basic "show me what I entered" functionaliy///////
const plaintext = document.querySelector("#plaintext"); ///BTW!!! Do I need to escape the input to make it safe? It will meet my database
const encodedText = document.querySelector("#encoded");
function encode() {
  parse(plaintext.value);
  encodedText.textContent = parsedText;
  encodedText.scrollTop = encodedText.scrollHeight;
}
plaintext.addEventListener("input", encode);

//plaintext.addEventListener("input", () => parse(plaintext.value));
//////////////////////////////////////////////////////////////

/*
a -> should return ['a'] GOT IT
aa -> should return ['aa'] GOT IT
aabraca -> should return ['aa', 'a', 'a'] GOT IT
aabracadabra -> should return ['a', 'abracadabra'] 
*/

let dictionary = ["a", "aa", "aaa", "ab", "abc", "abracadabra"]; //should probably add a restriction that i minus j can't be more than the longest word in the dictionary

let parsedText = [];
let longestWord = 11; //this shall be passed from dictionary
function parse(string) {
  //let string;
  parsedText = [];

  let j = 0; //tracks where we start parsing each round

  while (j < string.length) {
    //
    let i = j; //this is the incremental to change the length of the slice
    while (i < string.length && i - j < longestWord) {
      let fragment = string.slice(j, i + 1);
      //parsedText.push(fragment);

      if (dictionary.includes(fragment)) {
        parsedText[j] = fragment;
      } else {
        console.log("no match for you");
      }

      i++;
    }
    if (parsedText[j]) {
      j++; //j = parsedText[j].length + j;
    } else {
      j++;
    }
  }

  parsedText = parsedText.filter(Boolean); //gets rid of all the empty slots
  return parsedText;
}

//lexing "abracadabra" as above only gives 255 no match messages
//reduced to 204 in the second iteration

function initializeWebSocketListeners(ws) {
  ws.addEventListener("open", () => {
    log("CONNECTED");

    pingInterval = setInterval(() => {
      log(`SENT: ping: ${counter}`);
      //encode();
      ws.send("ping");
    }, 1000);
  });

  ws.addEventListener("close", () => {
    log("DISCONNECTED");
    clearInterval(pingInterval);
  });

  ws.addEventListener("message", (e) => {
    log(`RECEIVED: ${e.data}: ${counter}`);
    counter++;
  });

  ws.addEventListener("error", (e) => {
    log(`ERROR`);
  });
}

window.addEventListener("pageshow", (event) => {
  if (event.persisted) {
    websocket = new WebSocket(wsUri);
    initializeWebSocketListeners(websocket);
  }
});

log("OPENING");
websocket = new WebSocket(wsUri);
initializeWebSocketListeners(websocket);

// Close the websocket when the user leaves.
window.addEventListener("pagehide", () => {
  if (websocket) {
    log("CLOSING");
    websocket.close();
    websocket = null;
    window.clearInterval(pingInterval);
  }
});
