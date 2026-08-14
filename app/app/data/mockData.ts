export type ThreadMessage = {
  id: string;
  senderName: string;
  senderEmail: string;
  body: string;
  date: string;
  timestamp: string;
  attachments?: { name: string; url: string; type: "image" | "file" }[];
};

export type Email = {
  id: string;
  senderName: string;
  senderEmail: string;
  recipientEmail: string;
  subject: string;
  snippet: string;
  body: string;
  date: string;
  isUnread: boolean;
  isStarred: boolean;
  isOfficial?: boolean;
  hasAttachment?: boolean;
  thread?: ThreadMessage[];
  deliveryStatus?: 'Sent' | 'Delivered' | 'Opened' | 'Replied';
  scheduledTime?: string;
  deletionDate?: string;
  category?: 'Builds' | 'Security' | 'Payments' | 'Account' | 'Teams';
  lastEdited?: string;
  autoSaved?: boolean;
  labels?: string[];
};

export const MOCK_EMAILS: Email[] = [
  {
    id: "0",
    senderName: "Norest Mail",
    senderEmail: "team@norestmail.com",
    recipientEmail: "ripun@norest.in",
    subject: "Welcome, Ripun!",
    snippet: "Welcome to Norest Mail! We're incredibly excited to have you here.",
    body: "Hi Ripun,\n\nWelcome to Norest Mail!\n\nWe built Norest to provide a seamless, ultra-fast, and secure email experience without the clutter. \n\nFeel free to customize your theme, organize your inbox, and let us know if you have any feedback.\n\nBest,\nThe Norest Team",
    date: "Mon, Jul 27, 10:30 AM",
    isUnread: true,
    isStarred: true,
    isOfficial: true,
    labels: ["Personal", "Marketing"],
  },
  {
    id: "1",
    senderName: "Jackson Cole",
    senderEmail: "jackson@acorn.com",
    recipientEmail: "syafrilchoirul17@gmail.com",
    subject: "Welcome to your workspace!",
    snippet: "Let's kick things off — your tools are ready, and we're excited to have you on board.",
    body: "Hi Choirul,\n\nWelcome to your new workspace! Let's kick things off — your tools are ready, and we're excited to have you on board.\n\nBest,\nJackson",
    date: "Fri, Jul 3, 9:15 AM",
    isUnread: false,
    isStarred: false,
    labels: ["Design", "Development"],
    thread: [
      {
        id: "t1",
        senderName: "Choirul Syafril",
        senderEmail: "syafrilchoirul17@gmail.com",
        body: "Hi Jackson,\n\nThanks for the warm welcome! I've just logged in and everything looks incredibly fast and clean. Where should I start first?",
        date: "Jul 3",
        timestamp: "9:15 AM",
        attachments: [
          { name: "design_mockup_v1.jpg", url: "https://images.unsplash.com/photo-1618761714954-0b8cd0026356?auto=format&fit=crop&q=80&w=400", type: "image" },
          { name: "project_requirements.pdf", url: "#", type: "file" }
        ]
      },
      {
        id: "t2",
        senderName: "Jackson Cole",
        senderEmail: "jackson@acorn.com",
        body: "Glad you like it!\n\nI recommend starting by setting up your integrations in the Settings panel. It'll automatically pull in your calendar and task lists.",
        date: "Jul 3",
        timestamp: "10:30 AM",
      },
      {
        id: "t3",
        senderName: "Choirul Syafril",
        senderEmail: "syafrilchoirul17@gmail.com",
        body: "Perfect, I've got my calendar synced now. Is there a way to customize the theme to a dark mode?",
        date: "Jul 4",
        timestamp: "2:45 PM",
      },
      {
        id: "t4",
        senderName: "Jackson Cole",
        senderEmail: "jackson@acorn.com",
        body: "Absolutely. Just hit CMD+K to open the command palette and type 'Theme'. You'll see the Dark Mode toggle right there.",
        date: "Jul 4",
        timestamp: "3:12 PM",
      },
      {
        id: "t5",
        senderName: "Choirul Syafril",
        senderEmail: "syafrilchoirul17@gmail.com",
        body: "Wow, that CMD+K shortcut is a game changer. The dark mode looks gorgeous. Thanks for the tip, Jackson!",
        date: "Jul 4",
        timestamp: "4:05 PM",
      },
      {
        id: "t6",
        senderName: "Jackson Cole",
        senderEmail: "jackson@acorn.com",
        body: "Anytime! Let me know if you run into any issues. \n\nWe also have a full documentation site if you ever want to dive deeper into the power-user features. Have a great week!",
        date: "Jul 5",
        timestamp: "9:00 AM",
      }
    ]
  },
  {
    id: "2",
    senderName: "Emily Parker",
    senderEmail: "emily.parker@acorn.com",
    recipientEmail: "syafrilchoirul17@gmail.com",
    subject: "Tips to stay organized",
    snippet: "Hi Choirul 👋 I'm glad you're giving Acorn a try! We built this space to help you organize tasks...",
    body: "Hi Choirul 👋\n\nI'm glad you're giving Acorn a try! We built this space to help you organize tasks, stay on track, and keep your day flowing smoothly — without the usual clutter.\n\nTo help you get started, this inbox includes a few example messages. Go ahead and explore — each one comes with a small tip to show you what's possible.\n\nLooking forward to seeing what you build with it!\n\nCheers,\nEmily\nProduct Specialist | Acorn Workspace",
    date: "Tue, Jun 30, 2:45 PM",
    isUnread: false,
    isStarred: false,
  },
  {
    id: "3",
    senderName: "Nathan Brooks",
    senderEmail: "nathan@acorn.com",
    recipientEmail: "syafrilchoirul17@gmail.com",
    subject: "Automate your routine!",
    snippet: "Why do things manually? Set up custom rules and let Acorn handle the heavy lifting for you.",
    body: "Hi Choirul,\n\nWhy do things manually? Set up custom rules and let Acorn handle the heavy lifting for you.\n\nTry it out today,\nNathan",
    date: "Sun, Jun 28, 11:20 AM",
    isUnread: false,
    isStarred: false,
  },
  {
    id: "4",
    senderName: "Chloe Bennett",
    senderEmail: "chloe@acorn.com",
    recipientEmail: "syafrilchoirul17@gmail.com",
    subject: "Ready to collaborate?",
    snippet: "Bring your team onboard, assign roles, and start syncing up on projects in real-time.",
    body: "Hey Choirul,\n\nBring your team onboard, assign roles, and start syncing up on projects in real-time. It's the best way to get things done.\n\nThanks,\nChloe",
    date: "Thu, Jun 25, 4:05 PM",
    isUnread: false,
    isStarred: false,
  }
];

