/* DOM elements */
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");

// Set initial message
chatWindow.textContent = "👋 Hello! How can I help you today?";

// keep track of conversation history
let messages = [
  {
    role: "system",
    content: `You are a beauty advisor with L'Oreal. You will answer questions about L\'Oreal products and provide beauty advice. Always be friendly and helpful!`,
  },
];

// const workerURL = 'replace with cloudflare worker URL';

/* Handle form submit */
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  // loading message
  chatWindow.textContent = "Curating your personalized beauty advice...";

  // add message to user conversaton history
  messages.push({ role: "user", content: userInput.value });

  // When using Cloudflare, you'll need to POST a `messages` array in the body,
  // and handle the response using: data.choices[0].message.content
  try {
    const response = await fetch(workerURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages }),
    });
  }

  // Show message
  chatWindow.innerHTML = "Connect to the OpenAI API for a response!";
});
