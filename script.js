/* DOM elements */
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");

// Clear initial message from HTML
chatWindow.textContent = "";
// keep track of conversation history
let messages = [
  {
    role: "system",
    content: `You are a beauty advisor with L'Oreal. You will answer questions about L\'Oreal products, routine recommendations, and beauty-related topics. If a question is unrelated to those topics, politely refuse to answer and guide the user back to L\'Oreal products or beauty advice. Always be friendly and helpful!`,
  },
];

const workerURL = "https://loreal-worker.rawrobynne27.workers.dev/";
// Function to display a message in the chat window
function displayMessage(content, role) {
  const msgDiv = document.createElement("div");
  msgDiv.className = `msg ${role}`;
  if (role === "user") {
    msgDiv.textContent = `${content}`;
  } else {
    msgDiv.textContent = content;
  }
  chatWindow.appendChild(msgDiv);
  // Scroll to bottom
  chatWindow.scrollTop = chatWindow.scrollHeight;
  return msgDiv;
}

/* Handle form submit */
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const userMessage = userInput.value.trim();
  if (!userMessage) return;

  // Show only the latest exchange in the chat window
  chatWindow.innerHTML = "";

  // Display user message immediately
  displayMessage(userMessage, "user");

  // Show a temporary loading message while waiting for API response
  const loadingMessage = displayMessage("", "ai");
  loadingMessage.classList.add("loading");
  loadingMessage.innerHTML =
    '<span class="typing-dots" aria-label="Assistant is typing"><span>.</span><span>.</span><span>.</span></span>';

  // add message to conversation history
  messages.push({ role: "user", content: userMessage });
  // When using Cloudflare, you'll need to POST a `messages` array in the body,
  // and handle the response using: data.choices[0].message.content
  try {
    const response = await fetch(workerURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: messages,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    // Check if there's an error in the response
    if (result.error) {
      throw new Error(`API Error: ${JSON.stringify(result.error)}`);
    }

    const replyText = result.choices[0].message.content;
    messages.push({ role: "assistant", content: replyText });

    // Replace loading indicator with AI response
    loadingMessage.classList.remove("loading");
    loadingMessage.textContent = replyText;
    chatWindow.scrollTop = chatWindow.scrollHeight;
  } catch (error) {
    console.error("Error fetching response:", error);
    loadingMessage.classList.remove("loading");
    loadingMessage.textContent =
      "Sorry, there was an error getting a response. Please try again.";
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }

  // Clear input
  userInput.value = "";
});
