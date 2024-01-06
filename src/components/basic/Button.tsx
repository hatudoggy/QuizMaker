//hooks
import { ButtonHTMLAttributes } from "react"

//utils
import { cn } from "../../utils/cn"

const style = {
  primary: 'p-2 bg-blue-500 rounded-xl',
  secondary: 'p-2 bg-neutral-500',
  inline: 'p-2',
}

type StyleType = keyof typeof style

interface Props extends ButtonHTMLAttributes<HTMLButtonElement>{
  className?: string
  size?: 'sm' | 'md' | 'lg'
  styleType?: StyleType
}

function Button({className, size, styleType, ...props}: Props){
  
  return(
    <button
      className={cn("hover:brightness-125 transition-all", style[styleType || 'primary'], className)}
      {...props}
    >
      {props.children}
    </button>
  )
}

export default Button