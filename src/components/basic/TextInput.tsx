
//types
import { InputHTMLAttributes } from "react";

//utils
import { cn } from "../../utils/cn";


const style = {
  normal: '',
  inline: 'bg-transparent'
}

type StyleType = keyof typeof style;

interface Props extends InputHTMLAttributes<HTMLInputElement>{
  className?: string
  styleType: StyleType
  
}

function TextInput({className, styleType, ...props}: Props){
  return(
    <input
      className={cn("px-1 py-2 focus:outline-none resize-none", style[styleType], className)}
      {...props}
    />
  )
}

export default TextInput