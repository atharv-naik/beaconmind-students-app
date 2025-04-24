var testQuestions = [
  {
    id: "q1",
    text: "How are you feeling today?",
    type: "mcq",
    options: [
      { id: "1", value: "happy", label: "Happy 😊", score: 5, next: "q5" }, // Skips to Q5
      { id: "2", value: "sad", label: "Sad 😞", score: 2, next: "q2" }, // Goes to Q2
      { id: "3", value: "neutral", label: "Neutral 😐", score: 3, next: "q3" }, // Goes to Q3
    ],
  },
  {
    id: "q2",
    text: "Have you been feeling this way for more than a week?",
    type: "mcq",
    options: [
      { id: "1", value: "yes", label: "Yes", score: 2, next: "q4" }, // Goes to Q4
      { id: "2", value: "no", label: "No", score: 1, next: "q5" }, // Skips to Q5
    ],
  },
  {
    id: "q3",
    text: "Are you feeling stressed?",
    type: "mcq",
    options: [
      { id: "1", value: "yes", label: "Yes", score: 3, next: "q4" }, // Goes to Q4
      { id: "2", value: "no", label: "No", score: 1, next: "q5" }, // Skips to Q5
    ],
  },
  {
    id: "q4",
    text: "How do you usually cope with stress or sadness?",
    type: "mcq",
    options: [
      {
        id: "1",
        value: "exercise",
        label: "Exercise 🏃",
        score: 3,
        next: "q5",
      },
      {
        id: "2",
        value: "meditation",
        label: "Meditation 🧘",
        score: 3,
        next: "q5",
      },
      {
        id: "2",
        value: "talking",
        label: "Talking to someone 🗣️",
        score: 2,
        next: "q5",
      },
      { id: "4", value: "other", label: "Other", score: 1, next: "q5" },
    ],
  },
  {
    id: "q5",
    text: "What's one thing you are grateful for today?",
    type: "text",
  },
];

var asqQuestions = [
  {
    id: "1",
    qid: "1",
    text: "In the past few weeks, have you wished you were dead?",
    // type: 'msq',
    type: "mcq",
    options: [
      { id: "1", value: "yes", label: "Yes", score: 1, next: "2y" },
      { id: "2", value: "no", label: "No", score: 0, next: "2n" },
      // { id: '3', value: 'unsure', label: 'Unsure', score: 1, next: 'q2n' },
    ],
    // optional: true,
    // next: '2y',
    // getNextRoute: (ids) => {
    //   const has1 = ids.includes('1');
    //   const has2 = ids.includes('2');
    //   const has3 = ids.includes('3');

    //   if (has1 && (has2 || has3)) {
    //     return '5a';
    //   } else if (has1) {
    //     return '4ay';
    //   } else if (has2 || has3) {
    //     return '3y';
    //   }

    //   return null;
    // }
  },
  {
    id: "2y",
    qid: "2",
    text: "In the past few weeks, have you felt that you or your family would be better off if you were dead?",
    type: "mcq",
    options: [
      { id: "1", value: "yes", label: "Yes", score: 1, next: "3y" },
      { id: "2", value: "no", label: "No", score: 0, next: "3y" },
    ],
    // optional: true,
    // next: '3y',
  },
  {
    id: "2n",
    qid: "2",
    text: "In the past few weeks, have you felt that you or your family would be better off if you were dead?",
    type: "mcq",
    options: [
      { id: "1", value: "yes", label: "Yes", score: 1, next: "3y" },
      { id: "2", value: "no", label: "No", score: 0, next: "3n" },
    ],
    // optional: true,
    // next: '3n',
  },
  {
    id: "3y",
    qid: "3",
    text: "In the past week, have you been having thoughts about killing yourself?",
    type: "mcq",
    options: [
      { id: "1", value: "yes", label: "Yes", score: 1, next: "4ay" },
      { id: "2", value: "no", label: "No", score: 0, next: "4ay" },
    ],
  },
  {
    id: "3n",
    qid: "3",
    text: "In the past week, have you been having thoughts about killing yourself?",
    type: "mcq",
    options: [
      { id: "1", value: "yes", label: "Yes", score: 1, next: "4ay" },
      { id: "2", value: "no", label: "No", score: 0, next: "4an" },
    ],
  },
  {
    id: "4ay",
    qid: "4a",
    text: "Have you ever tried to kill yourself?",
    type: "mcq",
    options: [
      { id: "1", value: "yes", label: "Yes", score: 1, next: "4by" },
      { id: "2", value: "no", label: "No", score: 0, next: "5a" },
    ],
  },
  {
    id: "4an",
    qid: "4a",
    text: "Have you ever tried to kill yourself?",
    type: "mcq",
    options: [
      { id: "1", value: "yes", label: "Yes", score: 1, next: "4by" },
      { id: "2", value: "no", label: "No", score: 0, next: null }, // End
    ],
  },
  {
    id: "4by",
    qid: "4b",
    text: "Please describe how and when.",
    type: "text",
    next: "5a",
    // tag: 'S',
  },
  {
    id: "5a",
    qid: "5a",
    text: "Are you having thoughts of killing yourself right now?",
    type: "mcq",
    options: [
      { id: "1", value: "yes", label: "Yes", score: 1, next: "5b" },
      { id: "2", value: "no", label: "No", score: 0, next: null },
    ],
  },
  {
    id: "5b",
    qid: "5b",
    text: "Please describe.",
    type: "text",
    next: null,
    // tag: 'S',
  },
];


