// An illustrated workflow comparison; switching does not connect to external tools.
const environmentModes = {
  claude: {
    symbol: "✳",
    title: "Claude Code",
    subtitle: "VS Code · local checkout",
    action: "I build, run and review the prototype.",
    note: "I use Claude Code in my editor to work with the project files and run the prototype locally.",
    contextTitle: "Brief + original work",
    contextCopy:
      "I provide the task, source screens, constraints and decisions already made.",
    connectorsTitle: "Selected tools + sources",
    connectorsCopy:
      "I choose the files, documents and tools relevant to this task.",
    skillsTitle: "Repeatable review steps",
    skillsCopy:
      "I use reusable instructions for UI critique, accessibility and implementation checks.",
  },
  gpt: {
    symbol: "◈",
    title: "GPT Work",
    subtitle: "Workspace · selected context",
    action: "I explore, compare and prepare work for review.",
    note: "I use GPT Work to explore the brief with selected reference material and connected tools. I record the decisions I keep in the project repo.",
    contextTitle: "Brief + reference material",
    contextCopy:
      "I bring in the agreed brief, source files and the latest design decisions.",
    connectorsTitle: "Connected apps + files",
    connectorsCopy:
      "I select the documents and tools needed for the task, and review what context they provide.",
    skillsTitle: "Reusable project instructions",
    skillsCopy:
      "I use repeatable instructions for critique, writing and review, then check the result against the brief.",
  },
};
const environmentTabs = [...document.querySelectorAll("[data-environment]")],
  systemPanel = document.getElementById("ai-system-panel");
function setEnvironment(key, focus = false) {
  const mode = environmentModes[key];
  if (!mode || !systemPanel) return;
  environmentTabs.forEach((button) => {
    const selected = button.dataset.environment === key;
    button.setAttribute("aria-selected", String(selected));
    button.tabIndex = selected ? 0 : -1;
  });
  systemPanel.dataset.mode = key;
  systemPanel.setAttribute("aria-labelledby", `environment-${key}`);
  const fields = {
    "environment-symbol": mode.symbol,
    "environment-title": mode.title,
    "environment-subtitle": mode.subtitle,
    "environment-action": mode.action,
    "method-mode-note": mode.note,
    "context-title": mode.contextTitle,
    "context-copy": mode.contextCopy,
    "connectors-title": mode.connectorsTitle,
    "connectors-copy": mode.connectorsCopy,
    "skills-title": mode.skillsTitle,
    "skills-copy": mode.skillsCopy,
  };
  for (const [id, text] of Object.entries(fields))
    document.getElementById(id).textContent = text;
  if (focus) document.getElementById(`environment-${key}`).focus();
}
environmentTabs.forEach((button, index) => {
  button.onclick = () => setEnvironment(button.dataset.environment);
  button.onkeydown = (event) => {
    let next;
    if (event.key === "ArrowRight" || event.key === "ArrowDown")
      next = (index + 1) % environmentTabs.length;
    if (event.key === "ArrowLeft" || event.key === "ArrowUp")
      next = (index + environmentTabs.length - 1) % environmentTabs.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = environmentTabs.length - 1;
    if (next !== undefined) {
      event.preventDefault();
      setEnvironment(environmentTabs[next].dataset.environment, true);
    }
  };
});
setEnvironment("claude");
