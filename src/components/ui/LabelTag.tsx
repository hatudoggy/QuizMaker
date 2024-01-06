//hooks
import { ReactNode } from "react"

//utils
import { cn } from "../../utils/cn"



interface Props{
  children?: ReactNode
  className?: string
}

function LabelTag (props: Props){

  return(
    <div
      className={cn("py-1 px-2 bg-neutral-600 text-sm text-white text-opacity-80 bg-opacity-60 rounded-md", props.className)}
    >
      {props.children}
    </div>
  )
}

export default LabelTag