const whoAssistQuestions = [
  // initial qusetions
  {
    id: "1",
    qid: "1",
    text: "Have you ever used any substance in your life like tobacco, alcohol, or any other drug?",
    type: "mcq",
    noscore: true,
    options: [
      { id: "1", value: "yes", label: "Yes", next: "2" },
      { id: "2", value: "no", label: "No", next: null },
    ],
  },
  {
    id: "2",
    qid: "2",
    text: "Which substances have you used in your life? Select all that apply.",
    type: "msq",
    noscore: true,
    options: [
      { id: "1", value: "tobacco", label: "Tobacco" },
      { id: "2", value: "alcohol", label: "Alcohol" },
      { id: "3", value: "ganja", label: "Ganja" },
      { id: "4", value: "other", label: "Other" },
    ],
    getNextRoute: (ids: string | string[]) => {
      const has1 = ids.includes("1");
      const has2 = ids.includes("2");
      const has3 = ids.includes("3");
      const has4 = ids.includes("4");

      if (has1 && (has2 || has3 || has4)) return "w3";
      if (has1) return "f3";
      if (has2 || has3 || has4) return "s3";

      return null;
    },
  },

  // HSI + CRAFFT
  {
    id: "w3",
    qid: "3",
    text: "On the days that you smoke, how soon after you wake up do you have your first cigarette?",
    type: "mcq",
    options: [
      {
        id: "1",
        value: "within 5 minutes",
        label: "Within 5 minutes",
        score: 3,
      },
      { id: "2", value: "6-30 minutes", label: "6-30 minutes", score: 2 },
      { id: "3", value: "31-60 minutes", label: "31-60 minutes", score: 1 },
      {
        id: "4",
        value: "after 60 minutes",
        label: "After 60 minutes",
        score: 0,
      },
    ],
    tag: "HSI",
    next: "w4",
  },
  {
    id: "w4",
    qid: "4",
    text: "How many cigarettes do you typically smoke per day?",
    type: "mcq",
    options: [
      { id: "1", value: "10 or fewer", label: "10 or fewer", score: 0 },
      { id: "2", value: "11-20", label: "11-20", score: 1 },
      { id: "3", value: "21-30", label: "21-30", score: 2 },
      { id: "4", value: "31 or more", label: "31 or more", score: 3 },
    ],
    tag: "HSI",
    next: "w5",
  },
  {
    id: "w5",
    qid: "5",
    text: "Have you ever ridden in a CAR driven by someone (including yourself) who was high or had been using alcohol or drugs?",
    type: "mcq",
    options: [
      { id: "1", value: "yes", label: "Yes", score: 1 },
      { id: "2", value: "no", label: "No", score: 0 },
    ],
    tag: "CRAFFT",
    next: "w6",
  },
  {
    id: "w6",
    qid: "6",
    text: "Do you ever use alcohol or drugs to RELAX, feel better about yourself, or fit in?",
    type: "mcq",
    options: [
      { id: "1", value: "yes", label: "Yes", score: 1 },
      { id: "2", value: "no", label: "No", score: 0 },
    ],
    tag: "CRAFFT",
    next: "w7",
  },
  {
    id: "w7",
    qid: "7",
    text: "Do you ever use alcohol or drugs while you are by yourself, or ALONE?",
    type: "mcq",
    options: [
      { id: "1", value: "yes", label: "Yes", score: 1 },
      { id: "2", value: "no", label: "No", score: 0 },
    ],
    tag: "CRAFFT",
    next: "w8",
  },
  {
    id: "w8",
    qid: "8",
    text: "Do you ever FORGET things you did while using alcohol or drugs?",
    type: "mcq",
    options: [
      { id: "1", value: "yes", label: "Yes", score: 1 },
      { id: "2", value: "no", label: "No", score: 0 },
    ],
    tag: "CRAFFT",
    next: "w9",
  },
  {
    id: "w9",
    qid: "9",
    text: "Do your FAMILY or FRIENDS ever tell you that you should cut down on your drinking or drug use?",
    type: "mcq",
    options: [
      { id: "1", value: "yes", label: "Yes", score: 1 },
      { id: "2", value: "no", label: "No", score: 0 },
    ],
    tag: "CRAFFT",
    next: "w10",
  },
  {
    id: "w10",
    qid: "10",
    text: "Have you gotten into TROUBLE while you were using alcohol or drugs?",
    type: "mcq",
    options: [
      { id: "1", value: "yes", label: "Yes", score: 1 },
      { id: "2", value: "no", label: "No", score: 0 },
    ],
    tag: "CRAFFT",
    next: null,
  },

  // HSI
  {
    id: "f3",
    qid: "3",
    text: "On the days that you smoke, how soon after you wake up do you have your first cigarette?",
    type: "mcq",
    options: [
      {
        id: "1",
        value: "within 5 minutes",
        label: "Within 5 minutes",
        score: 3,
      },
      { id: "2", value: "6-30 minutes", label: "6-30 minutes", score: 2 },
      { id: "3", value: "31-60 minutes", label: "31-60 minutes", score: 1 },
      {
        id: "4",
        value: "after 60 minutes",
        label: "After 60 minutes",
        score: 0,
      },
    ],
    tag: "HSI",
    next: "f4",
  },
  {
    id: "f4",
    qid: "4",
    text: "How many cigarettes do you typically smoke per day?",
    type: "mcq",
    options: [
      { id: "1", value: "10 or fewer", label: "10 or fewer", score: 0 },
      { id: "2", value: "11-20", label: "11-20", score: 1 },
      { id: "3", value: "21-30", label: "21-30", score: 2 },
      { id: "4", value: "31 or more", label: "31 or more", score: 3 },
    ],
    tag: "HSI",
    next: null,
  },

  // CRAFFT
  {
    id: "s3",
    qid: "5",
    text: "Have you ever ridden in a CAR driven by someone (including yourself) who was high or had been using alcohol or drugs?",
    type: "mcq",
    options: [
      { id: "1", value: "yes", label: "Yes", score: 1 },
      { id: "2", value: "no", label: "No", score: 0 },
    ],
    tag: "CRAFFT",
    next: "s4",
  },
  {
    id: "s4",
    qid: "6",
    text: "Do you ever use alcohol or drugs to RELAX, feel better about yourself, or fit in?",
    type: "mcq",
    options: [
      { id: "1", value: "yes", label: "Yes", score: 1 },
      { id: "2", value: "no", label: "No", score: 0 },
    ],
    tag: "CRAFFT",
    next: "s5",
  },
  {
    id: "s5",
    qid: "7",
    text: "Do you ever use alcohol or drugs while you are by yourself, or ALONE?",
    type: "mcq",
    options: [
      { id: "1", value: "yes", label: "Yes", score: 1 },
      { id: "2", value: "no", label: "No", score: 0 },
    ],
    tag: "CRAFFT",
    next: "s6",
  },
  {
    id: "s6",
    qid: "8",
    text: "Do you ever FORGET things you did while using alcohol or drugs?",
    type: "mcq",
    options: [
      { id: "1", value: "yes", label: "Yes", score: 1 },
      { id: "2", value: "no", label: "No", score: 0 },
    ],
    tag: "CRAFFT",
    next: "s7",
  },
  {
    id: "s7",
    qid: "9",
    text: "Do your FAMILY or FRIENDS ever tell you that you should cut down on your drinking or drug use?",
    type: "mcq",
    options: [
      { id: "1", value: "yes", label: "Yes", score: 1 },
      { id: "2", value: "no", label: "No", score: 0 },
    ],
    tag: "CRAFFT",
    next: "s8",
  },
  {
    id: "s8",
    qid: "10",
    text: "Have you gotten into TROUBLE while you were using alcohol or drugs?",
    type: "mcq",
    options: [
      { id: "1", value: "yes", label: "Yes", score: 1 },
      { id: "2", value: "no", label: "No", score: 0 },
    ],
    tag: "CRAFFT",
    next: null,
  },
];

