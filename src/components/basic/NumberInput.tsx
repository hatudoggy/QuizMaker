//components
import { Unstable_NumberInput as MNumberInput, NumberInputProps, NumberInputOwnerState } from '@mui/base/Unstable_NumberInput';

//utils
import { cn } from "../../utils/cn";


const style = {
  normal: '',
  inline: 'bg-transparent'
}

type StyleType = keyof typeof style;

interface Props extends NumberInputProps{
  className?: string
  styleType: StyleType
  
}

function NumberInput({className, styleType, ...props}: Props){


  return(
    <MNumberInput
      {...props}
      className={cn("focus:outline-none", style[styleType], className)}
      slotProps={{
        root: (ownerState: NumberInputOwnerState) => {
          return {
            className: cn(
              'grid grid-cols-[1fr_8px] grid-rows-2 rounded-sm outline-none pl-1',

            ),
          };
        },
        input: (ownerState: NumberInputOwnerState) => {
          return {
            className: cn(
              'col-start-1 col-end-2 row-start-1 row-end-3 text-sm font-sans leading-normal text-slate-900 bg-inherit border-0 rounded-[inherit] text-white outline-none hover:bg-neutral-300 hover:bg-opacity-5 px-1 py-1',
            ),
          };
        },
        incrementButton: (ownerState: NumberInputOwnerState) => {
          return {
            children: '▴',
            className: cn(
              'font-[system-ui] flex flex-row flex-nowrap justify-center items-center p-0 w-[14px] h-[13px] outline-none text-sm box-border leading-[1.2] rounded-t-md text-slate-900 dark:text-slate-300 transition-all duration-[120ms] hover:cursor-pointer hover:bg-opacity-60 hover:bg-blue-500 hover:text-slate-50 col-start-3 col-end-3 row-start-1 row-end-2',
            ),
          };
        },
        decrementButton: (ownerState: NumberInputOwnerState) => {
          return {
            children: '▾',
            className: cn(
              'font-[system-ui] flex flex-row flex-nowrap justify-center items-center p-0 w-[14px] h-[13px] outline-none text-sm box-border leading-[1.2] rounded-b-md text-slate-900 dark:text-slate-300 transition-all duration-[120ms] hover:cursor-pointer hover:bg-opacity-60 hover:bg-blue-500 hover:text-slate-50 col-start-3 col-end-3 row-start-2 row-end-3',
            ),
          };
        },
      }}
    />
  )
}

export default NumberInput