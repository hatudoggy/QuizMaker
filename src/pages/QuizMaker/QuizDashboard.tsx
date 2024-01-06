//hooks
import { useLiveQuery } from "dexie-react-hooks"

//components
import QuizHeaderBar from "../../components/QuizHeaderBar"
import QuizList from "./QuizList"

//db
import { db } from "../../services/db"

function QuizDashboard(){

  const allQuizzes = useLiveQuery(() => 
    db.quizDetail.toArray()
  )

  return(
    <div
      className="flex flex-col gap-3"
    >
      <QuizHeaderBar
        backLink=".."
        headerTitle="All Quizzes"
      />
      <QuizList
        quizList={allQuizzes}
      />
    </div>
  )
}

export default QuizDashboard