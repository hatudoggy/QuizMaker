import Dexie, { Table } from 'dexie'

export type QuizType = 'multipleChoice' | 'trueOrFalse'

export interface QuizDetail {
  id?: number
  title?: string
  quizType: QuizType
  quizItems: number
  userPrompt?: string
  createdAt: Date
  updatedAt: Date
  quizId: number

}

export interface ExternalQuizData {
  title?: string
  quizType: QuizType
  quizItems: number
  userPrompt?: string
  quiz: QuizObject[]
}

export interface QuizObject {
  question: string
  choices: string[]
  answer: number
}

export interface QuizQuestion {
  id?: number
  items: QuizObject[]
}

export class SubClassedDexie extends Dexie {
  quizDetail!: Table<QuizDetail>
  quizQuestion!: Table<QuizQuestion>

  constructor() {
    super('QuizMaker')
    this.version(1).stores({
      quizDetail: '++id, title, createdAt, updatedAt',
      quizQuestion: '++id'
    })
  }
}

export const db = new SubClassedDexie()