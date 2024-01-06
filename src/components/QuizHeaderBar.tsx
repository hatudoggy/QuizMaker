import { FaArrowLeft } from "react-icons/fa6";
import IconButton from "./basic/IconButton";
import { ReactNode } from "react";
import { Link } from "react-router-dom";


interface Props {
  backLink: string
  headerTitle?: string
  children?: ReactNode
}

function QuizHeaderBar(props: Props){

  return(
    <div
      className="sticky top-0 mb-2 flex"
    >
      <div
        className='flex items-center gap-2.5'
      >
        <Link to={props.backLink}>
          <IconButton 
            label='back' 
            className='text-xl h-fit translate-y-0.5'
          >
            <FaArrowLeft/>
          </IconButton>
        </Link>
        <h1
          className="font-medium text-2xl"
        >
          {props.headerTitle}
        </h1>
      </div>
      {props.children}
    </div>
  )
}

export default QuizHeaderBar