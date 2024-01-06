import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
//hooks

//components
import App from './App.tsx'
import QuizMaker from './pages/QuizMaker/index.tsx';
import QuizHome from './pages/QuizMaker/QuizHome.tsx';
import QuizDashboard from './pages/QuizMaker/QuizDashboard.tsx';
import QuizForm, { externalQuizFormLoader, quizFormLoader } from './pages/QuizMaker/QuizForm.tsx';
import QuizDetails, { externalQuizLoader, quizDetailLoader } from './pages/QuizMaker/QuizDetails.tsx';


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "quiz-maker",
        element: <QuizMaker />,
        children:[
          {
            path: "",
            element: <QuizHome/>,
          },
          {
            path: "quiz",
            element: <QuizDashboard/>,
          },
          {
            path: "quiz/:quizId",
            loader: quizDetailLoader,
            element: <QuizDetails/>,
          },
          {
            path: "quiz/:quizId/form",
            loader: quizFormLoader,
            element: <QuizForm/>,
          },
          {
            path: "quiz/external",
            loader: externalQuizLoader,
            element: <QuizDetails/>,
          },
          {
            path: "quiz/external/form",
            loader: externalQuizFormLoader,
            element: <QuizForm/>,
          },
        ]
      }
    ]
  },

])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
