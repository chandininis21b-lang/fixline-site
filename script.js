/**
 * Fixline — demo chat logic.
 *
 * Right now this simulates a response locally so the page works out of the
 * box. Replace `getAgentReply()` with a real call to your Salesforce
 * Agentforce agent — see the README section "Connect Agentforce" for the
 * exact snippet (Embedded Messaging for Web).
 */

const chatForm = document.getElementById('chatForm');
const chatInput = document.getElementById('chatInput');
const chatLog = document.getElementById('chatLog');

function addBubble(text, role) {
  const div = document.createElement('div');
  div.className = `bubble ${role}`;
  div.textContent = text;
  chatLog.appendChild(div);
  chatLog.scrollTop = chatLog.scrollHeight;
  return div;
}

function addTypingIndicator() {
  const div = document.createElement('div');
  div.className = 'bubble agent typing';
  div.innerHTML = '<span></span><span></span><span></span>';
  chatLog.appendChild(div);
  chatLog.scrollTop = chatLog.scrollHeight;
  return div;
}

// --- Placeholder "agent" — swap this out for the real Agentforce call ---
async function getAgentReply(userText) {
     const res = await fetch('http://localhost:3001/api/agent', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ message: userText })
     });
     const data = await res.json();
     return data.reply;
   }
// --------------------------------------------------------------------

chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const value = chatInput.value.trim();
  if (!value) return;

  addBubble(value, 'user');
  chatInput.value = '';
  chatInput.disabled = true;

  const typingEl = addTypingIndicator();

  try {
    const reply = await getAgentReply(value);
    typingEl.remove();
    addBubble(reply, 'agent');
  } catch (err) {
    typingEl.remove();
    addBubble("I couldn't reach the support agent just now — please try again in a moment.", 'agent');
    console.error('Agent request failed:', err);
  } finally {
    chatInput.disabled = false;
    chatInput.focus();
  }
});
