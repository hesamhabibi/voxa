import type { SpeakingQuestion } from "@/types"

// TODO: fill with 100 IELTS Speaking Part 1 questions (unrated for now).
// Each question needs 3 samples with ~5, ~7 and ~10 sentences.
export const questions: SpeakingQuestion[] = [
  {
    id: "p1-001",
    category: "ielts-part-1",
    level: "unrated",
    text: "Where do you live?",
    samples: [
      {
        id: "p1-001-s1",
        sentences: [
          "I live in Tehran, the capital of Iran.",
          "It is a huge and busy city.",
          "My neighbourhood is quite calm, though.",
          "There is a small park near my house.",
          "I really enjoy living there.",
        ],
      },
      {
        id: "p1-001-s2",
        sentences: [
          "I currently live in an apartment in the north of Tehran.",
          "I have been living there with my family for about ten years.",
          "The area is famous for its cool weather and green streets.",
          "Everything I need, like shops and cafés, is within walking distance.",
          "The only downside is the heavy traffic during rush hour.",
          "Still, I can see the mountains from my window.",
          "So overall, I would say it is a pleasant place to live.",
        ],
      },
      {
        id: "p1-001-s3",
        sentences: [
          "At the moment I live in Shiraz, a city in the south of Iran.",
          "It is well known for its poets, gardens and historical sites.",
          "I moved there a few years ago because of my job.",
          "My flat is in an old neighbourhood with narrow streets.",
          "What I love most is the friendly atmosphere among neighbours.",
          "In spring, the whole city smells of orange blossoms.",
          "Of course, summers can be extremely hot and dry.",
          "Public transport is not as developed as in bigger cities.",
          "However, the cost of living is relatively reasonable.",
          "All in all, I feel lucky to live in such a beautiful city.",
        ],
      },
    ],
  },
]
