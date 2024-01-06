//hooks
import { useState } from 'react';
import { useLoaderData, useLocation } from 'react-router-dom';
import LZString from 'lz-string';

//components
import * as Progress from '@radix-ui/react-progress';
import * as RadioGroup from '@radix-ui/react-radio-group';
import Button from '../../components/basic/Button';
import * as Collapsible from '@radix-ui/react-collapsible';
import QuizHeaderBar from '../../components/QuizHeaderBar';
import LabelTag from '../../components/ui/LabelTag';

//icons
import { IoIosArrowDown } from "react-icons/io";

//utils
import { cn } from "../../utils/cn"

//db
import { ExternalQuizData, QuizDetail, QuizObject, QuizQuestion, db } from '../../services/db';



export const quizFormLoader = async ({ params }: any): Promise<QuizLoad | undefined> => {
  const quizDetailsData = await db.quizDetail.get(Number(params.quizId))
  const quizQuestionData = await db.quizQuestion.get(Number(quizDetailsData?.quizId))
  if(!quizDetailsData || !quizQuestionData){
    return
  }
  return {
    dataType: 'local',
    details: quizDetailsData, 
    questions: quizQuestionData
  }
}

export const externalQuizFormLoader = async ({ request }: any): Promise<QuizLoad | undefined> => {
  const compressedQuizData = new URL(request.url).searchParams.get('cqd')
  const decompressedData:ExternalQuizData = compressedQuizData ? JSON.parse(LZString.decompressFromEncodedURIComponent(compressedQuizData)) : null;

  return {
    dataType: 'external',
    details: decompressedData,
    questions: { items: decompressedData.quiz},
  }
}

type QuizLoad = LocalQuizPayload | ExternalQuizPayload

interface LocalQuizPayload {
  dataType: 'local'
  details: QuizDetail
  questions: QuizQuestion
}

interface ExternalQuizPayload {
  dataType: 'external'
  details: Omit<ExternalQuizData, "quiz">
  questions: QuizQuestion
}


interface UserAnswers {
  [key: string]: number | undefined
}

function QuizForm(){

  const data = useLoaderData() as QuizLoad

  //console.log(data)

  const quizObj = data.questions.items
  
  const initialAnswers: UserAnswers = Object.fromEntries(
    quizObj.map((_, index) => [`question_${index + 1}`, undefined])
  );

  const [userAnswers, setUserAnswers] = useState(initialAnswers)
  const [showResult, setShowResult] = useState(false)

  const [showAnswers, setShowAnswers] = useState(false)

  const resetUserAnswers = () => {
    const resetState = Object.fromEntries(
      Object.keys(userAnswers).map(key => [key, undefined])
    );
    setUserAnswers(resetState);
    window.location.reload();
  }

  return(
    <div>
      <HeaderBar 
        answeredItems={Object.values(userAnswers).filter(value => value !== undefined).length}
        showResult={showResult}
        resetAnswers={resetUserAnswers}
      />

      {
        showResult ?
          <>
            <QuizResult 
              quizObj={quizObj}
              userAnswers={userAnswers}
              resetAnswers={resetUserAnswers}
              setShowResult={setShowResult}
            />
            <Collapsible.Root
              open={showAnswers}
              onOpenChange={setShowAnswers}
              className='flex flex-col py-3'
            >
              <Collapsible.Trigger 
                className='w-fit mx-auto'
                asChild
              >
                <button
                  className='flex items-center gap-1.5 text-white text-opacity-40'
                >
                  {`${showAnswers ? 'Hide' : 'Show'} correct answers`} 
                  <IoIosArrowDown 
                    className={`${showAnswers && 'rotate-180'} translate-y-0.5`}
                  />
                </button>
              </Collapsible.Trigger>

              <Collapsible.Content >
                <QuizFormContainer 
                  quizObj={quizObj}
                  showResult={showResult}
                  userAnswers={userAnswers}
                  setUserAnswers={setUserAnswers}
                />
              </Collapsible.Content>
            </Collapsible.Root>
          </>
          :
          <>
            <QuizFormContainer 
              quizObj={quizObj}
              showResult={showResult}
              userAnswers={userAnswers}
              setUserAnswers={setUserAnswers}
            />
            <FooterBar 
              setShowResult={setShowResult}
            />
          </>
      }

      
    </div>
  )
}

