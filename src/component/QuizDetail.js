import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import StudentResultForTeacher from "./StudentResultForTeacher"
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import toast from "react-hot-toast";
import html2pdf from "html2pdf.js";
import * as XLSX from "xlsx";
import StatisticsOfResults from "./Chart/StatisticsOfResults";

export default () => {
    const alert = withReactContent(Swal)
    const { quizid } = useParams();
    const [quizData, setQuizData] = useState(null);
    const [tab, setTab] = useState(0)
    // evaluate data about how many student select particular option of particular question
    const [answerDistribution, setAnswerDistribution] = useState([])
    // id of student whose result is show
    const [showStudentResultFlag, setShowStudentResultFlag] = useState(null)
    // selected result from table
    const [selectedResult, setSelectedResult] = useState([])
    const [searchText, setSearchText] = useState("");


    useEffect(() => {
        loadData()
    }, [])

    const loadData = () => {
        fetch(`http://localhost:4000/playhistory/quizdetail/${quizid}`, { credentials: 'include' })
            .then(res => res.json())
            .then(res => {
                setQuizData(res);
                console.log(res);

                res.allResults.map((result, index) => {
                    result.queandans.map(quandan => {
                        setAnswerDistribution(prev => [...prev, quandan])
                    })
                })
            })
    }

    const deleteResult = (id) => {
        const delAlert = alert.mixin({
            customClass: {
                confirmButton: 'bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-6 rounded mx-2',
                cancelButton: 'bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-6 rounded mx-2'
            },
            buttonsStyling: false
        })

        delAlert.fire({
            title: "Are you sure?",
            text: `You want to delete Result`,
            icons: "warning",
            showCancelButton: true,
            reverseButtons: true,
            confirmButtonText: "Yes",
            cancelButtonText: "No"
        }).then(res => {
            if (res.isConfirmed) {
                fetch(`http://localhost:4000/playhistory/${id}`, { credentials: 'include', method: "DELETE" })
                    .then(res => {
                        if (res.status == 201) {
                            toast.success('Result delete successfully')
                            loadData()
                        }
                        else
                            toast.error("Failed to delete result.try again")
                    })
                    .catch(err => {
                        console.log("error");
                        toast.error("Failed to delete result.try again")
                    });
            }
        })
    }

    const sendResultOnStudentMail = (id) => {
        const toastId = toast("Sending...", { duration: 10000, });
        fetch(`http://localhost:4000/playhistory/sendmail/${id}`, { credentials: 'include', method: "POST" })
            .then(res => {
                toast.dismiss(toastId)
                if (res.status == 201) {
                    toast.success('Send result to student')
                } else {
                    toast.error("Failed to mail result.try again")
                }
            })
            .catch(err => {
                toast.error("Failed to mail result.try again")
                console.log(err)
            });
    }

    const sendResulToMultipleStudentMail = (ids) => {
        const toastId = toast("Please wait a moment; this may take some time.", { duration: 10000, });
        fetch(`http://localhost:4000/playhistory/sendmail`,
            {
                credentials: 'include',
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ "ResultIds": selectedResult })
            })
            .then(res => {
                toast.dismiss(toastId)
                if (res.status == 201) {
                    toast.success('Send result to student')
                } else {
                    toast.error("Failed to mail result.try again")
                }
            })
            .catch(err => {
                toast.error("Failed to mail result.try again")
                console.log(err)
            });
    }

    // generet student result
    const generetPDF = (student) => {
        if (!student) return;

        // Add student details to the PDF content
        const resultHTML = `
            <div style="margin: auto; max-width: 700px; padding: 20px; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
          <h2 style="text-align: center; font-size: 24px; font-weight: bold; color: #2d3748;">Quiz Result</h2>
          <div style="margin-top: 20px;">
            <p style="color: #4a5568;">Hello, <span style="font-weight: 600;">${student.studentDetail.firstname}</span>! Here’s your quiz performance summary:</p>
          </div>
          <h3 style="color: #4a5568;"><span style="font-weight: 600;">Quiz title: </span>${quizData.quizinfo.name}</h3>
          <h3 style="color: #4a5568;"><span style="font-weight: 600;">Quiz description: </span>${quizData.quizinfo.description}</h3>
          <div style="margin-top: 16px; padding: 16px; background: #ebf8ff; border-radius: 8px;">
            <p style="font-size: 18px; font-weight: 500; color: #2b6cb0;">Score: <span style="font-weight: 700; color: #2c5282;">${student.totalmarks + "/" + student.queandans.reduce((total, question) => total + question.marks, 0)}</span></p>
            <p style="font-size: 18px; font-weight: 500; color: #2b6cb0;">Correct Answers: <span style="font-weight: 700; color: #2c5282;">${student.queandans.reduce((total, question) => question.iscorrect ? total + 1 : total, 0)}</span></p>
            <p style="font-size: 18px; font-weight: 500; color: #2b6cb0;">Incorrect Answers: <span style="font-weight: 700; color: #2c5282;">${student.queandans.reduce((total, question) => question.iscorrect ? total : total + 1, 0)}</span></p>
          </div>
          <div style="margin-top: 24px;">
            <h3 style="font-size: 18px; font-weight: 600; color: #4a5568;">Detailed Results</h3>
            <ul style="margin-top: 8px; list-style-type: none; padding: 0;">
              ${quizData.quizinfo.questions.map((question, index) => `
                <li style="display: flex; justify-content: space-between; padding: 8px; margin-bottom: 8px; background: #f7fafc; border-radius: 6px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
                  <span>Q-${index + 1}: ${question.question}</span>
                  ${student.queandans[index].iscorrect
                ? '<span style="font-weight: 500; color: #48bb78;">Correct</span>'
                : '<span style="font-weight: 500; color: #f56565;">Incorrect</span>'}
                </li>`).join('')}
            </ul>
          </div>
        </div>
        `;

        // Use html2pdf to generate the PDF
        html2pdf()
            .from(resultHTML)
            .save(`${student.studentDetail.firstname}_${student.studentDetail.lastname}_result.pdf`)
            .then(() => {
                toast.success("Result download successfully")
            })
            .catch(err => {
                console.error('Error generating PDF:', err);
                toast.error('Try again')
            });
    }

    const handleResultCheckBox = (event) => {
        if (event.target.name == "all") {
            if (event.target.checked) {
                filteredResults.map(result => {
                    setSelectedResult((pre) => [...pre, result._id])
                })
            } else {
                setSelectedResult([])
            }

        } else {
            if (event.target.checked && !selectedResult.includes(event.target.value)) {
                setSelectedResult((pre) => [...pre, event.target.value])
                console.log(selectedResult);
            } else {
                setSelectedResult((pre) => pre.filter(result => result != event.target.value))
            }
        }
    }

    const deleteMultipleResult = (studentsResultIdList) => {
        if (studentsResultIdList.length <= 0)
            toast.error("select at least one result")
        else {
            const delAlert = alert.mixin({
                customClass: {
                    confirmButton: 'bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-6 rounded mx-2',
                    cancelButton: 'bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-6 rounded mx-2'
                },
                buttonsStyling: false
            })

            delAlert.fire({
                title: "Are you sure?",
                text: `You want to delete all selected Result`,
                icons: "warning",
                showCancelButton: true,
                reverseButtons: true,
                confirmButtonText: "Yes",
                cancelButtonText: "No"
            }).then(res => {
                if (res.isConfirmed) {
                    fetch(`http://localhost:4000/playhistory/deleteMultiple`, {
                        credentials: 'include',
                        method: "DELETE",
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ "ids": studentsResultIdList })
                    })
                        .then(res => res.json())
                        .then(res => {
                            if (res.success) {
                                toast.success('All results delete successfully')
                                loadData()
                            }
                            else
                                toast.error("Partial deletion - some records not found")
                        })
                        .catch(err => {
                            console.log("error");
                            toast.error("Failed to delete result. try again")
                        });
                }
                setSelectedResult([])
            })
        }
    }

    const exportToExcel = (selectedRes, allResultsData) => {

        if (!selectedRes || selectedRes.length <= 0) {
            toast.error("select at least one result")
            return;
        }

        const selectedResultDetail = allResultsData.filter(result => selectedRes.includes(result._id))
        console.log(selectedResultDetail, 231);

        const data = selectedResultDetail.map(resultDetail => {
            return {
                "Name": resultDetail.studentDetail.firstname + " " + resultDetail.studentDetail.firstname,
                "Email": resultDetail.studentDetail.email,
                "Marks": resultDetail.totalmarks,
                "Complete Time": `${resultDetail.quizcompletiontime.min != 0 ? resultDetail.quizcompletiontime.min + "m" : ""} ${resultDetail.quizcompletiontime.sec}s`,
                "Attempted Questions": resultDetail.queandans.reduce((total, item) => item.isattempted ? total + 1 : total, 0),
                "Correct Ans": resultDetail.queandans.reduce((total, item) => item.iscorrect ? total + 1 : total, 0),
                "Incorrect Ans": resultDetail.queandans.reduce((total, item) => !item.iscorrect ? total + 1 : total, 0),
                "accuracy": (resultDetail.queandans.reduce((total, item) => item.iscorrect ? total + 1 : total, 0) / resultDetail.queandans.reduce((total, item) => item.isattempted ? total + 1 : total, 0)) * 100
            }
        })

        // 1. Create a worksheet from the data array
        const worksheet = XLSX.utils.json_to_sheet(data);

        // 2. Create a workbook and add the worksheet
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

        // 3. Export the workbook to a file
        XLSX.writeFile(workbook, `quiz_report.xlsx`);
    }

    const exportToPDF = (selectedRes, allResultsData, quizinfo) => {

        if (!selectedRes || selectedRes.length <= 0) {
            toast.error("select at least one result")
            return;
        }

        const resultHTML = `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Professional Table</title>
                <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
                <style>
                    /* Ensure A4 size fit for PDF */
                    @media print {
                        @page {
                            size: A4;
                            margin: 1cm;
                        }
                    }
                </style>
            </head>
            <body class="bg-gray-100 flex justify-center items-center py-10">

                <div class="bg-white shadow-lg rounded-lg overflow-hidden max-w-4xl w-full mx-auto p-6">
                    <!-- Quiz Details Section -->
                    <div class="mb-6">
                        <h1 class="text-3xl font-bold text-gray-800 text-center mb-2">Quiz Performance Report</h1>
                        <div class="flex justify-between text-gray-600">
                            <p><strong>Quiz Name: </strong>${quizinfo.name}</p>
                            <p><strong>Date:</strong> November 5, 2024 ${quizinfo.starttime.day + "/" + quizinfo.starttime.month + "/" + quizinfo.starttime.year}</p>
                        </div>
                        <div class="flex justify-between text-gray-600">
                            <p><strong>Total Questions:</strong> ${quizinfo.questions.length}</p>
                            <p><strong>Duration:</strong> ${quizinfo.durarion} minutes</p>
                        </div>
                        <p class="text-gray-600 mt-2 text-center">This report shows the performance of each student in the quiz.</p>
                    </div>

                    <!-- Table Section -->
                    <h2 class="text-2xl font-semibold text-gray-800 text-center mb-4">Student Performance Report</h2>
                    <table class="table-auto w-full border-collapse">
                        <thead>
                            <tr class="bg-gray-800 text-white text-sm leading-normal">
                                <th class="border border-gray-300 px-1 py-3 text-left">Name</th>
                                <th class="border border-gray-300 px-1 py-3 text-left">Email</th>
                                <th class="border border-gray-300 px-1 py-3 text-center">Marks</th>
                                <th class="border border-gray-300 px-1 py-3 text-center">Complete</th>
                                <th class="border border-gray-300 px-1 py-3 text-center">Attempted Questions</th>
                                <th class="border border-gray-300 px-1 py-3 text-center">Correct Ans</th>
                                <th class="border border-gray-300 px-1 py-3 text-center">Incorrect Ans</th>
                                <th class="border border-gray-300 px-1 py-3 text-center">Accuracy</th>
                            </tr>
                        </thead>
                        <tbody class="text-gray-700 text-sm font-light">
                            ${allResultsData.map(result => {
            return selectedRes.includes(result._id) && `<tr class="hover:bg-gray-100 border-b border-gray-200">
                                <td class="px-1 py-3">${result.studentDetail.firstname + " " + result.studentDetail.lastname}</td>
                                <td class="px-1 py-3">${result.studentDetail.email}</td>
                                <td class="px-1 py-3 text-center">${result.totalmarks}</td>
                                <td class="px-1 py-3 text-center">${result.quizcompletiontime.min != 0 ? result.quizcompletiontime.min + "m" : ""} ${result.quizcompletiontime.sec}s</td>
                                <td class="px-1 py-3 text-center">${result.queandans.reduce((total, item) => item.isattempted ? total + 1 : total, 0)}</td>
                                <td class="px-1 py-3 text-center">${result.queandans.reduce((total, item) => item.iscorrect ? total + 1 : total, 0)}</td>
                                <td class="px-1 py-3 text-center">${result.queandans.reduce((total, item) => !item.iscorrect ? total + 1 : total, 0)}</td>
                                <td class="px-1 py-3 text-center">${(result.queandans.reduce((total, item) => item.iscorrect ? total + 1 : total, 0) / result.queandans.reduce((total, item) => item.isattempted ? total + 1 : total, 0)) * 100}</td>
                            </tr>`
        })}
                        </tbody>
                    </table>
                </div>

            </body>
            </html>
`;

        // Use html2pdf to generate the PDF
        html2pdf()
            .set({
                margin: 0,
                filename: 'quiz_report.pdf',  // Specify file name
                jsPDF: { unit: 'cm', format: 'a4', orientation: 'landscape' } // Landscape orientation
            })
            .from(resultHTML)
            .save()
            .then(() => {
                toast.success("Quiz report download successfully")
            })
            .catch(err => {
                console.error('Error generating PDF:', err);
                toast.error('Try again')
            });
    }

    // Function to handle search input change
    const handleSearchChange = (event) => {
        setSearchText(event.target.value);
    };

    // Filtered results based on search text
    const filteredResults = quizData?.allResults.filter(student =>
        student.studentDetail.email.toLowerCase().includes(searchText.toLowerCase()) ||
        `${student.studentDetail.firstname} ${student.studentDetail.lastname}`.toLowerCase().includes(searchText.toLowerCase())
    );

    return quizData && <div className="w-full h-screen p-3 mb-10">
        <div className="min-w-full min-h-40 bg-white rounded mb-4 p-3 flex gap-x-3">
            <div className="flex gap-x-4">
                <div className="min-w-32 max-w-32 min-h-24 max-h-24 border flex justify-center items-center">
                    <img src={`http://localhost:4000/${quizData.quizinfo.image}`} />
                </div>
                <div className="flex flex-col">
                    <h1 className={`text-sm font-bold ${quizData.quizinfo.difficultylevel === 'hard' ? "text-orange-500" : quizData.quizinfo.difficultylevel === 'medium' ? "text-yellow-500" : "text-green-500"} `}>{quizData.quizinfo.difficultylevel}</h1>
                    <h1 className="font-bold">{quizData.quizinfo.name}</h1>
                    <h1 className="font-semibold text-sm">
                        {quizData.quizinfo.description}
                    </h1>
                    <div className="flex gap-x-10 text-sm mt-1 text-gray-500">
                        <div className="flex flex-col gap-x-4">
                            <div className="flex items-center gap-1.5">
                                <div className="h-1 w-1 rounded-full bg-gray-500"></div>
                                <h1>{quizData.quizinfo.plays} plays</h1>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="h-1 w-1 rounded-full bg-gray-500"></div>
                                <h1>{quizData.quizinfo.grade} grade</h1>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="h-1 w-1 rounded-full bg-gray-500"></div>
                                <h1>{quizData.quizinfo.questions.length} questions</h1>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <div className="flex items-center gap-1.5">
                                <div className="h-1 w-1 rounded-full bg-gray-500"></div>
                                <h1>{quizData.quizinfo.subject}</h1>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="h-1 w-1 rounded-full bg-gray-500"></div>
                                <h1>{quizData.quizinfo.duration} min</h1>
                            </div>
                            {(quizData.quizinfo.password != 'null' && quizData.quizinfo.password != null) && <div className="flex items-center gap-1.5">
                                <div className="h-1 w-1 rounded-full bg-gray-500"></div>
                                <h1>password : {quizData.quizinfo.password}</h1>
                            </div>}
                        </div>
                        <div className="flex flex-col bg-teal-200 h-fit px-3 py-px rounded text-black">
                            <div className="flex items-center justify-between p-0.5">
                                <h1>invite code</h1>
                                <div className="flex items-center">
                                    <button
                                        className="ml-2 font-bold text-teal-800 hover:text-teal-500"
                                        onClick={() => {
                                            navigator.clipboard.writeText(quizData.quizinfo.code)
                                            toast.success("copied")
                                        }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="bi bi-copy" viewBox="0 0 16 16">
                                            <path fill-rule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <h1 className="font-semibold tracking-widest text-2xl">{quizData.quizinfo.code}</h1>
                        </div>
                    </div>
                </div>
            </div>
        </div>



        {/* Student List */}
        <div className="w-full flex flex-col gap-2">
            <div className="w-full flex justify-between items-end">
                <div className="w-min flex gap-2 items-center bg-white rounded p-1.5">
                    <div className={`px-5 py-1.5 hover:font-bold hover:text-teal-800 hover:bg-teal-100 cursor-pointer rounded-md ${tab == 0 && "font-bold text-teal-800 bg-teal-100"}`}
                        onClick={() => setTab(0)}
                    >
                        <label>Students</label>
                    </div>
                    <div className={`px-5 py-1.5 hover:font-bold hover:text-teal-800 hover:bg-teal-100 cursor-pointer rounded-md ${tab == 1 && "font-bold text-teal-800 bg-teal-100"}`}
                        onClick={() => setTab(1)}
                    >
                        <label>Questions</label>
                    </div>
                    <div className={`px-5 py-1.5 hover:font-bold hover:text-teal-800 hover:bg-teal-100 cursor-pointer rounded-md ${tab == 2 && "font-bold text-teal-800 bg-teal-100"}`}
                        onClick={() => setTab(2)}
                    >
                        <label className="text-nowrap">Results Analytics</label>
                    </div>
                </div>
                {tab == 0 && <div className="w-min flex gap-2">
                    <div className="py-2 px-4 bg-white rounded flex gap-1 items-center justify-center cursor-pointer hover:bg-gray-300">
                        <h1 className="font-semibold text-teal-500">{selectedResult.length}</h1>
                        <h1 className="text-sm">selected</h1>
                    </div>
                    <div className="p-2 bg-white rounded flex gap-1 items-center justify-center cursor-pointer hover:bg-gray-300" onClick={() => deleteMultipleResult(selectedResult)}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="bi bi-trash-fil fill-red-500 w-6 h-6 p-1 rounded" viewBox="0 0 16 16">
                            <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0" />
                        </svg>
                    </div>
                    <div className="w-32 p-2 bg-white rounded flex gap-1 items-center justify-center cursor-pointer hover:bg-gray-300" onClick={() => sendResulToMultipleStudentMail(selectedResult)}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="bi bi-envellope-at-fill fill-blue-700 w-7 h-7 p-1 rounded" viewBox="0 0 16 16">
                            <path d="M2 2A2 2 0 0 0 .05 3.555L8 8.414l7.95-4.859A2 2 0 0 0 14 2zm-2 9.8V4.698l5.803 3.546zm6.761-2.97-6.57 4.026A2 2 0 0 0 2 14h6.256A4.5 4.5 0 0 1 8 12.5a4.49 4.49 0 0 1 1.606-3.446l-.367-.225L8 9.586zM16 9.671V4.697l-5.803 3.546.338.208A4.5 4.5 0 0 1 12.5 8c1.414 0 2.675.652 3.5 1.671" />
                            <path d="M15.834 12.244c0 1.168-.577 2.025-1.587 2.025-.503 0-1.002-.228-1.12-.648h-.043c-.118.416-.543.643-1.015.643-.77 0-1.259-.542-1.259-1.434v-.529c0-.844.481-1.4 1.26-1.4.585 0 .87.333.953.63h.03v-.568h.905v2.19c0 .272.18.42.411.42.315 0 .639-.415.639-1.39v-.118c0-1.277-.95-2.326-2.484-2.326h-.04c-1.582 0-2.64 1.067-2.64 2.724v.157c0 1.867 1.237 2.654 2.57 2.654h.045c.507 0 .935-.07 1.18-.18v.731c-.219.1-.643.175-1.237.175h-.044C10.438 16 9 14.82 9 12.646v-.214C9 10.36 10.421 9 12.485 9h.035c2.12 0 3.314 1.43 3.314 3.034zm-4.04.21v.227c0 .586.227.8.581.8.31 0 .564-.17.564-.743v-.367c0-.516-.275-.708-.572-.708-.346 0-.573.245-.573.791" />
                        </svg>
                        <h1 className="text-sm">send mail</h1>
                    </div>
                    <div className="w-36 p-2 bg-white rounded flex gap-1 items-center justify-center cursor-pointer hover:bg-gray-300" onClick={() => exportToPDF(selectedResult, quizData.allResults, quizData.quizinfo)}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="bi bi-file-earmark-pdf-fill fill-red-500 w-7 h-7 p-1 rounded" viewBox="0 0 16 16">
                            <path d="M5.523 12.424q.21-.124.459-.238a8 8 0 0 1-.45.606c-.28.337-.498.516-.635.572l-.035.012a.3.3 0 0 1-.026-.044c-.056-.11-.054-.216.04-.36.106-.165.319-.354.647-.548m2.455-1.647q-.178.037-.356.078a21 21 0 0 0 .5-1.05 12 12 0 0 0 .51.858q-.326.048-.654.114m2.525.939a4 4 0 0 1-.435-.41q.344.007.612.054c.317.057.466.147.518.209a.1.1 0 0 1 .026.064.44.44 0 0 1-.06.2.3.3 0 0 1-.094.124.1.1 0 0 1-.069.015c-.09-.003-.258-.066-.498-.256M8.278 6.97c-.04.244-.108.524-.2.829a5 5 0 0 1-.089-.346c-.076-.353-.087-.63-.046-.822.038-.177.11-.248.196-.283a.5.5 0 0 1 .145-.04c.013.03.028.092.032.198q.008.183-.038.465z" />
                            <path fill-rule="evenodd" d="M4 0h5.293A1 1 0 0 1 10 .293L13.707 4a1 1 0 0 1 .293.707V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2m5.5 1.5v2a1 1 0 0 0 1 1h2zM4.165 13.668c.09.18.23.343.438.419.207.075.412.04.58-.03.318-.13.635-.436.926-.786.333-.401.683-.927 1.021-1.51a11.7 11.7 0 0 1 1.997-.406c.3.383.61.713.91.95.28.22.603.403.934.417a.86.86 0 0 0 .51-.138c.155-.101.27-.247.354-.416.09-.181.145-.37.138-.563a.84.84 0 0 0-.2-.518c-.226-.27-.596-.4-.96-.465a5.8 5.8 0 0 0-1.335-.05 11 11 0 0 1-.98-1.686c.25-.66.437-1.284.52-1.794.036-.218.055-.426.048-.614a1.24 1.24 0 0 0-.127-.538.7.7 0 0 0-.477-.365c-.202-.043-.41 0-.601.077-.377.15-.576.47-.651.823-.073.34-.04.736.046 1.136.088.406.238.848.43 1.295a20 20 0 0 1-1.062 2.227 7.7 7.7 0 0 0-1.482.645c-.37.22-.699.48-.897.787-.21.326-.275.714-.08 1.103" />
                        </svg>
                        <h1 className="text-sm">export results</h1>
                    </div>
                    <div className="w-32 p-2 bg-white rounded flex gap-1 items-center justify-center cursor-pointer hover:bg-gray-300" onClick={() => exportToExcel(selectedResult, quizData.allResults)}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-file-earmark-excel-fill fill-green-800 w-5 h-5" viewBox="0 0 16 16">
                            <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0M9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1M5.884 6.68 8 9.219l2.116-2.54a.5.5 0 1 1 .768.641L8.651 10l2.233 2.68a.5.5 0 0 1-.768.64L8 10.781l-2.116 2.54a.5.5 0 0 1-.768-.641L7.349 10 5.116 7.32a.5.5 0 1 1 .768-.64" />
                        </svg>
                        <h1 className="text-sm">export excel</h1>
                    </div>
                    <input
                        className="py-1.5 px-2 w-72 outline-none rounded"
                        type="text"
                        placeholder="Search by name or email"
                        value={searchText}
                        onChange={handleSearchChange}
                    />
                </div>}
            </div>

            {tab === 0 && filteredResults.length > 0 && <div className="bg-white rounded p-2 overflow-x-scroll">
                <h1 className="font-bold py-2">Students</h1>
                <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-100 ">
                        <tr>
                            <th className="px-2 py-3">
                                <input type="checkbox" className="cursor-pointer" name="all" onChange={(event) => handleResultCheckBox(event)} />
                            </th>
                            <th scope="col" className=" py-3">
                                Rank
                            </th>
                            <th scope="col" className=" py-3">
                                Email
                            </th>
                            <th scope="col" className=" py-3">
                                Name
                            </th>
                            <th scope="col" className=" py-3">
                                marks
                            </th>
                            <th scope="col" className=" py-3">
                                Complete Time
                            </th>
                            <th scope="col" className=" py-3">
                                Attempted Que
                            </th>
                            <th scope="col" className=" py-3">
                                Correct Ans
                            </th>
                            <th scope="col" className=" py-3">
                                accuracy
                            </th>
                            <th scope="col" className=" py-3">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredResults.map((student, index) => {
                            return (
                                <tr className={`bg-white border-b hover:bg-gray-50${selectedResult.includes(student._id) && "bg-blue-00"}`}>
                                    <td className="px-2 py-2">
                                        <input type="checkbox" className="cursor-pointer" name="student" value={student._id} onChange={(event) => handleResultCheckBox(event)} checked={selectedResult.includes(student._id)}></input>
                                    </td>
                                    <td scope="row" className=" py-2 font-medium text-gray-900 whitespace-nowrap">
                                        {index + 1}
                                    </td>
                                    <td scope="row" className=" py-2 font-medium text-gray-900 whitespace-nowrap">
                                        {student.studentDetail.email}
                                    </td>
                                    <td className=" py-2">
                                        {student.studentDetail.firstname + " " + student.studentDetail.lastname}
                                    </td>
                                    <td className=" py-2 flex flex-col">
                                        <div className="w-20 bg-gray-200 h-2.5 rounded-full">
                                            <div className="bg-teal-600 h-2.5 rounded-full" style={{ width: `${(student.totalmarks / student.queandans.reduce((total, ques) => total = total + ques.marks, 0)) * 100}%` }}></div>
                                            {student.totalmarks}
                                        </div>
                                    </td>
                                    <td className=" py-2">
                                        {`${student.quizcompletiontime.min != 0 ? student.quizcompletiontime.min + "m" : ""} ${student.quizcompletiontime.sec}s`}
                                    </td>
                                    <td className=" py-2 flex flex-col">
                                        <div className="w-20 bg-gray-200 h-2.5 rounded-full">
                                            <div className="bg-teal-600 h-2.5 rounded-full" style={{ width: `${(student.queandans.reduce((total, ques) => ques.isattempted ? total = total + 1 : total = total + 0, 0) / student.queandans.length) * 100}%` }}></div>
                                            {student.queandans.reduce((total, ques) => ques.isattempted ? total = total + 1 : total = total + 0, 0)}
                                        </div>
                                    </td>
                                    <td className=" py-2">
                                        <div class="w-20 bg-gray-200 h-2.5 rounded-full">
                                            <div class="bg-teal-600 h-2.5 rounded-full" style={{ width: `${(student.queandans.reduce((total, ques) => ques.iscorrect ? total = total + ques.marks : total = total + 0, 0) / student.queandans.reduce((total, ques) => total = total + ques.marks, 0)) * 100}%` }}></div>
                                        </div>
                                        {student.queandans.reduce((total, ques) => ques.iscorrect ? total = total + 1 : total = total + 0, 0)}
                                    </td>
                                    <td className=" py-2">
                                        <div class="w-20 bg-gray-200 h-2.5 rounded-full">
                                            <div class="bg-teal-600 h-2.5 rounded-full" style={{ width: `${isNaN(((student.queandans.reduce((total, ques) => ques.iscorrect ? total = total + 1 : total = total + 0, 0) / student.queandans.reduce((total, ques) => ques.isattempted ? total = total + 1 : total = total + 0, 0)) * 100).toFixed(2)) ? '0' : ((student.queandans.reduce((total, ques) => ques.iscorrect ? total = total + 1 : total = total + 0, 0) / student.queandans.reduce((total, ques) => ques.isattempted ? total = total + 1 : total = total + 0, 0)) * 100).toFixed(2)}%` }}></div>
                                        </div>
                                        {`${isNaN(((student.queandans.reduce((total, ques) => ques.iscorrect ? total = total + 1 : total = total + 0, 0) / student.queandans.reduce((total, ques) => ques.isattempted ? total = total + 1 : total = total + 0, 0)) * 100).toFixed(2)) ? '0.00' : ((student.queandans.reduce((total, ques) => ques.iscorrect ? total = total + 1 : total = total + 0, 0) / student.queandans.reduce((total, ques) => ques.isattempted ? total = total + 1 : total = total + 0, 0)) * 100).toFixed(2)}%`}
                                    </td>
                                    <td className=" py-2 flex gap-1 items-center">
                                        <div title="Delete" onClick={() => deleteResult(student._id)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="bi bi-trash-fil fill-red-500 w-6 h-6 p-1 hover:bg-gray-300 rounded" viewBox="0 0 16 16">
                                                <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0" />
                                            </svg>
                                        </div>

                                        <div title="Send Email" onClick={() => sendResultOnStudentMail(student._id)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="bi bi-envellope-at-fill fill-blue-700 w-6 h-6 p-1 hover:bg-gray-300 rounded" viewBox="0 0 16 16">
                                                <path d="M2 2A2 2 0 0 0 .05 3.555L8 8.414l7.95-4.859A2 2 0 0 0 14 2zm-2 9.8V4.698l5.803 3.546zm6.761-2.97-6.57 4.026A2 2 0 0 0 2 14h6.256A4.5 4.5 0 0 1 8 12.5a4.49 4.49 0 0 1 1.606-3.446l-.367-.225L8 9.586zM16 9.671V4.697l-5.803 3.546.338.208A4.5 4.5 0 0 1 12.5 8c1.414 0 2.675.652 3.5 1.671" />
                                                <path d="M15.834 12.244c0 1.168-.577 2.025-1.587 2.025-.503 0-1.002-.228-1.12-.648h-.043c-.118.416-.543.643-1.015.643-.77 0-1.259-.542-1.259-1.434v-.529c0-.844.481-1.4 1.26-1.4.585 0 .87.333.953.63h.03v-.568h.905v2.19c0 .272.18.42.411.42.315 0 .639-.415.639-1.39v-.118c0-1.277-.95-2.326-2.484-2.326h-.04c-1.582 0-2.64 1.067-2.64 2.724v.157c0 1.867 1.237 2.654 2.57 2.654h.045c.507 0 .935-.07 1.18-.18v.731c-.219.1-.643.175-1.237.175h-.044C10.438 16 9 14.82 9 12.646v-.214C9 10.36 10.421 9 12.485 9h.035c2.12 0 3.314 1.43 3.314 3.034zm-4.04.21v.227c0 .586.227.8.581.8.31 0 .564-.17.564-.743v-.367c0-.516-.275-.708-.572-.708-.346 0-.573.245-.573.791" />
                                            </svg>
                                        </div>
                                        <div title="Download PDF" data-toggle="tooltip" data-placement="top" onClick={() => generetPDF(student)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="bi bi-file-earmark-pdf-fill fill-red-500 w-6 h-6 p-1 hover:bg-gray-300 rounded" viewBox="0 0 16 16">
                                                <path d="M5.523 12.424q.21-.124.459-.238a8 8 0 0 1-.45.606c-.28.337-.498.516-.635.572l-.035.012a.3.3 0 0 1-.026-.044c-.056-.11-.054-.216.04-.36.106-.165.319-.354.647-.548m2.455-1.647q-.178.037-.356.078a21 21 0 0 0 .5-1.05 12 12 0 0 0 .51.858q-.326.048-.654.114m2.525.939a4 4 0 0 1-.435-.41q.344.007.612.054c.317.057.466.147.518.209a.1.1 0 0 1 .026.064.44.44 0 0 1-.06.2.3.3 0 0 1-.094.124.1.1 0 0 1-.069.015c-.09-.003-.258-.066-.498-.256M8.278 6.97c-.04.244-.108.524-.2.829a5 5 0 0 1-.089-.346c-.076-.353-.087-.63-.046-.822.038-.177.11-.248.196-.283a.5.5 0 0 1 .145-.04c.013.03.028.092.032.198q.008.183-.038.465z" />
                                                <path fill-rule="evenodd" d="M4 0h5.293A1 1 0 0 1 10 .293L13.707 4a1 1 0 0 1 .293.707V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2m5.5 1.5v2a1 1 0 0 0 1 1h2zM4.165 13.668c.09.18.23.343.438.419.207.075.412.04.58-.03.318-.13.635-.436.926-.786.333-.401.683-.927 1.021-1.51a11.7 11.7 0 0 1 1.997-.406c.3.383.61.713.91.95.28.22.603.403.934.417a.86.86 0 0 0 .51-.138c.155-.101.27-.247.354-.416.09-.181.145-.37.138-.563a.84.84 0 0 0-.2-.518c-.226-.27-.596-.4-.96-.465a5.8 5.8 0 0 0-1.335-.05 11 11 0 0 1-.98-1.686c.25-.66.437-1.284.52-1.794.036-.218.055-.426.048-.614a1.24 1.24 0 0 0-.127-.538.7.7 0 0 0-.477-.365c-.202-.043-.41 0-.601.077-.377.15-.576.47-.651.823-.073.34-.04.736.046 1.136.088.406.238.848.43 1.295a20 20 0 0 1-1.062 2.227 7.7 7.7 0 0 0-1.482.645c-.37.22-.699.48-.897.787-.21.326-.275.714-.08 1.103" />
                                            </svg>
                                        </div>
                                        <div title="Student Result" onClick={() => {
                                            if (showStudentResultFlag == null) {
                                                setShowStudentResultFlag(student)
                                                console.log(showStudentResultFlag);
                                            } else {
                                                setShowStudentResultFlag(null)
                                                console.log(showStudentResultFlag);
                                            }
                                        }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-list-check w-7 h-7 p-1 hover:bg-gray-300 rounded" viewBox="0 0 16 16">
                                                <path fill-rule="evenodd" d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5M3.854 2.146a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 1 1 .708-.708L2 3.293l1.146-1.147a.5.5 0 0 1 .708 0m0 4a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 1 1 .708-.708L2 7.293l1.146-1.147a.5.5 0 0 1 .708 0m0 4a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 0 1 .708-.708l.146.147 1.146-1.147a.5.5 0 0 1 .708 0" />
                                            </svg>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                <h1 className="text-red-500 font-bold p-2">{quizData.quizinfo.plays - quizData.allResults.length} result Delete By Teacher</h1>
            </div>}
            {tab === 0 && filteredResults.length <= 0 && <div className="w-full h-20 flex justify-center items-center font-bold text-slate-400">Results Not Found</div>}

            {tab === 1 && <div className="bg-white rounded p-2">
                <h1 className="font-bold py-2">Questions</h1>
                <div className="w-full flex flex-col gap-2">
                    {quizData.quizinfo.questions.map((que, index) => <div className={`font-bold w-full border-2 rounded p-2`}>
                        <div className="flex justify-between items-start">
                            <h1>{index + 1 + " " + que.question}</h1>
                            <h1 className="min-w-fit text-sm border border-gray-300 py-0.5 px-1 rounded ">
                                {`${que.marks} marks`}
                            </h1>
                        </div>
                        {que.image && <div className="max-h-40 min-h-20 w-60 border-2 my-2">
                            <img className="max-h-full max-w-full rounded-md" src={`http://localhost:4000/${que.image}`} />
                        </div>}
                        {
                            que.options.map((option, index) => <div className=" py-1 text-sm flex items-center gap-x-2">
                                <div className={`w-4 h-4 rounded-full border border-gray-400 ${option.isTrue && "bg-green-600"}`}></div>
                                <div className="w-20 bg-gray-200 h-5 rounded-full">
                                    <div className={`bg-teal-600 h-5 rounded-full ${((answerDistribution.reduce((total, item) => total = (item.questionid == que._id && item.optionid == option._id) ? total + 1 : total, 0) / answerDistribution.reduce((total, item) => total = (item.questionid == que._id) ? total + 1 : total, 0)) * 100) > 0 ? "px-1" : "p-0"}`} style={{ width: `${(answerDistribution.reduce((total, item) => total = (item.questionid == que._id && item.optionid == option._id) ? total + 1 : total, 0) / answerDistribution.reduce((total, item) => total = (item.questionid == que._id) ? total + 1 : total, 0)) * 100}%` }}>
                                        {`${((answerDistribution.reduce((total, item) => total = (item.questionid == que._id && item.optionid == option._id) ? total + 1 : total, 0) / answerDistribution.reduce((total, item) => total = (item.questionid == que._id) ? total + 1 : total, 0)) * 100).toFixed(1)}%`}
                                    </div>
                                </div>
                                {option.option}
                            </div>)
                        }

                    </div>)}
                </div>
            </div>}
            {tab === 1 && quizData.quizinfo.questions.length <= 0 && <div className="w-full h-20 flex justify-center items-center font-bold text-slate-400">Questions Not Found</div>}

            {tab === 2 && <StatisticsOfResults quizData={quizData} />}
        </div>
        {showStudentResultFlag && <StudentResultForTeacher onClose={() => setShowStudentResultFlag(null)} studentResult={showStudentResultFlag} quizData={quizData.quizinfo} />}
    </div>

}