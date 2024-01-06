
//components
import * as AccessibleIcon from '@radix-ui/react-accessible-icon';
import * as Tooltip from '@radix-ui/react-tooltip';

//types
import { ButtonHTMLAttributes, ForwardedRef, forwardRef } from 'react';

//utils
import { cn } from '../../utils/cn';


interface Props extends ButtonHTMLAttributes<HTMLButtonElement>{
  label: string
  tooltip?: string
}

const IconButton = forwardRef(({label, tooltip, className, ...props}: Props, ref: ForwardedRef<HTMLButtonElement>)=>(
  <Tooltip.Provider
    delayDuration={200}
    >
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <button
          ref={ref}
          className={cn('', className)}
          {...props}
        >
          <AccessibleIcon.Root
            label={label}
          >
            {props.children}
          </AccessibleIcon.Root>
        </button>
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content
          className='py-1.5 px-3 z-[51] bg-black bg-opacity-50 rounded-lg'
          side='bottom'
          hideWhenDetached
        >
          {tooltip || label}
          <Tooltip.Arrow />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  </Tooltip.Provider>
))

// const IconButton = ({label, tooltip, className, ...props}: Props) =>{
//   return(
//     <Tooltip.Provider>
//       <Tooltip.Root
//         delayDuration={200}
//       >
//         <Tooltip.Trigger asChild>
//           <button
//             className={cn('', className)}
//             {...props}
//           >
//             <AccessibleIcon.Root
//               label={label}
//             >
//               {props.children}
//             </AccessibleIcon.Root>
//           </button>
//         </Tooltip.Trigger>
//         <Tooltip.Portal>
//           <Tooltip.Content
//             className='py-1.5 px-3 bg-black bg-opacity-50 rounded-lg'
//             side='bottom'
//           >
//             {tooltip || label}
//             <Tooltip.Arrow />
//           </Tooltip.Content>
//         </Tooltip.Portal>
//       </Tooltip.Root>
//     </Tooltip.Provider>
//   )
// }

export default IconButton