
//hooks
import { ReactNode, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useLiveQuery } from "dexie-react-hooks"

//components
import TextArea from "../../components/basic/TextArea"
import Button from "../../components/basic/Button"
import Selectable from "../../components/basic/Selectable"
import NumberInput from "../../components/basic/NumberInput"


//utils
import { cn } from "../../utils/cn"

//db
import { QuizObject, QuizType, db } from "../../services/db"
import QuizList from "./QuizList"
import ThreeDotsLoading from "../../components/ui/ThreeDotsLoading"


function QuizHome(){

  const [loadingNewQuiz, setLoadingNewQuiz] = useState(false)

  return(
    <>
      {
        loadingNewQuiz ?
          <QuizLoading />
          :
          <>
            <CreateQuizSection 
              setLoadingNewQuiz={setLoadingNewQuiz}
            />
            <RecentQuizSection />
          </>
         
      }

    </>
  )
}


function QuizLoading(){

  return(
    <div
      className="mx-auto h-52 w-full max-w-2xl grid place-content-center gap-3.5 bg-[#2B2B2B] rounded-lg"
    >
      <div
        className="flex flex-col gap-1 text-center"
      >
        <h1
          className="text-3xl"
        >
          Loading Quiz
        </h1>
        <p
          className="font-light text-xl text-white text-opacity-60"
        >
          Please Wait
        </p>
      </div>
      <ThreeDotsLoading />
    </div>
  )
}


interface CreateQuizSectionProps{
  setLoadingNewQuiz: React.Dispatch<React.SetStateAction<boolean>>
}

function CreateQuizSection(props: CreateQuizSectionProps){

  const [userDescription, setUserDescription] = useState('')
  const [quizType, setQuizType] = useState<QuizType>('multipleChoice')
  const [numberOfQuestions, setNumberOfQuestions] = useState<number>(1)
  const navigate = useNavigate()

  // const handleNav = () =>{
  //   navigate('quiz/1')
  // }

  const handleCreateQuiz = () => {

    if(!process.env.CREATEQUIZ_ENDPOINT){
      console.error("Can't find endpoint")
      return
    }
    props.setLoadingNewQuiz(true)
    fetch(process.env.CREATEQUIZ_ENDPOINT,{
      method: 'POST',
      body: JSON.stringify({
        quizType: quizType,
        numberOfQuestions: numberOfQuestions,
        userDescription: userDescription
      }),
      headers: {
        'Content-type': 'application/json'
      }
    })
    .then((res: Response) => res.json())
    .then(async (data: QuizObject[]) => {
      const newQuizObjects = await db.quizQuestion.add({
        items: data
      })

      const newQuizItem = await db.quizDetail.add({
        title: 'New Quiz',
        quizType: quizType,
        quizItems: numberOfQuestions,
        userPrompt: userDescription,
        quizId: Number(newQuizObjects),
        updatedAt: new Date(),
        createdAt: new Date()
      })
      navigate(`quiz/${newQuizItem}`)

      console.log(data)

    })

  }

  return(
    <div>
      <h1 className="text-2xl mb-2">Create a New Quiz</h1>
      <div
        className="p-7 flex flex-col gap-4 bg-[#2B2B2B] rounded-lg"
      >
        <LabeledComponent
          className="w-full"
          label="Describe the content of your quiz"
        >

          <TextArea 
            styleType="inline"
            minRows={5}
            maxRows={8}
            value={userDescription}
            onChange={(e)=>setUserDescription(e.target.value)}
          />
        </LabeledComponent>
        <div
          className="flex gap-2"
        >
          <LabeledComponent
            className=""
            label="Quiz Type"
          >
            <Selectable 
              styleType="inline"
              placeholder="Select quiz type..."
              options={[
                {value: 'trueOrFalse', label: 'True or False'},
                {value: 'multipleChoice', label: 'Multiple Choice'},
              ]}
              value={quizType}
              onChange={(type: string)=>setQuizType(type as QuizType)}
            />
          </LabeledComponent>
          <LabeledComponent
            className=""
            label="Number of Items"
          >
            <NumberInput
              className=""
              styleType="inline"
              min={1}
              value={numberOfQuestions}
              onChange={(e, val)=>setNumberOfQuestions(val || 0)}
            />
          </LabeledComponent>
        </div>
        <Button
          className="self-end px-4"
          styleType="primary"
          onClick={handleCreateQuiz}
        >
          Create Quiz
        </Button>


      </div>
    </div>
  )
}


function RecentQuizSection(){

  const recentQuizzes = useLiveQuery(() => 
    db.quizDetail.orderBy("createdAt").reverse().limit(3).toArray()
  )
  
  return(
    <div
      className="flex-1 flex flex-col gap-3"
    >

      <div
        className="flex items-end gap-6"
      >
        <h1 className="text-2xl">Recent Quizzes</h1>
        <Link to={`quiz`}><span className="text-sm text-blue-400 text-opacity-90 transition-colors hover:text-blue-300">{`View All >`}</span></Link>
      </div>
      <QuizList
        quizList={recentQuizzes}
      />
    </div>
  )
}


interface LabeledComponentProps {
  children?: ReactNode
  className?: string
  label?: string
}

function LabeledComponent(props: LabeledComponentProps) {

  return(
    <div
      className={cn("px-3 pt-1 pb-2 flex flex-col gap-1 border border-neutral-700 rounded-md", props.className)}
    >
      <label
        className="text-sm text-white text-opacity-40"
      >
        {props.label}
      </label>
      {props.children}
    </div>
  )
}
  
export default QuizHome