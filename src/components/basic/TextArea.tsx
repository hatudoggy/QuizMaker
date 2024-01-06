//components
import ReactTextareaAutosize, {TextareaAutosizeProps} from "react-textarea-autosize";

//utils
import { cn } from "../../utils/cn";

const style = {
  normal: '',
  inline: 'p-1 bg-transparent'
}

type StyleType = keyof typeof style;

interface Props extends TextareaAutosizeProps{
  className?: string
  styleType: StyleType
}

function TextArea({className, styleType, ...props}: Props){

  const hoverStyle = 'hover:bg-neutral-400 hover:bg-opacity-5'

  return(
    <ReactTextareaAutosize
      className={cn("focus:outline-none resize-none rounded-sm", style[styleType], hoverStyle, className)}
      {...props}
    />
  )
}

export default TextArea