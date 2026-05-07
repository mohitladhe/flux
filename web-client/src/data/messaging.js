import {
  BriefcaseBusiness,
  Code2,
  Headphones,
  Image,
  KeyRound,
  Mic,
  Palette,
  ShieldCheck,
  File,
  UsersRound,
} from "lucide-react";

export const currentUser = {
  name: "Mohit Ladhe",
  handle: "@mohit",
  status: "Available",
  avatar: "ML",
};

export const conversations = [
  {
    id: "launch-room",
    name: "Launch Room",
    type: "Team",
    avatar: "LR",
    accent: "avatar-work",
    preview: "Keys rotated. Production checklist is ready.",
    time: "09:44",
    unread: 3,
    online: true,
    icon: BriefcaseBusiness,
    members: ["Mohit", "Anika", "Dev Ops", "QA"],
  },
  {
    id: "anika",
    name: "Anika Sharma",
    type: "Direct",
    avatar: "AS",
    accent: "avatar-design",
    preview: "Can you verify the mobile device fingerprint?",
    time: "09:31",
    unread: 0,
    online: true,
    icon: Palette,
    members: ["Mohit", "Anika"],
  },
  {
    id: "backend",
    name: "Backend Guild",
    type: "Team",
    avatar: "BG",
    accent: "avatar-team",
    preview: "Socket reconnect strategy merged locally.",
    time: "Yesterday",
    unread: 0,
    online: false,
    icon: Code2,
    members: ["Mohit", "Node API", "Socket Gateway"],
  },
  {
    id: "support",
    name: "User Support",
    type: "Ops",
    avatar: "US",
    accent: "avatar-support",
    preview: "Attachment previews should stay encrypted at rest.",
    time: "Mon",
    unread: 1,
    online: true,
    icon: Headphones,
    members: ["Mohit", "Support"],
  },
];

export const activeConversation = conversations[0];

export const messages = [
  {
    id: 1,
    author: "Anika Sharma",
    avatar: "AS",
    body: "Morning. I created the encrypted launch room and invited QA. Device fingerprints are visible in the right panel.",
    time: "09:38",
    mine: false,
    state: "Verified",
  },
  {
    id: 2,
    author: "Mohit Ladhe",
    avatar: "ML",
    body: "Perfect. I am checking that the web client never sends plaintext through the socket payload.",
    time: "09:40",
    mine: true,
    state: "Delivered",
  },
  {
    id: 3,
    author: "Dev Ops",
    avatar: "DO",
    body: "Blind router logs are clean. We only see room id, delivery state, and encrypted envelope size.",
    time: "09:42",
    mine: false,
    state: "Forward secure",
  },
  {
    id: 4,
    author: "Mohit Ladhe",
    avatar: "ML",
    body: "Great. I am sending the final checklist now. Keep the key rotation banner pinned until mobile joins Phase 2.",
    time: "09:44",
    mine: true,
    state: "Read",
  },
];

export const attachments = [
  { icon: Image, label: "Image", hint: "Encrypted preview" },
  { icon: Mic, label: "Voice", hint: "Local capture" },
  { icon: File, label: "File", hint: "From the device" },
];

export const trustSignals = [
  {
    icon: ShieldCheck,
    label: "4 verified devices",
    detail: "All members confirmed",
  },
  {
    icon: KeyRound,
    label: "Key rotation active",
    detail: "Last rotation 2m ago",
  },
  {
    icon: UsersRound,
    label: "Private team room",
    detail: "Invite-only access",
  },
];
