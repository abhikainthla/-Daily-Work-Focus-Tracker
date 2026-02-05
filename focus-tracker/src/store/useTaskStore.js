import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useTaskStore = create(
  persist(
    (set) => ({
      tasks: [
        {
          id: "1",
          name: "Planning Project Architecture",
          notes: "",
          minutes: 30,
          completed: false,
        },
      ],

      activeTaskId: "1",
      hasHydrated: false,

      addTask: (task) =>
        set((state) => ({
          tasks: [...state.tasks, task],
          activeTaskId: task.id,
        })),

      updateTask: (id, updates) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        })),

      deleteTask: (id) =>
        set((state) => {
          const remainingTasks = state.tasks.filter((t) => t.id !== id);

          return {
            tasks: remainingTasks,
            activeTaskId:
              state.activeTaskId === id
                ? remainingTasks[0]?.id ?? null
                : state.activeTaskId,
          };
        }),

      setActiveTask: (id) => set({ activeTaskId: id }),

      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: "focus-tasks",

      partialize: (state) => ({
        tasks: state.tasks,
        activeTaskId: state.activeTaskId,
      }),

      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