interface HeaderBarProps{
  answeredItems: number 
  showResult: boolean
  resetAnswers: () => void
}

function HeaderBar(props: HeaderBarProps){

  const data = useLoaderData() as QuizLoad

  const quizItem = data.details
  const quizObj = data.questions.items
  const percent = props.answeredItems/quizObj.length * 100

  const linkSwitcher = (data: QuizLoad) => {
    const location = useLocation()
    switch(data.dataType){
      case 'local':
        return `../quiz/${data.details.id}`
      case 'external':
        return `../quiz/external${location.search}`
    }
  }

  return(
    <QuizHeaderBar
      backLink={linkSwitcher(data)}
      headerTitle={quizItem.title}
    >
      <div
        className='ml-3 self-end'
      >
        <LabelTag>  
          External
        </LabelTag>
      </div>

      {
        !props.showResult ?
          <div
            className='flex-1 flex items-end justify-end'
          >
            <div
              className="flex items-center gap-3 "
            >
              <span
                className='text-white text-opacity-50'
              >
                {`${props.answeredItems}/${quizObj.length}`}
              </span>
              <Progress.Root
                className='flex-1 relative h-5 w-40 bg-neutral-600 rounded-full overflow-hidden'
                value={percent}
              >
                <Progress.Indicator 
                  className='w-full h-full bg-blue-500 bg-opacity-90 rounded-[inherit]'
                  style={{ transform: `translateX(-${100 - percent}%)`}}
                />
              </Progress.Root>
              <button
                onClick={props.resetAnswers}
              >
                Reset
              </button>
            </div>
          </div>
          :
          null
      }

    </QuizHeaderBar>

  )
}

interface FooterBarProps{
  setShowResult: React.Dispatch<React.SetStateAction<boolean>>
}

function FooterBar(props: FooterBarProps){

  return(
    <div
      className='flex justify-between'
    >
      <div>
        {/* <Button>
          Back
        </Button> */}
      </div>
      <div>
        <Button
          className=' min-w-24'
          onClick={()=>props.setShowResult(true)}
        >
          Submit
        </Button>
      </div>
    </div>
  )
}


interface QuizResultProps{
  quizObj: QuizObject[]
  userAnswers: UserAnswers
  setShowResult: React.Dispatch<React.SetStateAction<boolean>>
  resetAnswers: () => void
}

function QuizResult (props: QuizResultProps){

  return(
    <div
      className='mt-3 mx-12 px-8 py-10 flex flex-col items-center gap-8 bg-[#2B2B2B] rounded-lg'
    >
      <div
        className='text-center'
      >
        <h1
          className='mb-2 font-light text-xl'
        >
          Your score is
        </h1>
        <h2
          className='text-4xl'
        >
          {`
            ${Object.keys(props.userAnswers).reduce(
              (acc, currentVal, index) => props.quizObj[index].answer === props.userAnswers[currentVal] ? acc + 1 : acc,
              0
            )}/${Object.keys(props.userAnswers).length}
          `}
        </h2>
      </div>

      <Button
        className=' min-w-24'
        onClick={()=>{
          props.resetAnswers()
          props.setShowResult(false)
        }}
      >
        Retry Quiz
      </Button>
    </div>
  )
}

interface QuizFormContainerProps{
  quizObj: QuizObject[]
  showResult: boolean
  userAnswers: UserAnswers
  setUserAnswers: React.Dispatch<React.SetStateAction<UserAnswers>>
}

