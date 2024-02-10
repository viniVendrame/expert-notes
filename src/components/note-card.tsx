import * as Dialog from '@radix-ui/react-dialog'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale' 
import { X } from 'lucide-react'

interface NoteCardProps {
  note: {
    id: string,
    date: Date
    content: string
  }
  onNoteDeleted: (id:string) => void
}


export function NoteCard({ note, onNoteDeleted }: NoteCardProps){
    return (
      <Dialog.Root>
        <Dialog.Trigger className='text-left rounded-md bg-slate-800 p-5 flex flex-col gap-3 overflow-hidden outline-none relative hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400'>
          <span className='text-sm font-medium text-stone-300'>
            {formatDistanceToNow(note.date, {locale: ptBR, addSuffix: true})}
          </span>
          <p className='text-sm leading-6 text-slate-400'>
            {note.content}
          </p>
          <div className='absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/60 to-black/0 pointer-events-none' />
        </Dialog.Trigger>

        <Dialog.Portal>
          <Dialog.Overlay className='inset-0 fixed bg-black/50'/>
          <Dialog.Content className='fixed inset-0 md:inset-auto md:left-1/2 md:top-1/2 bg-slate-700 md:-translate-x-1/2 md:-translate-y-1/2 overflow-hidden md:max-w-[640px] md:w-full md:h-[60vh] md:rounded-md flex flex-col outline-none'>
            <Dialog.Close className='absolute top-0 right-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100'>
              <X className='size-5'/>
            </Dialog.Close>
            
            <div className='flex flex-1 flex-col gap-3 p-5'>
              <span className='text-sm font-medium text-stone-300'>
                {formatDistanceToNow(note.date, {locale: ptBR, addSuffix: true})}
              </span>

              <p className='text-sm leading-6 text-slate-400'>
                {note.content}
              </p>
            </div>

            <button 
            type='button'
            className='font-medium w-full text-center text-sm bg-slate-800 py-4 outline-none text-slate-300 group'
            onClick={() => onNoteDeleted(note.id)}
            >
              Deseja <span className='text-red-400 group-hover:underline'>apagar essa nota</span>?
            </button>
          </Dialog.Content>
        </Dialog.Portal>

      </Dialog.Root>
    )
}