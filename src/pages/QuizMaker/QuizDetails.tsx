//hooks
import { Link, useLoaderData, useLocation } from "react-router-dom"
import { useLiveQuery } from "dexie-react-hooks";
import LZString from 'lz-string';

//components
import QuizHeaderBar from "../../components/QuizHeaderBar"
import Button from "../../components/basic/Button"
import IconButton from "../../components/basic/IconButton"
import * as Dialog from '@radix-ui/react-dialog';
import Modal from "../../components/Modal";
import LabelTag from "../../components/ui/LabelTag";

//icons
import { BsThreeDots } from "react-icons/bs";
import { FaShareSquare } from "react-icons/fa";
import { FaCopy } from "react-icons/fa";

//db
import { ExternalQuizData, QuizDetail, db } from "../../services/db"

//css
import "../../utils/ScrollBar.css"

function QuizDetails(){

  const loaderData = useLoaderData() as QuizLoaderPayload


  const quizTypeMap = {
    multipleChoice: 'Multiple Choice',
    trueOrFalse: 'True or False'
  } as Record<string, string>

  const dataTypeSwitcher = (type: DataType) =>{
    const location = useLocation()
    switch(type){
      case 'local':
        return 'form'
      case 'external':
        return `form${location.search}`
    }
  }

  return(
    <div
      className="flex flex-col gap-3"
    >
      <QuizHeaderBar 
        backLink="../quiz"
        headerTitle={loaderData.quizData.title}
      >
        {
          loaderData.dataType === 'local' ?
            <div
              className="self-end flex-1 pr-4 flex justify-end items-end gap-2.5 text-white text-opacity-80"
            >
              <Dialog.Root>
                <Dialog.Trigger asChild>
                  <IconButton
                    label="Share"
                    className="text-xl"
                    >
                    <FaShareSquare />
                  </IconButton>
                </Dialog.Trigger>
                <Modal
                  className="px-7 py-9 w-full max-w-md"
                  title="Generate Shareable Link"
                  description="Copy pasta"
                >
                  <ShareModal 
                    data={loaderData.quizData}
                  />
                </Modal>
              </Dialog.Root>
              <IconButton
                label="Options"
                className="text-xl"
              >
                <BsThreeDots />
              </IconButton>

            </div>
            :
            <div
              className="ml-3 self-end"
            >
              <LabelTag>
                External
              </LabelTag>
            </div>
        }

      </QuizHeaderBar>
      <div
        className=" w-full max-w-2xl mx-auto px-14 py-7 flex flex-col gap-1 bg-[#2B2B2B] rounded-lg"
      >
        <h1
          className="font-medium text-xl"
        >
          Details
        </h1>
        <div
          className="mb-6 grid grid-cols-[80px_1fr] items-end"
        >
          <LabeledDetail
            label="Prompt"
            text={loaderData.quizData.userPrompt || 'N/A'}
          />
          <LabeledDetail
            label="Type"
            text={quizTypeMap[loaderData.quizData.quizType]}
          />
          <LabeledDetail
            label="Items"
            text={loaderData.quizData.quizItems.toString()}
          />
          {
            loaderData.dataType === 'local' &&
              <LabeledDetail
                label="Created"
                text={loaderData.quizData.createdAt.toLocaleDateString()}
              />
          }
        </div>
        <Link
          className="self-center "
          to={dataTypeSwitcher(loaderData.dataType)}
        >
          <Button
            className="px-5 font-medium"
          >
            Start Quiz
          </Button>
        </Link>

      </div>
    </div>
  )
}


interface ShareModalProps{
  data: QuizDetail
}

function ShareModal(props: ShareModalProps) {

  const quizQuestionData = useLiveQuery(()=> db.quizQuestion.get(Number(props.data?.quizId)))

  const externalData: ExternalQuizData = {
    title: props.data.title,
    quizType: props.data.quizType,
    quizItems: props.data.quizItems,
    userPrompt: props.data.userPrompt,
    quiz: quizQuestionData?.items || []
  }
  
  const compressedQuizData = LZString.compressToEncodedURIComponent(JSON.stringify(externalData))
  
  const shareableLink = `${window.location.origin}/quiz-maker/quiz/external?cqd=${compressedQuizData}`


  return(
    <div
      className="flex gap-3.5"
    >
      <div
        className="hide-scroll px-3 py-2.5 bg-[#252525] shadow-inner rounded-md text-nowrap overflow-x-scroll"
      >
        {shareableLink}

      </div>
      <IconButton
        label="Copy Link"
        onClick={() => {navigator.clipboard.writeText(shareableLink)}}
      >
        <FaCopy />
      </IconButton>
    </div>
  )
}

interface LabeledDetailProps{
  label?: string
  text?: string
}

function LabeledDetail(props: LabeledDetailProps) {

  return(
    <>
      <p
        className=" text-white text-opacity-35"
      >
        {props.label}
      </p>
      <p
        className="text-lg"
      >
        {props.text}
      </p>
    </>


  )
}


export default QuizDetails

type DataType = 'local' | 'external'

// interface QuizLoaderPayload {
//   dataType: DataType,
//   quizData: QuizDetail | ExternalQuizData
// }

type QuizLoaderPayload = LocalQuizPayload | ExternalQuizPayload

interface LocalQuizPayload {
  dataType: 'local',
  quizData: QuizDetail
}

interface ExternalQuizPayload {
  dataType: 'external',
  quizData: ExternalQuizData
}

export const quizDetailLoader = async ({ params }: any): Promise<QuizLoaderPayload | undefined> => {
  const quizData = await db.quizDetail.get(Number(params.quizId))

  if (!quizData){
    return
  }

  return ({
    dataType: 'local',
    quizData: quizData,
  })
}

export const externalQuizLoader = async ({ request }: any): Promise<QuizLoaderPayload | undefined>  => {
  const compressedQuizData = new URL(request.url).searchParams.get('cqd')
  const decompressedData:ExternalQuizData = compressedQuizData ? JSON.parse(LZString.decompressFromEncodedURIComponent(compressedQuizData)) : null;

  return ({
    dataType: 'external',
    quizData: decompressedData
  })
}