function QuizFormContainer(props: QuizFormContainerProps) {

  return(
    <div
      className="py-3 px-16 flex flex-col gap-5"
    >
      {
        props.quizObj.map((quiz, index)=>
          <QuizQuestionItem 
            key={index}
            quizIndex={index}
            showResult={props.showResult}
            userAnswer={props.userAnswers[`question_${index+1}`]}
            setUserAnswer={props.setUserAnswers}
            correctAnswer={quiz.answer}
            questionText={quiz.question}
            questionChoices={quiz.choices}
          />
        )
      }

    </div>
  )
}

interface QuizQuestionItemProps{
  quizIndex: number
  showResult: boolean
  userAnswer?: number
  setUserAnswer: React.Dispatch<React.SetStateAction<UserAnswers>>
  correctAnswer: number
  questionText: string
  questionChoices: string[]
}

function QuizQuestionItem(props: QuizQuestionItemProps){


  const style = {
    default: 'border-2 border-transparent',
    answered: 'border-2 border-blue-400 border-opacity-60',
    resultCorrect: 'border-2 border-green-400',
    resultWrong: 'border-2 border-red-400'
  }

  const quizItemState = props.showResult ? props.userAnswer === props.correctAnswer ? 'resultCorrect' : 'resultWrong' : props.userAnswer !== undefined ? 'answered' : 'default'

  const handleValueChange = (e: string) => {
    props.setUserAnswer(prevState => ({
      ...prevState,
      [`question_${props.quizIndex + 1}`]: Number(e)
    }))
    
  }

  return(
    <div
      className="flex flex-col gap-1"
    >
      <p 
        className="text-sm text-white text-opacity-30"
      >
        {`Question ${props.quizIndex + 1}`}
      </p>
      <div
        className={cn("px-12 py-8 w-auto flex flex-col gap-8 bg-[#2B2B2B] rounded-lg", style[quizItemState])}
      >
        <p
          className="break-words"
        >
          {props.questionText}
        </p>

        <RadioGroup.Root
          className="flex flex-col gap-2.5"
          value={props.userAnswer?.toString()}
          onValueChange={handleValueChange}
        >
          {
            props.questionChoices.map((choice, index)=>
              <QuizQuestionChoice 
                key={index+choice}
                choiceIndex={index}
                choice={choice} 
                answered={index === props.userAnswer}
                result={
                  index === props.userAnswer || index === props.correctAnswer ?
                    props.showResult ? props.correctAnswer === index : undefined :
                    undefined
                }
                disabled={props.showResult}
              />
            )
          }
        </RadioGroup.Root>

      </div>
    </div>
  )
}

interface QuizQuestionChoiceProps{
  choiceIndex: number
  choice: string
  answered: boolean
  result?: boolean
  disabled?: boolean
}

function QuizQuestionChoice(props: QuizQuestionChoiceProps){


  //const quizItemState = props.result !== undefined ? 'result' : 'default'

  //style[quizItemState].default, !props.disabled && style[quizItemState].hover

  const radixStyle = {
    default: {
      unanswered: 'border-white border-opacity-20 enabled:hover:border-transparent enabled:hover:bg-blue-300 enabled:hover:bg-opacity-60',
      answered: 'enabled:radix-state-checked:border-transparent enabled:radix-state-checked:border-transparent enabled:radix-state-checked:bg-blue-400 enabled:radix-state-checked:bg-opacity-70 '
    },
    result: {
      correct: 'border-transparent bg-green-400 bg-opacity-60',
      wrong: 'border-transparent bg-red-400 bg-opacity-60',
    }

  }

  const styleState = props.result !== undefined ? props.result ? radixStyle['result'].correct : radixStyle['result'].wrong : radixStyle['default'].answered + radixStyle['default'].unanswered

  return(
    <RadioGroup.Item
      className={cn(`py-1.5 border rounded-xl `, styleState)}
      value={props.choiceIndex.toString()}
      disabled={props.disabled}
    >
      {props.choice}
    </RadioGroup.Item>
  )
}


export default QuizForm