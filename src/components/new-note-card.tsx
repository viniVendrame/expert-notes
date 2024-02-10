import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { ChangeEvent, ChangeEventHandler, FormEvent, useState } from 'react'
import { toast } from 'sonner'

interface NewNoteCardProps {
  onNoteCreated: (content:string) => void
}

let speechRecognition: SpeechRecognition | null = null

export function NewNoteCard({ onNoteCreated }: NewNoteCardProps){
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(true)
  const [content, setContent] = useState('')
  const [isRecording, setIsRecording] = useState(false)

  function handleStartEditor(){
    setShouldShowOnboarding(false)
  }

  function handleContentChanged(event : ChangeEvent<HTMLTextAreaElement>){
    setContent(event.target.value)

    if(event.target.value === ''){
      setShouldShowOnboarding(true)
    }
  }

  function handleSaveNote(event : FormEvent){
    event.preventDefault()
    if(content === ''){
      toast.error('Não é possivel adicionar uma nota vazia')
      return
    }
    onNoteCreated(content)
    setContent('')
    setShouldShowOnboarding(true)
    toast.success('Nota criada com sucesso')
  }

  function handleOnboardingStatus(){
    setShouldShowOnboarding(true)
  }

  function handleStartRecording(){
    const isSpeechRecognitionEventApi = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window
    if(!isSpeechRecognitionEventApi){
      toast.warning('Infelizmente seu navegador não suporta a API de gravação!')
      return
    }
    
    setIsRecording(true)
    setShouldShowOnboarding(false)
    
    const SpeechRecognitionEventApi = window.SpeechRecognition || window.webkitSpeechRecognition
  
    speechRecognition = new SpeechRecognitionEventApi()

    //idioma
    speechRecognition.lang = 'pt-BR'

    //se for true só para de gravar quando selecionado manualmente para pausar
    speechRecognition.continuous = true

    //1 - retorna a opção que a API achar que tem maior similaridade com o que falei
    speechRecognition.maxAlternatives = 1

    //se for true vai trazendo o resultado conforme eu for falando, em tempo real
    speechRecognition.interimResults = true

    //chamada sempre que a API de audio ouvir algo
    speechRecognition.onresult = (event) => {
      const transcription = Array.from(event.results).reduce((text, result) => {
        return text.concat(result[0].transcript)
      }, '')

      setContent(transcription)
    }

    speechRecognition.onerror = (event) => {
      console.error(event)
    }

    speechRecognition.start()
  }


  function handleStopRecording(){
    setIsRecording(false)
    if(speechRecognition !== null){
      speechRecognition.stop()
    }
  }

  return(
    <Dialog.Root>
      <Dialog.Trigger className='rounded-md bg-slate-700 p-5 flex flex-col gap-3 text-left outline-none hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400'>
        <span className='text-sm font-medium text-stone-200'>Adicionar nota</span>
        <p className='text-sm leading-6 text-slate-400'>
          Grave uma nota em áudio que será convertida para texto automaticamente.
        </p>
      </Dialog.Trigger>


      <Dialog.Portal>
        <Dialog.Overlay className='inset-0 fixed bg-black/50'/>
        <Dialog.Content className='fixed inset-0 md:inset-auto md:left-1/2 md:top-1/2 bg-slate-700 md:-translate-x-1/2 md:-translate-y-1/2 overflow-hidden md:max-w-[640px] md:w-full md:h-[60vh] md:rounded-md flex flex-col outline-none'>
          <Dialog.Close className='absolute top-0 right-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100'>
            <X className='size-5' onClick={handleOnboardingStatus}/>
          </Dialog.Close>
          <form className='flex-1 flex flex-col'>
            <div className='flex flex-1 flex-col gap-3 p-5'>
              <span className='text-sm font-medium text-stone-300'>
                Adicionar nota
              </span>

              {shouldShowOnboarding ? (
                <p className='text-sm leading-6 text-slate-400'>
                  Comece <button type='button'onClick={handleStartRecording} className='font-medium hover:underline text-lime-400'>gravando uma nota</button> em áudio ou se preferir <button type='button' onClick={handleStartEditor} className='font-medium hover:underline text-lime-400'>utilize apenas texto</button>
                </p>
              ) : (
                <textarea 
                  placeholder='Comece a digitar...'
                  className='text-sm leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none'
                  autoFocus 
                  onChange={handleContentChanged}
                  value={content}
                />
              )}
            </div>

            {isRecording? (
              <button 
              type='submit'
              className='flex items-center justify-center gap-2 font-medium w-full text-center text-sm bg-slate-900 py-4 outline-none text-slate-300 hover:text-slate-100 '
              onClick={handleStopRecording}
              >
                <div className='size-3 rounded-full bg-red-500 animate-pulse'/>
                Gravando! (Clique para interromper)
              </button>
            ) : (
              <button 
              type='button'
              onClick={handleSaveNote}
              className='font-medium w-full text-center text-sm bg-lime-400 py-4 outline-none text-lime-950 hover:bg-lime-500'
              >
                Salvar nota
              </button>
            )}
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}