// Every user-facing string. Plan copy deck (section 9) first; existing Figma wording kept where the
// deck is silent. Lines marked NEW are additions not in the deck (flagged in the README).

export const S = {
  common: {
    continue: 'Continue',
    addCustom: 'Add “{text}”', // NEW: search with no match
    back: 'Back',
    close: 'Close',
    skip: 'Skip',
    later: 'Later',
    preview: 'Preview',
  },
  welcome: {
    brand: 'Juno',
    title: 'Tired of explaining your illness again and again?',
    sub: 'Tell Juno once. It remembers.',
    time: 'About 5 minutes. Be as honest as you like.', // v2 narration spec
    cta: 'Try it now',
    haveAccount: 'I have an account',
    proof1Big: '#1',
    proof1Small: 'App for chronic\nillness',
    proof2Big: '300K',
    proof2Small: 'Happy\nusers',
    termsLead: 'By continuing, you agree to Juno’s',
    terms: 'Terms of Service',
    and: 'and',
    privacy: 'Privacy Policy',
    debugHint: 'Long-press the logo for the screen menu',
  },
  consent: {
    title: 'Before you tell me anything',
    body: 'Your health data is never sold, and there are no ads. Ever.',
    agreeLead: 'I agree to the',
    privacy: 'Privacy Policy',
    and: 'and',
    terms: 'Terms',
  },
  try: {
    q: 'How do you feel today?',
    placeholder: 'Type how you feel',
    suggestions: ['Tired, and my head hurts', 'Dizzy when I stand up', 'Okay today, just foggy'],
    mic: 'Dictate',
    micUnavailable: 'Dictation isn’t available here. Use the keyboard mic instead.', // NEW
  },
  heard: {
    title: 'Juno heard you', // NEW (screen title from plan section 6)
    sub: 'Juno logs it for you.', // existing Figma 35 wording
    today: 'Today', // NEW
    reply: 'That sounds hard. I’ve logged {symptoms} for today.',
    replyNone: 'Thanks for telling me. I’ve saved that for today.',
    logged: 'Logged', // NEW
    progress: "That's entry 1 on your doctor page.", // v2 narration spec
    next: 'Next: your health.', // v2 narration spec
  },
  goals: {
    q: 'What would make the biggest difference for you?',
    noneSelected: 'None selected yet',
    limit: 'Pick up to 3', // v2 narration spec
    selected: '{n} selected',
    reply: 'That’s a realistic goal. I’ll build around it.',
    options: [
      'Manage flare days',
      'Understand my symptoms',
      'Reduce pain',
      'Feel more supported',
      'Find my triggers',
      'Prepare for appointments',
      'Manage my energy',
    ],
  },
  conditions: {
    q: 'What have doctors told you so far?',
    why: 'So I can show what’s common with it.',
    search: 'Search for a condition',
    reply: '{condition} is exhausting. I’ll keep a close eye on it.',
    replyNone: 'Not having a name for it is hard. I’ll track it anyway.',
    seeking: 'Still looking for answers',
    showAll: 'Show all conditions', // NEW: experiment variant A
    showFewer: 'Show fewer', // NEW
    more: 'More conditions', // NEW: experiment variant B
    yours: 'Your conditions', // NEW: experiment variant B
    remove: 'Remove {name}', // NEW: screen reader label on removable chips
    somethingElse: 'Something else', // NEW: experiment variant C
    echo: 'Got it: {list}.', // NEW: experiment variant C
    echoSeeking: 'Got it: still looking for answers.', // NEW: experiment variant C
    noMatch: 'No match. Add it as typed below.', // NEW
    addN: 'Add {n} diagnoses',
    add1: 'Add 1 diagnosis',
    options: [
      'ME/CFS (chronic fatigue syndrome)',
      'Long COVID',
      'Fibromyalgia',
      'POTS',
      'hEDS',
      'Lupus',
      'Multiple sclerosis',
      'Rheumatoid arthritis',
      'Migraine',
      'IBS',
      'Endometriosis',
      'Anxiety',
      'Depression',
    ],
  },
  symptoms: {
    q: 'What has your body been doing lately?',
    why: 'I’ve ticked what you told me, so add anything I missed.',
    search: 'Search symptoms',
    reply: 'Got it. I’ll look for what sets these off.',
    groupFor: 'For {condition}',
    groupCommon: 'Common', // NEW, used when no condition picked
    none: 'None right now',
    addN: 'Add {n} symptoms',
    add1: 'Add 1 symptom',
    options: [
      'Orthostatic intolerance',
      'Dizziness',
      'Racing heart',
      'Palpitations',
      'Fatigue',
      'Brain fog',
      'Fainting',
      'Headaches',
      'Nausea',
      'Breathlessness',
      'Exercise intolerance',
    ],
  },
  meds: {
    q: 'Are you taking anything for it?',
    why: 'So I can notice changes when you start or stop something.',
    search: 'Search medicines',
    reply: 'Noted. You can add more any time.',
    groupFor: 'For {condition}',
    groupCommon: 'Common', // NEW
    showMore: 'Show more',
    none: 'I don’t take any',
    later: 'Add later',
    addN: 'Add {n} medicines',
    add1: 'Add 1 medicine',
    options: [
      'Salt tablets',
      'Electrolyte sachets',
      'Propranolol',
      'Ivabradine',
      'Fludrocortisone',
      'Midodrine',
      'Bisoprolol',
      'Pyridostigmine',
    ],
  },
  appt: {
    q: 'When do you next see a doctor?',
    why: 'So your summary is ready before you walk in.',
    reply: 'That’s in {days} days. I’ll have it ready.',
    replyTomorrow: 'That’s tomorrow. I’ll have it ready.', // NEW (singular of appt.reply)
    replyToday: 'That’s today. I’ll have it ready.', // NEW
    replyNone: 'No problem. Your record will be ready when you need it.',
    none: 'None booked',
    weekdays: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],
    months: [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ],
    prevMonth: 'Previous month',
    nextMonth: 'Next month',
  },
  energy: {
    q: 'How much energy do you have on a normal day?',
    why: 'This helps me suggest when to rest.',
    reply: 'Thanks. I’ll plan around that, not against it.',
    low: 'Running\non empty',
    high: 'Charged\nand steady',
    a11y: 'Energy on a normal day, {n} of 7',
  },
  support: {
    q: 'Who really gets what you’re going through?',
    reply: 'You’re not alone in this.',
    options: [
      { id: 'none', label: 'No one right now' },
      { id: 'one_two', label: '1 or 2' },
      { id: 'three_five', label: '3 to 5' },
      { id: 'lots', label: 'Lots of people' },
    ],
  },
  about: {
    q: 'What should I call you?',
    reply: 'Good to meet you, {name}.',
    namePlaceholder: 'Your first name',
    sexLabel: 'Sex at birth', // NEW (section label; screen 31 question was "What's your sex at birth?")
    ageLabel: 'Age', // NEW (section label; screen 33 question was "How old are you?")
    sex: [
      { id: 'female', label: 'Female' },
      { id: 'male', label: 'Male' },
      { id: 'intersex', label: 'Intersex' },
      { id: 'undisclosed', label: 'Prefer not to say' },
    ],
    ages: ['16–17', '18–24', '25–34', '35–44', '45–54', '55–64', '65+'],
    clear: 'Clear name',
  },
  health: {
    q: 'Can I read your sleep and heart rate?',
    why: 'So you have less to log.',
    reply: 'Connected. I’ll fill in the quiet days.',
    bullet1: 'Pair Juno with Apple Health and watch your sleep, heart rate and activity appear like magic',
    bullet2: 'Juno cross-references them with your symptoms to find what’s really driving your flares',
    connect: 'Connect Apple Health',
    later: 'Maybe later',
    mockTitle: '“Juno” would like to access your Health data', // MOCK system sheet
    mockAllow: 'Allow',
    mockDeny: 'Don’t Allow',
  },
  building: {
    title: 'Building your snapshot…', // NEW (replaces "Adding your symptoms…")
    name: 'Getting to know {name}',
    nameAnon: 'Getting to know you', // NEW
    conditions: 'Adding {list}',
    seeking: 'Noting you’re still looking for answers', // NEW
    symptoms: 'Logging today: {list}',
    medicines: 'Tracking {list}',
    noMeds: 'Leaving space for medicines', // NEW
    appt: 'Preparing for {date}',
    noAppt: 'Keeping your record ready', // NEW
  },
  snapshot: {
    title: 'Here’s what I know so far, {name}.',
    titleAnon: 'Here’s what I know so far.', // NEW
    sub: 'Based on what you told me', // adapted from "Based on what you told us"
    rowConditions: 'Conditions',
    seeking: 'Still looking for answers',
    noConditions: 'None added yet',
    rowToday: 'Today',
    todayAsWritten: '“{entry}”',
    rowMeds: 'Medicines',
    rowAppt: 'Next appointment', // NEW: screen 14 shows it, so screen 15 repeats it (eval A-08)
    noMeds: 'None added yet',
    rowEnergy: 'Energy on a normal day',
    energyValue: '{n} of 7',
    noEnergy: 'Not set yet', // NEW
    watch: 'This week I’ll watch what affects your {symptom}.',
    watchDefault: 'This week I’ll watch how your days go.', // NEW fallback when nothing was logged
    cta: 'See my doctor page', // v2 narration spec
  },
  report: {
    title: 'What your doctor will see',
    badge: 'Preview',
    countdown: 'Ready for your appointment in {days} days',
    countdown1: 'Ready for your appointment tomorrow', // NEW
    countdown0: 'Ready for your appointment today', // NEW
    patient: 'Patient',
    age: 'Age {age}',
    conditions: 'Conditions',
    medicines: 'Medicines',
    none: 'None recorded',
    recent: 'Recent days',
    todayLabel: 'Today',
    sampleNote: 'More days appear here as you log.', // NEW
    seeking: 'Still looking for answers', // NEW
    footer: 'Juno helps you prepare for appointments, so you don’t have to remember everything.',
    cta: 'Continue',
  },
  save: {
    title: 'Save your snapshot',
    sub: 'So it’s here next time, on any device.',
    google: 'Continue with Google',
    apple: 'Continue with Apple',
    or: 'Or',
    email: 'Sign up with email',
    saving: 'Saving…',
  },
  how: {
    title: 'Here’s how Juno works for you',
    rows: [
      { title: 'See what your week is telling you', sub: 'The kind of read a health coach gives, at a fraction of the cost' },
      { title: 'No ads, ever', sub: 'Nobody is paying to reach you here' },
      { title: 'Your health data is never sold', sub: 'Not to advertisers, not to insurers, not to anyone' },
      { title: '7 days of Premium for free', sub: 'But you can still use Juno’s free version' },
    ],
    t1: 'Today',
    t1Sub: 'Get full access to all our features',
    t2: '{date}',
    t2Sub: 'We’ll remind you before your trial ends',
    t3: '{date}',
    t3Sub: 'Your subscription starts, unless you cancel anytime before',
    noPayment: 'No payment due now',
    cta: 'See my plan',
  },
  plans: {
    headline: {
      default: 'See what your week is telling you',
      'Manage flare days': 'See your flare days coming', // NEW mapping
      'Understand my symptoms': 'See what your symptoms are telling you', // NEW mapping
      'Find my triggers': 'See what sets your symptoms off', // NEW mapping
      'Prepare for appointments': 'Walk into every appointment ready', // NEW mapping
      'Manage my energy': 'See where your energy goes', // NEW mapping
    } as Record<string, string>,
    badge: '7 DAYS FREE',
    yearly: 'Yearly',
    yearlyPrice: '$99.99 a year',
    yearlySub: '$8.33 a month · 7 days free',
    monthly: 'Monthly',
    monthlyPrice: '$14.99',
    monthlyPer: '/mo',
    monthlySub: 'Billed monthly · no free trial',
    refund: 'Full refund, no questions asked',
    terms: 'Free for 7 days, then $99.99/year from {chargeDate}. We’ll remind you on {remindDate}.',
    termsMonthly: '$14.99 today, then every month. Cancel anytime in the App Store.', // NEW
    cta: 'Start 7 days free',
    ctaMonthly: 'Subscribe for $14.99/month', // NEW
    free: 'Continue with the free plan',
    cost: 'Is cost a problem?',
    restore: 'Restore purchases',
    termsLink: 'Terms',
    privacy: 'Privacy',
    dot: ' · ',
    processing: 'Confirming…',
    exitQ: 'What stopped you?',
    exitOptions: [
      { id: 'price', label: 'The price' },
      { id: 'unsure', label: 'Not sure it’s for me' },
      { id: 'try_first', label: 'I want to try it first' },
    ],
    exitSkip: 'Skip', // NEW
  },
  sponsor: {
    badge: 'SPONSORED',
    title: 'If cost is the problem, you can get a sponsored plan',
    options: [
      { id: 'work', label: 'Out of work' },
      { id: 'income', label: 'Low income' },
      { id: 'student', label: 'Student' },
    ],
    note: 'We won’t ask you to prove it.',
    cta: 'Claim the sponsored plan',
  },
  notify: {
    withTime: 'Can I check in each {time}?', // v2 narration spec
    trialLine: "I'll also remind you before your trial ends.",
    why: 'So I can check in at the time you picked. You can change it any time.', // v3 spec // v2 narration spec
    free: 'Can I check in with you once a day?',
    allow: 'Turn on reminders', // eval T-02: says what happens
    later: 'Not now', // existing "Not now" wording from screen 35
    mockTitle: '“Juno” Would Like to Send You Notifications', // MOCK system prompt (1:2015)
    mockBody: 'Notifications may include alerts, sounds and icon badges. These can be configured in Settings.',
    mockDeny: 'Don’t Allow',
    mockAllow: 'Allow',
  },
  done: {
    trialTitle: 'Welcome to Juno Pro',
    trialSub: 'We are so happy to have you.',
    freeTitle: 'Welcome to Juno',
    freeSub: 'Let me show you how I can help.',
    trialCta: 'Keep going', // v2 check 14: no bare "Continue" outside question screens (= card.cta)
    freeCta: 'Let’s go',
  },
  chat: {
    day: 'Day 1 of 7', // v2 narration spec
    juno: 'Juno',
    skip: 'Skip',
    loggedToday: 'Logged today',
    open: 'I’ve saved today’s entry. How did you sleep last night?',
    placeholder: 'Message Juno…',
    suggestions: [
      { id: 'flare', label: 'I’m having a flare-up' },
      { id: 'log', label: 'I want to log my symptoms' },
      { id: 'vent', label: 'I just need to vent' },
    ], // NEW in strings, wording from next-first-chat
    attach: 'Add attachment', // NEW
    replies: {
      flare: 'I’m sorry today is hard. I’ve marked it as a flare day.',
      log: 'Sure. Tell me how you feel in your own words and I’ll log it.',
      vent: 'I’m here. Say as much or as little as you like.',
      skip: 'No problem. I’m here whenever you want to talk.',
      logged: 'Got it. I’ve logged {list} for today.',
      saved: 'Thanks for telling me. I’ve added that to today’s entry.',
    }, // NEW: mock replies
    typing: 'Juno is typing', // NEW
    send: 'Send', // NEW
  },
  projection: {
    appointment: 'Your appointment is in {n} days. Log once a day and your doctor sees {n} days of how you’ve felt, not just what you remember.', // NEW (experiment)
    week: 'Log once a day this week and I’ll have 7 days to look for what affects your {symptom}.', // NEW (experiment)
    weekNoSymptom: 'Log once a day this week and I’ll have 7 days to look for what affects how you feel.', // NEW (experiment)
    soon: 'Your appointment is very soon. Today’s entry is already in your summary.', // NEW (experiment)
    loggedN: '1 of {n} days logged', // NEW (experiment)
    logged1: '1 of 1 day logged', // NEW (experiment)
    more: '+{n} more', // NEW (experiment)
  },
  sleep: {
    options: ['Badly', 'Okay', 'Well'], // NEW (experiment): one-tap answers to chat.open
    reply: 'Logged. That’s two entries today. I’ll check in tomorrow.', // NEW (experiment)
  },
  story: { // v3 spec: three beats, sourced from Juno's YC launch page (see docs/specs/onboarding-v3.md section 9)
    b1Title: 'Months to get an appointment. Then 15 minutes.',
    b1Body: 'That is all the time you get to explain years of symptoms.',
    b1Source: "From Juno's founders, YC launch",
    b2Title: 'We know because we lived it.',
    b2Isaac: 'Isaac waited 14 years for an eosinophilic bronchitis diagnosis.', // insight F7
    b2Marshall: 'Marshall lives with ME/CFS and is still searching for something that helps.',
    b3Title: 'So we built Juno to keep the record.',
    b3Body: 'Tell Juno how you feel, by text or voice. It turns your days into a summary your doctor can understand quickly.',
    next: 'Next',
    cta: 'Show me how',
  },
  when: { // v3 spec
    q: 'When should I check in?',
    sub: 'One short message. Answer in a tap.',
    morningHint: 'Before the day gets going',
    afternoonHint: 'A quick pause midday',
    eveningHint: 'Looking back on the day',
    cta: 'Show me',
  },
  demo: { // v3 spec
    title: "Here's tomorrow's check‑in", // non-breaking hyphen keeps "check-in" on one line
    notifyTitle: 'Juno',
    notification: 'How are you today? Tap to tell me in a few words.',
    when: { morning: 'Tomorrow morning', afternoon: 'Tomorrow afternoon', evening: 'Tomorrow evening', none: 'Tomorrow' },
    greet: { morning: 'Morning.', afternoon: 'Afternoon.', evening: 'Evening.', none: 'Hi.' },
    ask: '{greet} How are you feeling today?',
    replies: ['Better than yesterday', 'About the same', 'Rough day'],
    logged: "Logged. That's day 2 on your doctor page.",
    caption: "That's it. One line a day.",
    cta: 'Got it',
  },
  meter: { // v3 spec
    title: 'Your doctor page',
    today: 'Today',
    health: 'Health',
    days: 'Days',
    routine: 'Routine',
    forecast: 'Up to {entries} entries by {date}',
    week: '7 entries by {date}',
    soon: "Today's entry is already on it",
  },
  flow: { part: 'Part {n} of 7' }, // v3 spec
  seg: { // v2: flow bar segment labels (spec keys seg.health.done -> seg.healthDone)
    today: 'Today',
    health: 'Your health',
    healthDone: 'Your health, done',
    days: 'Your days',
    daysDone: 'Your days, done',
    you: 'You',
    routine: 'Your routine', // v3 spec
    snapshot: 'Your snapshot',
    plan: 'Your plan',
  },
  known: { // v2 section 7.2
    title: 'What I know so far',
    today: "Today's entry",
    conditions: 'Conditions: {n}',
    conditionsNone: 'Conditions: still looking',
    symptoms: 'Symptoms: {n}',
    symptomsNone: 'Symptoms: none right now',
    meds: 'Medicines: {n}',
    medsNone: 'Medicines: add later',
    appt: 'Next appointment: {date}',
    apptNone: 'Next appointment: none booked',
    energy: 'Energy on a normal day',
  },
  card: { // v2 insight cards
    healthNext: 'Next: your days.',
    daysNext: 'Next: a little about you.',
    cta: 'Keep going',
  },
  commit: { // v2 screen 17
    q: 'Can you tell me one line a day?',
    sub: 'Like the one you wrote earlier.',
    optMost: 'Yes, most days',
    optGood: 'On good days',
    optUnsure: 'Not sure yet',
    whenQ: 'When suits you?',
    morning: 'Morning',
    afternoon: 'Afternoon',
    evening: 'Evening',
    reply: 'Deal. Bad days count too. Miss one and nothing breaks.',
    replyUnsure: "That's fine. I'll be here when you are.",
    cta: "I'm in",
  },
  project: { // v2 section 7.3; text before " · " is the node title, after it the sub-line
    title: 'What this page becomes',
    today: 'Today · 1 entry',
    todayAppt: 'Today, your appointment · Your first entry is on the page',
    week: 'Day 7 · 7 entries, side by side',
    appt: '{date}, your appointment · Up to {entries} entries on one page',
    month: 'Day 30 · A month on one page',
    note: 'Counts assume one entry a day. Miss a day and nothing breaks.',
    cta: 'Save my snapshot',
  },
  debug: {
    flags: 'Experiments (on = new)', // NEW
    experiment: 'Experiment: conditions screen (6)', // NEW
    title: 'Jump to a screen',
    reset: 'Reset and start over',
    demo: 'Fill with demo answers',
  },
} as const;

export function fill(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (m, k) => (k in values ? String(values[k]) : m));
}

export function joinList(items: readonly string[]) {
  if (items.length <= 1) return items.join('');
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
}
