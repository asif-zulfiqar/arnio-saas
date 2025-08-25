import { v4 as uuidv4 } from "uuid";
const now = () => new Date().toISOString();

const conversations = [
  {
    id: "c1",
    name: "Robert Casas",
    phone: "+1 914 834 2354",
    avatar: "/avatars/robert.jpg",
    lastMessage: "Thanks. I'm browsing a bit.",
    lastTime: "14:23",
    isTyping: true,
    unread: 0,
    messages: [
      {
        id: uuidv4(),
        type: "text",
        from: "other",
        text: "Thanks. I'm browsing a bit. Could you tell me how it works?",
        time: "07:30",
      },
      {
        id: uuidv4(),
        type: "voice",
        from: "other",
        duration: "3:42",
        time: "07:31",
      },
      {
        id: uuidv4(),
        type: "file",
        from: "me",
        fileName: "Product Catalog.pdf",
        time: "11:46",
      },
      {
        id: uuidv4(),
        type: "text",
        from: "me",
        text: "Of course. We offer flexible options. Just share what you're thinking and we’ll shape it from there.",
        time: "11:46",
      },
    ],
  },
  {
    id: "c2",
    name: "Leslie Livingston",
    phone: "+1 202 555 0199",
    avatar: "/avatars/leslie.jpg",
    lastMessage: "Yes, we can do this",
    lastTime: "18:05",
    isTyping: false,
    unread: 0,
    messages: [
      {
        id: uuidv4(),
        type: "text",
        from: "other",
        text: "Yes, we can do this",
        time: "18:05",
      },
    ],
  },
  {
    id: "c3",
    name: "Nelly Sims",
    phone: "+1 555 333 221",
    avatar: "/avatars/nelly.jpg",
    lastMessage: "Voice message",
    lastTime: "10:02",
    isTyping: false,
    unread: 2,
    messages: [
      {
        id: uuidv4(),
        type: "voice",
        from: "other",
        duration: "0:45",
        time: "10:00",
      },
    ],
  },
  {
    id: "c4",
    name: "Micheal Gough",
    phone: "+1 310 999 212",
    avatar: "/avatars/mg.jpg",
    lastMessage: "Nvm, I will grab all in maxi...",
    lastTime: "07:45",
    isTyping: false,
    unread: 0,
    messages: [
      {
        id: uuidv4(),
        type: "text",
        from: "other",
        text: "Nvm, I will grab all in maxi...",
        time: "07:45",
      },
    ],
  },
];

const getConversationById = (id) => {
  return conversations.find((c) => c.id === id);
};

export { conversations, getConversationById };