export const FOLDERS = [
  { name: "Inbox", count: 302, icon: "inbox" },
  { name: "Starred", count: 6, icon: "star" },
  { name: "Snoozed", count: 6, icon: "clock" },
  { name: "Important", count: 6, icon: "pin" },
  { name: "Sent", count: null, icon: "send" },
  { name: "Drafts", count: 14, icon: "file" }
];

export const CATEGORIES = [
  { name: "Social", icon: "users" },
  { name: "Updates", icon: "info" },
  { name: "Forums", icon: "message-square" },
  { name: "Promotions", icon: "tag" }
];

export const LESS_ITEMS = [
  { name: "Chats", icon: "message-circle" },
  { name: "Scheduled", icon: "clock-4" },
  { name: "All mail", icon: "mail" },
  { name: "Spam", icon: "alert-circle" },
  { name: "Trash", icon: "trash-2" },
  { name: "Manage labels", icon: "settings" }
];

// Subscription type is deprecated, using Email instead for mailing lists

export const MOCK_DRAFTS: Email[] = [
  {
    id: "d1",
    senderName: "Me",
    senderEmail: "ripun@norest.in",
    recipientEmail: "team@acorn.com",
    subject: "Project Alpha Update",
    snippet: "Here is the latest update on...",
    body: "Here is the latest update on Project Alpha.",
    date: "Draft",
    isUnread: false,
    isStarred: false,
    lastEdited: "10 mins ago",
    autoSaved: true,
  }
];

export const MOCK_SENT: Email[] = [
  {
    id: "s1",
    senderName: "Me",
    senderEmail: "ripun@norest.in",
    recipientEmail: "client@example.com",
    subject: "Invoice #001",
    snippet: "Please find attached the invoice...",
    body: "Please find attached the invoice for the recent work.",
    date: "Tue, Jun 30, 9:00 AM",
    isUnread: false,
    isStarred: false,
    deliveryStatus: "Opened"
  }
];

export const MOCK_SCHEDULED: Email[] = [
  {
    id: "sch1",
    senderName: "Me",
    senderEmail: "ripun@norest.in",
    recipientEmail: "team@norest.in",
    subject: "Meeting Notes",
    snippet: "Here are the notes from our last meeting.",
    body: "Here are the notes from our last meeting.",
    date: "Scheduled",
    isUnread: false,
    isStarred: false,
    scheduledTime: "Tomorrow 9:00 AM"
  }
];

export const MOCK_ARCHIVE: Email[] = [];
export const MOCK_ARCHIVED: Email[] = [];
export const MOCK_SPAM: Email[] = [];
export const MOCK_TRASH: Email[] = [];
export const MOCK_NEWSLETTERS: Email[] = [
  {
    id: "nl1",
    senderName: "Tech Weekly",
    senderEmail: "news@techweekly.com",
    recipientEmail: "ripun@norest.in",
    subject: "This Week in Tech",
    snippet: "The latest technology news and updates from around the web.",
    body: "The latest technology news and updates from around the web...",
    date: "Today",
    isUnread: true,
    isStarred: false,
  }
];
export const MOCK_NEWSLETTER: Email[] = [
  {
    id: "nl1",
    senderName: "Tech Weekly",
    senderEmail: "news@techweekly.com",
    recipientEmail: "ripun@norest.in",
    subject: "This Week in Tech",
    snippet: "The latest technology news and updates from around the web.",
    body: "The latest technology news and updates from around the web...",
    date: "Today",
    isUnread: true,
    isStarred: false,
  }
];
export const MOCK_NOTIFICATIONS: Email[] = [
  {
    id: "not1",
    senderName: "GitHub",
    senderEmail: "notifications@github.com",
    recipientEmail: "ripun@norest.in",
    subject: "New pull request in your repository",
    snippet: "A new pull request has been opened in your repository.",
    body: "A new pull request has been opened in your repository...",
    date: "Today",
    isUnread: true,
    isStarred: false,
  }
];

export const MOCK_SUBSCRIPTIONS: Email[] = [
  {
    id: "sub1",
    senderName: "Medium Daily Digest",
    senderEmail: "noreply@medium.com",
    recipientEmail: "ripun@norest.in",
    subject: "Your Daily Digest",
    snippet: "Here are the top stories tailored for you today.",
    body: "Here are the top stories tailored for you today...",
    date: "Yesterday",
    isUnread: false,
    isStarred: false,
  },
  {
    id: "sub2",
    senderName: "Product Hunt",
    senderEmail: "hello@producthunt.com",
    recipientEmail: "ripun@norest.in",
    subject: "The best new products, every day",
    snippet: "Check out the top products of the week.",
    body: "Check out the top products of the week...",
    date: "Today",
    isUnread: true,
    isStarred: false,
  }
];
