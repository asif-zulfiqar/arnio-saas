const generateDummyConversations = (num) => {
  const names = [
    "John Doe",
    "Jane Smith",
    "Alice Johnson",
    "Bob Brown",
    "Charlie Davis",
    "David Wilson",
    "Emily Clark",
    "Frank Harris",
    "Grace Lewis",
    "Helen Young",
  ];

  const phoneNumbers = [
    "+1 555-1234",
    "+1 555-5678",
    "+1 555-9101",
    "+1 555-1122",
    "+1 555-3344",
    "+1 555-5566",
    "+1 555-7788",
    "+1 555-9900",
    "+1 555-2233",
    "+1 555-4455",
  ];

  const responses = [
    "Thanks for your message!",
    "That sounds great!",
    "I'll get back to you soon.",
    "Sounds good!",
    "Thanks for letting me know.",
    "Got it, thanks!",
    "I understand.",
    "Perfect, thank you!",
    "I'll take a look at that.",
    "Thanks for the update!",
  ];

  const getRandomName = () => names[Math.floor(Math.random() * names.length)];
  const getRandomPhoneNumber = () =>
    phoneNumbers[Math.floor(Math.random() * phoneNumbers.length)];

  const getRandomDeviceType = () => {
    const types = ["andriod", "apple", "unknown"];
    return types[Math.floor(Math.random() * types.length)];
  };

  const conversations = [];

  for (let i = 0; i < num; i++) {
    const id = `convo-${Date.now() + i}`;
    const name = getRandomName();
    const phoneNumber = getRandomPhoneNumber();
    const lastMessage = "";
    const lastMessageTime = new Date();
    const isTyping = false;
    const unreadCount = 0;
    const deviceType = getRandomDeviceType();
    const messages = [];

    const conversation = {
      id,
      phoneNumber,
      name,
      lastMessage,
      lastMessageTime,
      messages,
      isTyping,
      unreadCount,
      deviceType,
    };

    conversations.push(conversation);
  }

  return conversations;
};

function devLog(...args) {
  if (process.env.NODE_ENV === "development") {
    console.log(...args);
  }
}

export { generateDummyConversations, devLog };
