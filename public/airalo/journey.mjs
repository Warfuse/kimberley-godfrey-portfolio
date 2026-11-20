/** Source-backed states: values are from original screenshots, not live plan rules. */
export const scenes = [
  {
    id: "ready",
    label: "Ready to travel",
    status: "Ready for Japan",
    image: "ready-wallet.jpeg",
    data: "10 GB",
    days: "15 days",
    airmoney: "US$3.20",
    title: "I put the trip essentials on the pass.",
    reason:
      "I designed the card around the destination, data allowance, validity and Airmoney. The Japan graphic gives the pass a recognisable place in the wallet.",
    notification: null,
    action: "Arrive in Japan",
    tag: "Before travel",
  },
  {
    id: "connected",
    label: "Connected",
    status: "Connected in Japan",
    image: "connected-notification.jpeg",
    data: "10 GB",
    days: "15 days",
    airmoney: "US$3.20",
    title: "I made the connection state visible.",
    reason:
      "I paired the connected card state with a short arrival message. The member can see that the demo has moved from ready to connected without losing the plan details.",
    notification: "You’re connected. Enjoy Japan!",
    action: "See the in-trip update",
    tag: "Arrival",
  },
  {
    id: "usage",
    label: "During the trip",
    status: "Connected in Japan",
    image: "usage-validity.jpeg",
    data: "6.4 GB",
    days: "11 days",
    airmoney: "US$3.20",
    title: "I kept data and time together.",
    reason:
      "I retained both the remaining data and validity on the card. My supplied example also shows a time-remaining message, so the traveller has context beyond a balance alone.",
    notification: "11 days left on your Japan plan",
    action: "See the low-data state",
    tag: "In Japan",
  },
  {
    id: "low",
    label: "Low data",
    status: "Low data",
    image: "low-data-reminder.jpeg",
    data: "0.8 GB",
    days: "11 days",
    airmoney: "US$3.20",
    title: "I gave low data a distinct state.",
    reason:
      "I used an amber status, a different destination graphic and a short reminder to make low data recognisable. The remaining balance stays visible alongside the message.",
    notification: "Your data is running low. Top up now.",
    action: "See the validity reminder",
    tag: "A useful prompt",
  },
  {
    id: "expiry",
    label: "Validity reminder",
    status: "Low data",
    image: "expiry-reminder.jpeg",
    data: "0.8 GB",
    days: "4 days",
    airmoney: "US$3.20",
    title: "I separated time remaining from data remaining.",
    reason:
      "I designed a validity reminder as a separate message. In this example, the card still has 0.8 GB but only four days remaining; the two measures answer different questions.",
    notification: "4 days left on your Japan plan",
    action: "Preview the top-up result",
    tag: "Before expiry",
  },
  {
    id: "topup",
    label: "Top-up complete",
    status: "Top-up complete",
    image: "top-up-confirmation.jpeg",
    data: "5.8 GB",
    days: "4 days",
    airmoney: "US$3.20",
    title: "I confirmed the top-up with a new card state.",
    reason:
      "I produced a dusk graphic and completion treatment for the top-up result. The demo shows 5.8 GB and four days remaining; I do not imply that topping up extends validity.",
    notification: "Top-up complete. You’re connected for more adventures.",
    action: "See the Airmoney update",
    tag: "After a top-up",
  },
  {
    id: "airmoney",
    label: "Airmoney update",
    status: "Top-up complete",
    image: "airmoney-update.jpeg",
    data: "5.8 GB",
    days: "4 days",
    airmoney: "US$3.73",
    title: "I included a balance-update moment.",
    reason:
      "I designed a separate Airmoney message while keeping the trip context on the card. The balance changes from US$3.20 to US$3.73 in the demo; this is an example, not a cashback rule.",
    notification: "Your Airmoney balance is now US$3.73",
    action: "Restart the journey",
    tag: "A balance update",
  },
];
export const sourceScreens = [
  {
    image: "pass-landing.jpeg",
    title: "My pass landing page",
    detail:
      "My Fuse Wallet landing page with Apple and Google Wallet entry points.",
  },
  ...scenes.map((scene) => ({
    image: scene.image,
    title: scene.label,
    detail: `${scene.data} · ${scene.days} · ${scene.airmoney}`,
  })),
  {
    image: "data-update.jpeg",
    title: "Data update · 6.4 GB",
    detail: "An additional message example with 15 days remaining.",
  },
  {
    image: "low-data-update.jpeg",
    title: "Data update · 0.8 GB",
    detail: "The low-data card with a remaining-data message.",
  },
  {
    image: "low-data-card.jpeg",
    title: "Low-data card without a banner",
    detail: "My wallet view, including the action links.",
  },
  {
    image: "top-up-data-update.jpeg",
    title: "Data update after top-up",
    detail: "The top-up card with the remaining-data message.",
  },
];
export function selectScene(id) {
  return scenes.find((scene) => scene.id === id) || scenes[0];
}
export function nextScene(id) {
  const index = scenes.findIndex((scene) => scene.id === id);
  return scenes[index < 0 || index === scenes.length - 1 ? 0 : index + 1];
}
export function previousScene(id) {
  const index = scenes.findIndex((scene) => scene.id === id);
  return scenes[Math.max(0, index - 1)];
}