const dass21Questions = [
  {
    id: "d1",
    qid: "1",
    type: "mcq",
    text: "Over the past week, have you found it difficult to relax or calm yourself down, even when you had time to unwind?",
    tag: "S",
    next: "d2",
    options: [
      { id: "0", label: "Not at all", value: "not-at-all", score: 0 },
      { id: "1", label: "Sometimes", value: "sometimes", score: 1 },
      { id: "2", label: "Quite often", value: "quite-often", score: 2 },
      { id: "3", label: "Almost always", value: "almost-always", score: 3 },
    ],
  },
  {
    id: "d2",
    qid: "2",
    type: "mcq",
    text: "Have you noticed your mouth feeling unexpectedly dry, especially in moments of tension or stress?",
    tag: "A",
    next: "d3",
    options: [
      { id: "0", label: "Not at all", value: "not-at-all", score: 0 },
      { id: "1", label: "Sometimes", value: "sometimes", score: 1 },
      { id: "2", label: "Quite often", value: "quite-often", score: 2 },
      { id: "3", label: "Almost always", value: "almost-always", score: 3 },
    ],
  },
  {
    id: "d3",
    qid: "3",
    type: "mcq",
    text: "Have you struggled to experience any positive emotions, even in situations that would usually bring you joy?",
    tag: "D",
    next: "d4",
    options: [
      { id: "0", label: "Not at all", value: "not-at-all", score: 0 },
      { id: "1", label: "Sometimes", value: "sometimes", score: 1 },
      { id: "2", label: "Quite often", value: "quite-often", score: 2 },
      { id: "3", label: "Almost always", value: "almost-always", score: 3 },
    ],
  },
  {
    id: "d4",
    qid: "4",
    type: "mcq",
    text: "Have you experienced shortness of breath or rapid breathing without physical exertion?",
    tag: "A",
    next: "d5",
    options: [
      { id: "0", label: "Not at all", value: "not-at-all", score: 0 },
      { id: "1", label: "Sometimes", value: "sometimes", score: 1 },
      { id: "2", label: "Quite often", value: "quite-often", score: 2 },
      { id: "3", label: "Almost always", value: "almost-always", score: 3 },
    ],
  },
  {
    id: "d5",
    qid: "5",
    type: "mcq",
    text: "Have you found it hard to gather motivation to begin tasks, even when they needed to be done?",
    tag: "D",
    next: "d6",
    options: [
      { id: "0", label: "Not at all", value: "not-at-all", score: 0 },
      { id: "1", label: "Sometimes", value: "sometimes", score: 1 },
      { id: "2", label: "Quite often", value: "quite-often", score: 2 },
      { id: "3", label: "Almost always", value: "almost-always", score: 3 },
    ],
  },
  {
    id: "d6",
    qid: "6",
    type: "mcq",
    text: "Have you felt like you overreacted to small situations or problems?",
    tag: "S",
    next: "d7",
    options: [
      { id: "0", label: "Not at all", value: "not-at-all", score: 0 },
      { id: "1", label: "Sometimes", value: "sometimes", score: 1 },
      { id: "2", label: "Quite often", value: "quite-often", score: 2 },
      { id: "3", label: "Almost always", value: "almost-always", score: 3 },
    ],
  },
  {
    id: "d7",
    qid: "7",
    type: "mcq",
    text: "Have you experienced trembling or shakiness, even when not cold or ill?",
    tag: "A",
    next: "d8",
    options: [
      { id: "0", label: "Not at all", value: "not-at-all", score: 0 },
      { id: "1", label: "Sometimes", value: "sometimes", score: 1 },
      { id: "2", label: "Quite often", value: "quite-often", score: 2 },
      { id: "3", label: "Almost always", value: "almost-always", score: 3 },
    ],
  },
  {
    id: "d8",
    qid: "8",
    type: "mcq",
    text: "Have you felt like your body or mind is constantly on edge or burning nervous energy?",
    tag: "S",
    next: "d9",
    options: [
      { id: "0", label: "Not at all", value: "not-at-all", score: 0 },
      { id: "1", label: "Sometimes", value: "sometimes", score: 1 },
      { id: "2", label: "Quite often", value: "quite-often", score: 2 },
      { id: "3", label: "Almost always", value: "almost-always", score: 3 },
    ],
  },
  {
    id: "d9",
    qid: "9",
    type: "mcq",
    text: "Have you worried about being in situations where you might panic or embarrass yourself?",
    tag: "A",
    next: "d10",
    options: [
      { id: "0", label: "Not at all", value: "not-at-all", score: 0 },
      { id: "1", label: "Sometimes", value: "sometimes", score: 1 },
      { id: "2", label: "Quite often", value: "quite-often", score: 2 },
      { id: "3", label: "Almost always", value: "almost-always", score: 3 },
    ],
  },
  {
    id: "d10",
    qid: "10",
    type: "mcq",
    text: "Have you felt like there was nothing to look forward to in life?",
    tag: "D",
    next: "d11",
    options: [
      { id: "0", label: "Not at all", value: "not-at-all", score: 0 },
      { id: "1", label: "Sometimes", value: "sometimes", score: 1 },
      { id: "2", label: "Quite often", value: "quite-often", score: 2 },
      { id: "3", label: "Almost always", value: "almost-always", score: 3 },
    ],
  },
  {
    id: "d11",
    qid: "11",
    type: "mcq",
    text: "Have you found yourself feeling agitated or restless more frequently than usual?",
    tag: "S",
    next: "d12",
    options: [
      { id: "0", label: "Not at all", value: "not-at-all", score: 0 },
      { id: "1", label: "Sometimes", value: "sometimes", score: 1 },
      { id: "2", label: "Quite often", value: "quite-often", score: 2 },
      { id: "3", label: "Almost always", value: "almost-always", score: 3 },
    ],
  },
  {
    id: "d12",
    qid: "12",
    type: "mcq",
    text: "Have you struggled to fully relax even when in comfortable or familiar settings?",
    tag: "S",
    next: "d13",
    options: [
      { id: "0", label: "Not at all", value: "not-at-all", score: 0 },
      { id: "1", label: "Sometimes", value: "sometimes", score: 1 },
      { id: "2", label: "Quite often", value: "quite-often", score: 2 },
      { id: "3", label: "Almost always", value: "almost-always", score: 3 },
    ],
  },
  {
    id: "d13",
    qid: "13",
    type: "mcq",
    text: "Have you felt persistently downhearted, sad, or emotionally heavy?",
    tag: "D",
    next: "d14",
    options: [
      { id: "0", label: "Not at all", value: "not-at-all", score: 0 },
      { id: "1", label: "Sometimes", value: "sometimes", score: 1 },
      { id: "2", label: "Quite often", value: "quite-often", score: 2 },
      { id: "3", label: "Almost always", value: "almost-always", score: 3 },
    ],
  },
  {
    id: "d14",
    qid: "14",
    type: "mcq",
    text: "Have you felt unusually frustrated or impatient when something or someone interrupted you?",
    tag: "S",
    next: "d15",
    options: [
      { id: "0", label: "Not at all", value: "not-at-all", score: 0 },
      { id: "1", label: "Sometimes", value: "sometimes", score: 1 },
      { id: "2", label: "Quite often", value: "quite-often", score: 2 },
      { id: "3", label: "Almost always", value: "almost-always", score: 3 },
    ],
  },
  {
    id: "d15",
    qid: "15",
    type: "mcq",
    text: "Have you ever felt like you were on the verge of a panic attack?",
    tag: "A",
    next: "d16",
    options: [
      { id: "0", label: "Not at all", value: "not-at-all", score: 0 },
      { id: "1", label: "Sometimes", value: "sometimes", score: 1 },
      { id: "2", label: "Quite often", value: "quite-often", score: 2 },
      { id: "3", label: "Almost always", value: "almost-always", score: 3 },
    ],
  },
  {
    id: "d16",
    qid: "16",
    type: "mcq",
    text: "Have you found it difficult to feel excited or enthusiastic about anything?",
    tag: "D",
    next: "d17",
    options: [
      { id: "0", label: "Not at all", value: "not-at-all", score: 0 },
      { id: "1", label: "Sometimes", value: "sometimes", score: 1 },
      { id: "2", label: "Quite often", value: "quite-often", score: 2 },
      { id: "3", label: "Almost always", value: "almost-always", score: 3 },
    ],
  },
  {
    id: "d17",
    qid: "17",
    type: "mcq",
    text: "Have you felt like you weren't worth much or had low self-worth?",
    tag: "D",
    next: "d18",
    options: [
      { id: "0", label: "Not at all", value: "not-at-all", score: 0 },
      { id: "1", label: "Sometimes", value: "sometimes", score: 1 },
      { id: "2", label: "Quite often", value: "quite-often", score: 2 },
      { id: "3", label: "Almost always", value: "almost-always", score: 3 },
    ],
  },
  {
    id: "d18",
    qid: "18",
    type: "mcq",
    text: "Have you noticed yourself being overly sensitive or easily irritated by minor issues?",
    tag: "S",
    next: "d19",
    options: [
      { id: "0", label: "Not at all", value: "not-at-all", score: 0 },
      { id: "1", label: "Sometimes", value: "sometimes", score: 1 },
      { id: "2", label: "Quite often", value: "quite-often", score: 2 },
      { id: "3", label: "Almost always", value: "almost-always", score: 3 },
    ],
  },
  {
    id: "d19",
    qid: "19",
    type: "mcq",
    text: "Have you noticed your heartbeat speeding up or skipping a beat, even when you weren't physically active?",
    tag: "A",
    next: "d20",
    options: [
      { id: "0", label: "Not at all", value: "not-at-all", score: 0 },
      { id: "1", label: "Sometimes", value: "sometimes", score: 1 },
      { id: "2", label: "Quite often", value: "quite-often", score: 2 },
      { id: "3", label: "Almost always", value: "almost-always", score: 3 },
    ],
  },
  {
    id: "d20",
    qid: "20",
    type: "mcq",
    text: "Have you felt scared or fearful without any clear reason?",
    tag: "A",
    next: "d21",
    options: [
      { id: "0", label: "Not at all", value: "not-at-all", score: 0 },
      { id: "1", label: "Sometimes", value: "sometimes", score: 1 },
      { id: "2", label: "Quite often", value: "quite-often", score: 2 },
      { id: "3", label: "Almost always", value: "almost-always", score: 3 },
    ],
  },
  {
    id: "d21",
    qid: "21",
    type: "mcq",
    text: "Have you ever felt like life lacked real meaning or purpose?",
    tag: "D",
    next: null,
    options: [
      { id: "0", label: "Not at all", value: "not-at-all", score: 0 },
      { id: "1", label: "Sometimes", value: "sometimes", score: 1 },
      { id: "2", label: "Quite often", value: "quite-often", score: 2 },
      { id: "3", label: "Almost always", value: "almost-always", score: 3 },
    ],
  },
];

export const asqAssessment = {
  id: "asq",
  name: "ASQ assessment",
  description:
    "A short self-report questionnaire designed to assess your levels of anxiety and stress over the past week.",
  questions: asqQuestions,
};

export const whoAssistAssessment = {
  id: "whoAssist",
  name: "WHO-ASSIST assessment",
  description:
    "A short self-report questionnaire designed to assess your levels of substance use and dependence.",
  questions: whoAssistQuestions,
};

export const dass21Assessment = {
  id: "dass21",
  name: "DASS-21 assessment",
  description:
    "A short self-report questionnaire designed to assess your levels of depression, anxiety, and stress over the past week.",
  questions: dass21Questions,
};

export const allAssessments = [
  whoAssistAssessment,
  asqAssessment,
  dass21Assessment,
];
