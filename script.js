const elements = [
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",

  "span",

  "p",
  "i",
  "b",
  "em",
  "strong",
  "sup",
  "sub"
]

const selfClosingElements = [
  "br",
  "hr"
]

const elementButtons = [];

let source = "<h1>Hello!</h1>";
const stack = [];

function elementButtonClicked(details) {
  let inlineTextInput = document.querySelector(".inline-text-input");
  if (inlineTextInput.innerHTML) {
    source += inlineTextInput.innerHTML;
    inlineTextInput.innerHTML = "";
  }

  if (details.type == "start") {
    source += `<${details.name}>`
    stack.push(details.name);
  } else if (details.type == "end") {
    let realName = stack.pop();
    source += `</${realName}>`
  } else if (details.type == "selfClosing") {
    source += `<${details.name} />`
  } else {
    console.warn("whuhhh")
  }
  
  update();
}

function addElementButton(name, type) {
  const elementSelector = document.querySelector(".element-selector");
  
  const button = document.createElement("button");
  button.setAttribute("type", type);
  button.classList.add("element-button");

  button.innerText = (
    type == "selfClosing" ? `<${name} />` 
    : type == "end" ? `</${name}>` :
    `<${name}>`
  )
  elementSelector.appendChild(button)

  const details = {
    name: name,
    type: type,
    el: button
  }
  elementButtons.push(details);

  button.addEventListener("click", function() {
    elementButtonClicked(details);
  })
}

function escapeHtml(html){
  var text = document.createTextNode(html);
  var p = document.createElement('p');
  p.appendChild(text);
  return p.innerHTML;
}

function update() {
  const lastInStack = stack.length ? stack[stack.length - 1] : undefined
  for (let data of elementButtons) {
    let enabled;

    if (data.type == "end") {
      if (lastInStack == data.name) {
        enabled = true;
      } else {
        enabled = false;
      }
    } else if (data.type == "start") {
      enabled = true;
    } else if (data.type == "selfClosing") {
      enabled = true;
    }
    
    if (enabled) {
      data.el.removeAttribute("disabled");
    } else {
      data.el.setAttribute("disabled", "")
    }
  }
  
  let sourceEl = document.querySelector(".source-code");
  sourceEl.innerText = source;

  let inlineTextInput = document.querySelector(".inline-text-input");
  let finalSource = source + inlineTextInput.innerHTML;

  let outputEl = document.querySelector(".output");
  outputEl.srcdoc = finalSource;
}

document.addEventListener("DOMContentLoaded", function() {
  for (let elName of elements) {
    addElementButton(elName, "start");
  }
  for (let elName of elements) {
    addElementButton(elName, "end");
  }
  for (let elName of selfClosingElements) {
    addElementButton(elName, "selfClosing");
  }


  let inlineTextInput = document.querySelector(".inline-text-input");
  inlineTextInput.addEventListener("input", () => update())

  update();
});