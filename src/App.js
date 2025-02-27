import { useState, useEffect } from "react";
import { Card } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Progress } from "./components/ui/progress";
import { Calendar } from "./components/ui/calendar";

const tasks = [
  "Solve 2-3 DSA problems",
  "Study Core JavaScript",
  "Revise Aptitude topic",
  "Read DBMS concepts",
  "Prepare OS or CN topic",
  "Take a mock test",
];

export default function App() {
  const [completedTasks, setCompletedTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const storedProgress = JSON.parse(localStorage.getItem(selectedDate.toDateString())) || [];
    setCompletedTasks(storedProgress);
  }, [selectedDate]);

  const toggleTask = (task) => {
    let updatedTasks;
    if (completedTasks.includes(task)) {
      updatedTasks = completedTasks.filter((t) => t !== task);
    } else {
      updatedTasks = [...completedTasks, task];
    }
    setCompletedTasks(updatedTasks);
    localStorage.setItem(selectedDate.toDateString(), JSON.stringify(updatedTasks));
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">📅 Placement Prep Tracker</h1>
      <Calendar selected={selectedDate} onSelect={setSelectedDate} className="mb-4" />
      <Card>
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-3">Tasks for {selectedDate.toDateString()}</h2>
          <div className="space-y-2">
            {tasks.map((task, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className={completedTasks.includes(task) ? "line-through text-gray-500" : ""}>{task}</span>
                <Button onClick={() => toggleTask(task)} variant={completedTasks.includes(task) ? "destructive" : "default"}>
                  {completedTasks.includes(task) ? "Undo" : "Complete"}
                </Button>
              </div>
            ))}
          </div>
          <Progress value={(completedTasks.length / tasks.length) * 100} className="mt-4" />
        </div>
      </Card>
    </div>
  );
}
