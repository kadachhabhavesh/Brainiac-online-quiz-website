export default ({ onClose, studentResult, quizData}) => {
    if (studentResult == null) return null;
    return <div className="p-5 z-10 w-screen h-screen bg-black absolute top-0 left-0 bg-opacity-80 flex justify-center items-center">
        <div className="md:w-2/3 h-full bg-white rounded-md p-5">
            <div className="header flex justify-between mb-4">
                <div className="studentInfo ">
                    <h1 className="font-bold text-xl text-teal-900 leading-5">{ studentResult.studentDetail.firstname+" "+studentResult.studentDetail.lastname }</h1>
                    <h1 className="font-semibold text-sm">{studentResult.studentDetail.email }</h1>
                </div>
                <div className="p-1 hover:bg-gray-200 cursor-pointer rounded w-min h-min" onClick={() => {
                    onClose()
                }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
                        <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
                    </svg>
                </div>
            </div>
            <div className="w-full h-[650px] flex flex-col gap-2 p-2 overflow-y-scroll">
                {quizData.questions.map((que, index) => <div className={`font-bold w-full border-2 rounded p-2`}>
                    <div className="flex justify-between items-start">
                        <h1>{index + 1 + ". " + que.question}</h1>
                        <h1 className="min-w-fit text-sm border border-gray-300 py-0.5 px-1 rounded ">
                            {`${que.marks} marks`}
                        </h1>
                    </div>
                    {que.image && <div className="max-h-40 min-h-20 w-60 border-2 my-2">
                        <img className="max-h-full max-w-full rounded-md" src={`http://localhost:4000/${que.image}`} />
                    </div>}
                    {
                        que.options.map((option, index) => <div className=" py-1 text-sm flex items-center gap-x-2">
                            <div className={`w-4 h-4 rounded-full border border-gray-400 ${(studentResult.queandans[0].optionid == option._id && !studentResult.queandans[0].iscorrect) && "bg-red-600"} ${option.isTrue && "bg-green-600"}`}></div>
                            {/* <div className={`w-4 h-4 rounded-full border border-gray-400 ${(studentResult.queandans[0].optionid == option._id && !studentResult.queandans[0].iscorrect) && "bg-red-600"}`}></div> */}
                            {option.option}
                        </div>)
                    }

                </div>)}
            </div>
        </div>
    </div>
}