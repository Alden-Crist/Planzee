import React, { useMemo, useState } from "react";
import { CT_CLASSES, SORT_OPTIONS } from "../assets/dummy";
import { CheckCircle2 } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import TaskItem from "../components/TaskItem";
import { Filter } from "lucide-react";

function CompletePage() {
  const { tasks, refreshTasks, loading } = useOutletContext();
  const [sortBy, setSortBy] = useState("newest");

  const sortedCompletedTasks = useMemo(() => {
    return tasks
      .filter((tasks) =>
        [true, 1, "yes"].includes(
          typeof tasks.completed === "string"
            ? tasks.completed.toLowerCase()
            : tasks.completed
        )
      )
      .sort((a, b) => {
        switch (sortBy) {
          case "newest":
            return new Date(b.createdAt) - new Date(a.createdAt);

          case "oldes":
            return new Date(a.createdAt) - new Date(b.createdAt);

          case "priority": {
            const order = { high: 3, medium: 2, low: 1 };
            return (
              order[b.priority?.toLowerCase()] -
              order[a.priority?.toLowerCase()]
            );
          }
          default:
            return 0;
        }
      });
  }, [tasks, sortBy]);

  const Header = (
    <div className={CT_CLASSES.header}>
      <div className={CT_CLASSES.titleWrapper}>
        <h1 className={CT_CLASSES.title}>
          <CheckCircle2 className="text-teal-500 w-5 h-5 md:w-6 md:h-6" />
          <span className="truncate">Completed Tasks</span>
        </h1>
        <p className={CT_CLASSES.subtitle}>
          {loading ? (
            <span className="inline-block h-4 w-12 bg-teal-200 rounded animate-pulse"></span>
          ) : (
            <>
              {sortedCompletedTasks.length} task
              {sortedCompletedTasks.length !== 1 && "s"} marked as complete
            </>
          )}
        </p>
      </div>

      {/* SORT CONTROLS */}
      <div className={CT_CLASSES.sortContainer}>
        <div className={CT_CLASSES.sortBox}>
          <div className={CT_CLASSES.filterLabel}>
            <Filter className="w-4 h-4 text-teal-500" />
            <span className="text-x5 md:text-sm">Sort by:</span>
          </div>

          {/* MOBILE DROPDOWN */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={CT_CLASSES.select}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
                {opt.id === "newest" ? "First" : ""}
              </option>
            ))}
          </select>

          {/* DESKTOP BUTTONS */}
          <div className={CT_CLASSES.btnGroup}>
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setSortBy(opt.id)}
                className={[
                  CT_CLASSES.btnBase,
                  sortBy === opt.id
                    ? CT_CLASSES.btnActive
                    : CT_CLASSES.btnInactive,
                ].join(" ")}
              >
                {opt.icon}
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={CT_CLASSES.page}>
      {/* HEADER */}
      {Header}
      {/* TASK LIST */}
      <div className={CT_CLASSES.list}>
        {loading ? (
          // ✅ Skeleton Loader for Completed Tasks
          Array.from({ length: 3

           }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 border-b border-teal-100 animate-pulse"
            >
              {/* Left side (title + desc) */}
              <div className="flex-1 space-y-2">
                <div className="h-4 w-2/3 bg-teal-200/70 rounded"></div>
                <div className="h-3 w-1/2 bg-teal-100 rounded"></div>
              </div>
              {/* Right side (status/date placeholder) */}
              <div className="h-4 w-16 bg-teal-200/70 rounded"></div>
            </div>
          ))
        ) : sortedCompletedTasks.length === 0 ? (
          <div className={CT_CLASSES.emptyState}>
            <div className={CT_CLASSES.emptyIconWrapper}>
              <CheckCircle2 className="w-6 h-6 md:w-8 md:h-8 text-teal-500" />
            </div>
            <h3 className={CT_CLASSES.emptyTitle}>No completed tasks yet!</h3>
            <p>Complete some tasks and they'll appear here</p>
          </div>
        ) : (
          sortedCompletedTasks.map((task) => (
            <TaskItem
              key={task._id || task.id}
              task={task}
              onRefresh={refreshTasks}
              showCompleteCheckbox={false}
              className="opacity-90 hover:opacity-100 transition-opacity text-sm md:text-base"
            />
          ))
        )}
      </div>
    </div>
  );
}

export default CompletePage;
