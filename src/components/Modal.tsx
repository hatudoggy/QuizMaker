//hooks
import { ReactNode } from 'react';

//components
import * as Dialog from '@radix-ui/react-dialog';
import { cn } from '../utils/cn';


interface Props {
  children?: ReactNode
  className?: string
  title?: string
  description?: string
  close?: boolean
}

function Modal(props: Props){

  return(
    <Dialog.Portal>
      <Dialog.Overlay 
        className='fixed inset-0 z-50 bg-black bg-opacity-30'
      />
      <Dialog.Content
        className={cn("fixed z-[51] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-5 bg-[#2e2e2e] rounded-lg", props.className)}
      >
        {
          props.title &&
            <Dialog.Title 
              className='font-medium text-xl'
            >
              {props.title}
            </Dialog.Title>
        }
        {
          props.description &&
            <Dialog.Description 
              className='text-white text-opacity-70'
            >
              {props.description}
            </Dialog.Description>
        }
        <div
          className='pt-4'
        >
          {
            props.children
          }
        </div>
        {
          props.close &&
            <Dialog.Close />
        }
      </Dialog.Content>
    </Dialog.Portal>
  )
}

export default Modal