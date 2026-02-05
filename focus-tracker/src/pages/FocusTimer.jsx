import { useEffect, useState, useCallback } from "react";
import { useTaskStore } from "@/store/useTaskStore";
import { addSeconds, differenceInSeconds } from "date-fns";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const DAILY_GOAL_SECONDS = 4 * 60 * 60;
const FOCUSED_TIME_KEY = "focused-seconds-today";
const END_TIME_KEY = "focus-end-time";

const FocusTimer = () => {
  const {
    tasks,
    activeTaskId,
    addTask,
    setActiveTask,
    updateTask,
    deleteTask,
    hasHydrated,
  } = useTaskStore();

  const activeTask = tasks.find((t) => t.id === activeTaskId) || null;

  const [open, setOpen] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [notes, setNotes] = useState("");
  const [minutes, setMinutes] = useState(30);

  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState("");

  const [isEditingTime, setIsEditingTime] = useState(false);
  const [editedMinutes, setEditedMinutes] = useState(0);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const [secondsLeft, setSecondsLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [endTime, setEndTime] = useState(null);

  const [focusedSecondsToday, setFocusedSecondsToday] = useState(0);

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const isCompleted = Boolean(task.completed);

    const matchesFilter =
      filter === "all"
        ? true
        : filter === "active"
        ? !isCompleted
        : isCompleted;

    return matchesSearch && matchesFilter;
  });

  useEffect(() => {
    if (!hasHydrated) return;

    const today = new Date().toDateString();
    const storedDate = localStorage.getItem("focus-date");

    if (storedDate !== today) {
      localStorage.setItem("focus-date", today);
      localStorage.setItem(FOCUSED_TIME_KEY, "0");
      setFocusedSecondsToday(0);
    } else {
      setFocusedSecondsToday(
        Number(localStorage.getItem(FOCUSED_TIME_KEY) || 0)
      );
    }
  }, [hasHydrated]);

  useEffect(() => {
    if (!hasHydrated || !activeTask) return;

    const storedEnd = localStorage.getItem(END_TIME_KEY);
    if (!storedEnd) {
      setSecondsLeft(activeTask.minutes * 60);
      return;
    }

    const parsedEnd = new Date(storedEnd);
    const remaining = differenceInSeconds(parsedEnd, new Date());

    if (remaining > 0) {
      setEndTime(parsedEnd);
      setSecondsLeft(remaining);
      setIsRunning(true);
    } else {
      localStorage.removeItem(END_TIME_KEY);
      setSecondsLeft(activeTask.minutes * 60);
    }
  }, [hasHydrated, activeTask]);

  useEffect(() => {
    if (!activeTask) return;

    setIsRunning(false);
    setEndTime(null);
    localStorage.removeItem(END_TIME_KEY);

    setSecondsLeft(activeTask.minutes * 60);
    setEditedName(activeTask.name);
    setEditedMinutes(activeTask.minutes);

    setIsEditingName(false);
    setIsEditingTime(false);
  }, [activeTaskId]);

  useEffect(() => {
    if (!tasks.length) {
      setActiveTask(null);
      return;
    }

    const exists = tasks.some((t) => t.id === activeTaskId);
    if (!exists) {
      setActiveTask(tasks[0].id);
    }
  }, [tasks, activeTaskId, setActiveTask]);

  useEffect(() => {
    if (!isRunning || !endTime) return;

    const tick = () => {
      const remaining = differenceInSeconds(endTime, new Date());

      if (remaining <= 0) {
        setSecondsLeft(0);
        setIsRunning(false);
        setEndTime(null);
        localStorage.removeItem(END_TIME_KEY);

        if (activeTask) {
          updateTask(activeTask.id, { completed: true });
        }
        return;
      }

      setSecondsLeft(remaining);
    };

    tick(); 
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [isRunning, endTime, activeTask, updateTask]);

  const toggleTimer = useCallback(() => {
    if (!activeTask) return;

    if (!isRunning) {
      const newEnd = addSeconds(new Date(), secondsLeft);
      setEndTime(newEnd);
      localStorage.setItem(END_TIME_KEY, newEnd.toISOString());
      setIsRunning(true);
    } else {
      if (!endTime) return;

      const remaining = Math.max(
        differenceInSeconds(endTime, new Date()),
        0
      );

      setSecondsLeft(remaining);
      setIsRunning(false);
      setEndTime(null);
      localStorage.removeItem(END_TIME_KEY);
    }
  }, [isRunning, secondsLeft, endTime, activeTask]);


  const formatTime = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(
      s % 60
    ).padStart(2, "0")}`;

  const progressPercent = Math.min(
    (focusedSecondsToday / DAILY_GOAL_SECONDS) * 100,
    100
  );

  const handleSaveTask = () => {
    if (!taskName.trim()) return;

    addTask({
      id: Date.now().toString(),
      name: taskName,
      notes,
      minutes,
      completed: false,
    });

    setTaskName("");
    setNotes("");
    setMinutes(30);
    setOpen(false);
  };

  if (!hasHydrated) {
    return <p className="mt-24 text-center">Loading...</p>;
  }

  /* ---------------- UI ---------------- */
  return (
    <div className="flex flex-col items-center mt-16 gap-6">
      {activeTask && !isEditingName && (
        <span
          className="text-2xl font-semibold cursor-pointer"
          onClick={() => setIsEditingName(true)}
        >
          {activeTask.name}
        </span>
      )}

      {activeTask && isEditingName && (
        <Input
          autoFocus
          value={editedName}
          className="text-xl text-center w-[320px]"
          onChange={(e) => setEditedName(e.target.value)}
          onBlur={() => {
            if (editedName.trim()) {
              updateTask(activeTask.id, { name: editedName });
            }
            setIsEditingName(false);
          }}
        />
      )}

      <p
        className={`text-[72px] font-bold text-[#258cf4] ${
          isRunning ? "opacity-60" : "cursor-pointer"
        }`}
        onClick={() => !isRunning && setIsEditingTime(true)}
      >
        {!isEditingTime ? formatTime(secondsLeft) : null}
      </p>

      {isEditingTime && activeTask && (
        <Input
          autoFocus
          type="number"
          className="text-3xl text-center w-[140px]"
          value={editedMinutes}
          onChange={(e) => setEditedMinutes(Number(e.target.value))}
          onBlur={() => {
            if (editedMinutes > 0) {
              updateTask(activeTask.id, { minutes: editedMinutes });
              setSecondsLeft(editedMinutes * 60);
            }
            setIsEditingTime(false);
          }}
        />
      )}

      <Button onClick={toggleTimer}>
        {isRunning ? "Pause" : "Start"}
      </Button>

      <Input
        placeholder="Search tasks..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-[260px]"
      />

      <div className="flex gap-2">
        {["all", "active", "completed"].map((f) => (
          <Button
            key={f}
            variant={filter === f ? "default" : "outline"}
            onClick={() => setFilter(f)}
          >
            {f}
          </Button>
        ))}
      </div>

      <Select value={activeTaskId || ""} onValueChange={setActiveTask}>
        <SelectTrigger className="w-[260px]">
          <SelectValue placeholder="Select task" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {filteredTasks.map((task) => (
              <SelectItem key={task.id} value={task.id}>
                {task.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <div className="flex gap-2">
        {activeTask && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Delete Task</Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this task?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. Task{" "}
                  <b>{activeTask.name}</b> will be removed.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-600 hover:bg-red-700"
                  onClick={() => deleteTask(activeTask.id)}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}

        <Button onClick={() => setOpen(true)}>+ Add Task</Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Task</DialogTitle>
            <DialogDescription>Add a new focus task</DialogDescription>
          </DialogHeader>

          <Label>Task Name</Label>
          <Input value={taskName} onChange={(e) => setTaskName(e.target.value)} />

          <Label>Notes</Label>
          <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} />

          <Label>Minutes</Label>
          <Input
            type="number"
            value={minutes}
            onChange={(e) => setMinutes(Number(e.target.value))}
          />

          <DialogFooter>
            <Button onClick={handleSaveTask}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="w-[520px] bg-blue-50 p-4 rounded-xl">
        <div className="text-sm mb-2">
          Daily Progress ({Math.floor(focusedSecondsToday / 60)} mins)
        </div>
        <div className="h-2 bg-blue-100 rounded-full">
          <div
            className="h-full bg-[#258cf4]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default FocusTimer;
