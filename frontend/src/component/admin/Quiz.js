import { useState } from "react"
import { useEffect } from "react"
import { json, useNavigate } from "react-router-dom"
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

export default () => {
    const alert = withReactContent(Swal)
    const navigate = useNavigate()
    const [allQuiz, setAllQuiz] = useState()


    const deleteQuiz = (delId) => {
        const delAlert = alert.mixin({
            customClass: {
                confirmButton: 'bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-6 rounded mx-2',
                cancelButton: 'bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-6 rounded mx-2'
            },
            buttonsStyling: false
        })

        delAlert.fire({
            title: "Are you sure?",
            text: `You want to delete quiz`,
            icons: "error",
            showCancelButton: true,
            reverseButtons: true,
            confirmButtonText: "Yes",
            cancelButtonText: "No"
        }).then(res => {
            if (res.isConfirmed) {
                fetch(`http://localhost:4000/quiz/${delId}`, { method: "DELETE", credentials: 'include' })
                    .then(res => {
                        if (res.status === 401)
                            navigate('/')
                        delAlert.fire({
                            title: "Deleted",
                            icon: "success"
                        })
                        loadQuiz();
                    })
            }
        })
    }

    const loadQuiz = () => {
        fetch("http://localhost:4000/quiz", { credentials: 'include' })
            .then(res => {
                if (res.status === 401)
                    navigate("/")
                return res.json()
            })
            .then(res => setAllQuiz(res))
    }

    useEffect(() => {
        loadQuiz()
    }, [])

    return <div className="w-full h-[96vh] flex flex-col gap-y-2 mt-4">
        <button onClick={() => navigate(`/admin/createquiz`)} className="py-1 px-6 w-fit bg-white rounded font-semibold hover:bg-teal-100 hover:font-bold hover:shadow-lg">Create Quiz</button>
        <div className="w-full h-[95%] flex flex-wrap gap-2 content-start">

            {allQuiz && allQuiz.length <= 0 && <h1 className="mx-auto font-bold text-gray-500">Quiz Not Found</h1>}
            {
                allQuiz && allQuiz.length > 0 && allQuiz.map(quiz => <div className="min-w-[49%] max-w-[49%] min-h-44 bg-white rounded p-2 flex gap-x-2">
                    <div className="min-h-20 max-h-20 min-w-28 max-w-28 rounded border flex items-center">
                        <img src={`http://localhost:4000/${quiz.image}`} />
                    </div>
                    <div className="w-full flex justify-between">
                        <div className="flex flex-col gap-y-1">
                            <h1 className="font-semibold">{quiz.name}</h1>
                            <h1 className="text-sm leading-4">{quiz.description}</h1>
                            <div className="flex gap-x-5 text-sm mt-1 text-gray-500 justify-between">
                                <div className="flex flex-col gap-x-4">
                                    <div className="flex items-center gap-1.5">
                                        <div className="h-1 w-1 rounded-full bg-gray-500"></div>
                                        <h1>{quiz.plays} plays</h1>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <div className="h-1 w-1 rounded-full bg-gray-500"></div>
                                        <h1>{quiz.questions.length} questions</h1>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <div className="h-1 w-1 rounded-full bg-gray-500"></div>
                                        <h1>{quiz.grade} grade</h1>
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-1.5">
                                        <div className="h-1 w-1 rounded-full bg-gray-500"></div>
                                        <h1>{quiz.subject}</h1>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <div className="h-1 w-1 rounded-full bg-gray-500"></div>
                                        <h1>{quiz.duration} min</h1>
                                    </div>
                                    {quiz.password!='null' && quiz.password!='null' && <div className="flex items-center gap-1.5">
                                        <div className="h-1 w-1 rounded-full bg-gray-500"></div>
                                        <h1> password {quiz.password}</h1>
                                    </div>}
                                </div>
                                <div className="flex flex-col border-2 h-fit px-3 py-px rounded text-black">
                                    <h1>invite code</h1>
                                    <h1 className="font-semibold tracking-widest text-2xl">
                                        {quiz.code}
                                    </h1>
                                </div>
                            </div>
                            <h1 className="text-sm font-semibold text-gray-600">created by {`${quiz.creator.firstname} ${quiz.creator.lastname}`}</h1>
                        </div>
                        <div className="flex flex-col gap-x-4 items-center">
                            <svg onClick={() => deleteQuiz(quiz._id)} className="h-7 hover:bg-gray-300 rounded p-1 stroke-red-500 fill-red-500" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 30 30">
                                <path d="M 14.984375 2.4863281 A 1.0001 1.0001 0 0 0 14 3.5 L 14 4 L 8.5 4 A 1.0001 1.0001 0 0 0 7.4863281 5 L 6 5 A 1.0001 1.0001 0 1 0 6 7 L 24 7 A 1.0001 1.0001 0 1 0 24 5 L 22.513672 5 A 1.0001 1.0001 0 0 0 21.5 4 L 16 4 L 16 3.5 A 1.0001 1.0001 0 0 0 14.984375 2.4863281 z M 6 9 L 7.7929688 24.234375 C 7.9109687 25.241375 8.7633438 26 9.7773438 26 L 20.222656 26 C 21.236656 26 22.088031 25.241375 22.207031 24.234375 L 24 9 L 6 9 z"></path>
                            </svg>
                            <svg onClick={() => navigate(`/admin/editquiz/${quiz._id}`)} className="h-7 mb-2 hover:bg-gray-300 rounded p-1 stroke-teal-500 fill-teal-500" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 24 24">
                                <path d="M 18 2 L 15.585938 4.4140625 L 19.585938 8.4140625 L 22 6 L 18 2 z M 14.076172 5.9238281 L 3 17 L 3 21 L 7 21 L 18.076172 9.9238281 L 14.076172 5.9238281 z"></path>
                            </svg>
                            <svg className="" onClick={()=>navigate(`/admin/quizdetails/${quiz._id}`)} viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" fill="#000000" class="bi bi-three-dots-vertical"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"></path> </g></svg>
                        </div>
                    </div>
                </div>)
            }

        </div>
    </div>
}