//hooks

//components
import { Link, useLocation } from "react-router-dom"
import { QuizDetail } from "../../services/db"

//icons
import { MdDateRange } from "react-icons/md";
import { RiNumbersFill } from "react-icons/ri";
import { RiDropdownList } from "react-icons/ri";


interface Props{
  quizList?: QuizDetail[]
}

function QuizList(props: Props){

  
  return(

    <div
      className="flex-1 grid grid-cols-3 gap-4"
    >
      {
        props.quizList &&
          props.quizList.map((item, index)=>
            <QuizItem 
              key={index}
              quizId={item.quizId}
              title={item.title}
              quizType={item.quizType}
              quizItems={item.quizItems}
              createdAt={item.createdAt}
              updatedAt={item.updatedAt}
            />
          )
      }

    </div>

  )
}

function QuizItem(props: QuizDetail){
  const location = useLocation()
  //console.log(location.pathname)
  const isInQuizDir = location.pathname === '/quiz-maker/quiz' 

  const quizTypeMap = {
    multipleChoice: 'Multiple Choice',
    trueOrFalse: 'True or False'
  } as Record<string, string>

  return(
    <Link
      className="px-4 py-3 h-fit flex flex-col gap-1 text-left bg-[#2B2B2B] rounded-md transition-all hover:bg-[#383838] hover:shadow-md"
      to={isInQuizDir ? `${props.quizId}` : `quiz/${props.quizId}`}
    >
      <h1 className="text-lg text-white text-opacity-90 font-medium">{props.title}</h1>

        <div
          className="flex items-center gap-1 text-white text-opacity-40"
        >
          <RiDropdownList />
          <p className="text-sm">{quizTypeMap[props.quizType]}</p>
        </div>
        <div
          className="flex items-center gap-1 text-white text-opacity-40"
        >
          <RiNumbersFill />
          <p className="text-sm">{`${props.quizItems} ${props.quizItems == 1 ? 'Item' : 'Items'}`}</p>
        </div>

      <div
        className="flex items-center gap-1 text-white text-opacity-40"
      >
        <MdDateRange />
        <p className="text-sm">{props.createdAt.toLocaleDateString()}</p>
      </div>
    </Link>

  )
}

export default QuizList