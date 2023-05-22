const words=["developer\"", "musician\"", "artist\"", "author\"", "designer\"", "hacker\"", "coder\"", "entrepreneur\""]
async function removeWord(elementId) {
    var element = document.getElementById(elementId);
    var text = element.innerText;
    var length = text.length;
    var remainingCharacters = length - 4;
    var index = 0;
  
    var timer = setInterval(function() {
      if (index >= remainingCharacters) {
        clearInterval(timer);
        addWord(elementId);
        return;
      }
  
      text = text.slice(0, -1);
      element.innerText = text;
      index++;
    }, 500);
    
}

async function addWord(elementId) {
    var element = document.getElementById(elementId);
    var randomWord = words[Math.floor(Math.random() * words.length)];
    var length = randomWord.length;
    var index = 0;
  
    var timer = setInterval(function() {
      if (index >= length) {
        clearInterval(timer);
        removeWord(elementId);
        return;
      }
  
      element.innerText += randomWord.charAt(index);
      index++;
    }, 500);

}

removeWord("blinking");