//hooks
import { ReactNode } from 'react'

//component
import * as Select from '@radix-ui/react-select'

//utils
import { cn } from '../../utils/cn'


const style = {
  default: 'py-2 px-2.5 border border-white border-opacity-10 rounded-md',
  inline: 'py-0.5 px-1.5 ',
}

type StyleType = keyof typeof style

interface SelectItem {
  value: string
  label: string
  icon?: ReactNode
}

interface Props {
  styleType?: StyleType
  placeholder?: string
  options: SelectItem[]
  value?: string
  onChange?: (value: string) => void
}

function Selectable(props: Props){

  return(
    <Select.Root
      value={props.value}
      onValueChange={props.onChange}
    >
      <Select.Trigger
        className={cn("flex items-center justify-between gap-5 min-w-44 outline-none rounded-sm hover:bg-neutral-300 hover:bg-opacity-5 radix-state-open:bg-neutral-300 radix-state-open:bg-opacity-10 radix-placeholder:text-white radix-placeholder:text-opacity-60", style[props.styleType || 'default'])}
      >
        <Select.Value placeholder={props.placeholder}/>
        <Select.Icon className='text-xs text-white text-opacity-60'/>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          className='w-[--radix-select-trigger-width] rounded-b-md bg-neutral-700'
          position='popper'
          align='center'
        >
          <Select.Viewport
            className='px-1 py-1.5'
          >
            {
              props.options.map((option, index)=>
                <SelectItem
                  key={index}
                  value={option.value}
                >
                  {option.label}
                </SelectItem>
              )
            }
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  )
}

interface SelectItemProps {
  children?: ReactNode
  value: string
}

function SelectItem(props: SelectItemProps){

  const highlightedStyle = 'radix-highlighted:bg-white radix-highlighted:bg-opacity-15'

  return(
    <Select.Item
      className={cn('px-2 py-1.5 outline-none cursor-default rounded ', highlightedStyle)}
      value={props.value}
    >
      <Select.ItemText>{props.children}</Select.ItemText>
    </Select.Item>
  )
}

export default Selectable