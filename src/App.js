import { useState, useEffect, useRef } from "react";
import { Card } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Progress } from "./components/ui/progress";
import { Calendar } from "./components/ui/calendar";
import { Sidebar } from "./components/ui/sidebar";
import { FaArrowLeft, FaArrowRight, FaCheck, FaUndo, FaPlay, FaPause, FaStop } from "react-icons/fa";

const tasks = [
  "Solve 2-3 DSA problems",
  "Study Core JavaScript",
  "Revise Aptitude topic",
  "Read DBMS concepts"  
];

const weeklyTask = "Take a mock test";

export default function App() {
  const [completedTasks, setCompletedTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weeklyData, setWeeklyData] = useState({});
  const [weeklyTaskCompleted, setWeeklyTaskCompleted] = useState(false);
  const [taskCounts, setTaskCounts] = useState({});
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    const storedProgress =
      JSON.parse(localStorage.getItem(selectedDate.toDateString())) || [];
    setCompletedTasks(storedProgress);
    updateWeeklyData();
    const tasksForWeek =
      JSON.parse(localStorage.getItem(getCurrentWeekKey())) || [];
    setWeeklyTaskCompleted(tasksForWeek.includes(weeklyTask));
    const storedCounts =
      JSON.parse(localStorage.getItem("taskCounts")) || {};
    setTaskCounts(storedCounts);
  }, [selectedDate]);

  const getCurrentWeekKey = () => {
    const startOfMonth = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      1
    );
    const weekNumber = Math.ceil(
      (selectedDate.getDate() + startOfMonth.getDay()) / 7
    );
    return `week-${weekNumber}-${selectedDate.getMonth()}-${selectedDate.getFullYear()}`;
  };

  const updateWeeklyData = () => {
    const startOfWeek = new Date(selectedDate);
    startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());
    const newWeeklyData = {};
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      const tasksForDay =
        JSON.parse(localStorage.getItem(date.toDateString())) || [];
      newWeeklyData[date.toDateString()] = tasksForDay;
    }
    setWeeklyData(newWeeklyData);
  };

  const toggleTask = (task) => {
    let updatedTasks;
    if (completedTasks.includes(task)) {
      updatedTasks = completedTasks.filter((t) => t !== task);
    } else {
      updatedTasks = [...completedTasks, task];
      const newTaskCounts = { ...taskCounts, [task]: (taskCounts[task] || 0) + 1 };
      setTaskCounts(newTaskCounts);
      localStorage.setItem("taskCounts", JSON.stringify(newTaskCounts));
    }
    setCompletedTasks(updatedTasks);
    localStorage.setItem(
      selectedDate.toDateString(),
      JSON.stringify(updatedTasks)
    );
  };

  const toggleWeeklyTask = () => {
    const weekKey = getCurrentWeekKey();
    const tasksForWeek = JSON.parse(localStorage.getItem(weekKey)) || [];
    if (weeklyTaskCompleted) {
      const index = tasksForWeek.indexOf(weeklyTask);
      if (index > -1) {
        tasksForWeek.splice(index, 1);
      }
    } else {
      tasksForWeek.push(weeklyTask);
    }
    setWeeklyTaskCompleted(!weeklyTaskCompleted);
    localStorage.setItem(weekKey, JSON.stringify(tasksForWeek));
    updateWeeklyData();
  };

  const handlePrevDay = () => {
    const prevDay = new Date(selectedDate);
    prevDay.setDate(selectedDate.getDate() - 1);
    setSelectedDate(prevDay);
  };

  const handleNextDay = () => {
    const nextDay = new Date(selectedDate);
    nextDay.setDate(selectedDate.getDate() + 1);
    setSelectedDate(nextDay);
  };

  const clearData = () => {
    if (window.confirm("Are you sure you want to clear all data?")) {
      localStorage.clear();
      setCompletedTasks([]);
      setWeeklyTaskCompleted(false);
      setWeeklyData({});
      setTaskCounts({});
    }
  };

  const startTimer = () => {
    if (!isTimerRunning) {
      setIsTimerRunning(true);
      timerRef.current = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
  };

  const stopTimer = () => {
    if (isTimerRunning) {
      clearInterval(timerRef.current);
      setIsTimerRunning(false);
    }
  };

  const resetTimer = () => {
    clearInterval(timerRef.current);
    setIsTimerRunning(false);
    setTimer(0);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <div className=" text-white w-full md:w-64 h-screen shadow-lg fixed md:relative">
        <Sidebar weeklyData={weeklyData} />
      </div>
      <div className="flex-1 max-w-4xl mx-auto p-4 md:p-6 md:ml-64">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-center">
          📅 Placement Prep Tracker
        </h1>
        <div className="flex flex-col md:flex-row items-center justify-between mb-4 md:mb-6">
          <Button
            onClick={handlePrevDay}
            className="bg-blue-500 text-white px-4 py-2 rounded flex items-center mb-2 md:mb-0"
          >
            <FaArrowLeft className="mr-2" /> Previous
          </Button>
          <Calendar
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="mx-0 md:mx-4 mb-2 md:mb-0"
          />
          <Button
            onClick={handleNextDay}
            className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
          >
            Next <FaArrowRight className="ml-2" />
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
          <Card className="shadow-lg">
            <div className="p-4 md:p-6">
              <h2 className="text-xl md:text-2xl font-semibold mb-2 md:mb-4">
                Weekly Progress
              </h2>
              <div className="flex space-x-2 md:space-x-4 overflow-x-auto">
                {Object.keys(weeklyData).map((date, index) => (
                  <div
                    key={index}
                    className="cursor-pointer"
                    onClick={() => setSelectedDate(new Date(date))}
                  >
                    <h3 className="text-lg font-medium hover:underline">
                      {date}
                    </h3>
                  </div>
                ))}
              </div>
            </div>
          </Card>
          <Card className="shadow-lg">
            <div className="p-4 md:p-6">
              <h2 className="text-xl md:text-2xl font-semibold mb-2 md:mb-4">
                Weekly Task
              </h2>
              <div className="flex items-center justify-between">
                <span
                  className={
                    weeklyTaskCompleted ? "line-through text-gray-500" : ""
                  }
                >
                  {weeklyTask}
                </span>
                <Button
                  onClick={toggleWeeklyTask}
                  variant={weeklyTaskCompleted ? "destructive" : "default"}
                  className="bg-green-500 text-white px-4 py-2 rounded flex items-center"
                >
                  {weeklyTaskCompleted ? (
                    <FaUndo className="mr-2" />
                  ) : (
                    <FaCheck className="mr-2" />
                  )}
                  {weeklyTaskCompleted ? "Undo" : "Complete"}
                </Button>
              </div>
            </div>
          </Card>
        </div>
        <Card className="shadow-lg">
          <div className="p-4 md:p-6">
            <h2 className="text-xl md:text-2xl font-semibold mb-2 md:mb-4">
              Tasks for {selectedDate.toDateString()}
            </h2>
            <div className="space-y-2 md:space-y-4">
              {tasks.map((task, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span
                    className={
                      completedTasks.includes(task)
                        ? "line-through text-gray-500"
                        : ""
                    }
                  >
                    {task} (Completed {taskCounts[task] || 0} times)
                  </span>
                  <Button
                    onClick={() => toggleTask(task)}
                    variant={
                      completedTasks.includes(task) ? "destructive" : "default"
                    }
                    className="bg-green-500 text-white px-4 py-2 rounded flex items-center"
                  >
                    {completedTasks.includes(task) ? (
                      <FaUndo className="mr-2" />
                    ) : (
                      <FaCheck className="mr-2" />
                    )}
                    {completedTasks.includes(task) ? "Undo" : "Complete"}
                  </Button>
                </div>
              ))}
            </div>
            <div className="mt-4 md:mt-6">
              <h3 className="text-lg font-semibold mb-1 md:mb-2">Progress</h3>
              <p>
                {completedTasks.length} of {tasks.length} tasks completed
              </p>
            </div>
            <div className="mt-2 md:mt-4">
              <Progress
                value={(completedTasks.length / tasks.length) * 100}
                label={`${completedTasks.length} / ${tasks.length}`}
              />
            </div>
            <div className="mt-4 md:mt-6">
              <Button
                onClick={clearData}
                className="bg-red-500 text-white px-4 py-2 rounded flex items-center"
              >
                Clear Data
              </Button>
            </div>
            <div className="mt-4 md:mt-6">
              <h3 className="text-lg font-semibold mb-1 md:mb-2">Timer</h3>
              <div className="flex items-center space-x-2">
                <Button
                  onClick={startTimer}
                  className="bg-green-500 text-white px-4 py-2 rounded flex items-center"
                >
                  <FaPlay className="mr-2" /> Start
                </Button>
                <Button
                  onClick={stopTimer}
                  className="bg-yellow-500 text-white px-4 py-2 rounded flex items-center"
                >
                  <FaPause className="mr-2" /> Pause
                </Button>
                <Button
                  onClick={resetTimer}
                  className="bg-red-500 text-white px-4 py-2 rounded flex items-center"
                >
                  <FaStop className="mr-2" /> Reset
                </Button>
              </div>
              <p className="mt-2 text-lg">
                Timer: {Math.floor(timer / 60)}:{timer % 60 < 10 ? `0${timer % 60}` : timer % 60}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
