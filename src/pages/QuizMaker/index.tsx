

import { Outlet } from "react-router-dom"


function QuizMaker() {

  return(
    <div
      className="w-full h-full"
    >
      <div
        className="m-auto py-10 w-full max-w-3xl h-full flex flex-col gap-10"
      >
        <Outlet/>

      </div>
    </div>
  )
}


export default QuizMaker