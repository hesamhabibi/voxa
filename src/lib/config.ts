// Product rules agreed with the teacher. Change values here, not in components.

export const APP_NAME = "Voxa"

export const SELF_TALK = {
  defaultMinutes: 15,
  minMinutes: 5,
  maxMinutes: 30,
  /** Already-practiced questions allowed to reappear per day. */
  maxRepeatedQuestionsPerDay: 2,
  sampleSentenceTargets: [5, 7, 10] as const,
} as const

export const SELF_DICTIONARY = {
  requiredSentencesPerWord: 5,
  aiExamplesPerBatch: 3,
} as const

export const REVIEW = {
  defaultWordsPerNight: 30,
  options: [30, 50] as const,
  /** Minimum days before a correctly answered word comes back. Final values follow the Ebbinghaus plan. */
  minDaysAfterCorrect: 2,
} as const
