import { useState, useRef, useEffect } from "react";
import {
  ChevronDown,
  Check,
  Flag,
  Clock,
  AlertCircle,
  Zap,
} from "lucide-react";

const priorities = [
  {
    value: "Low",
    color: "bg-teal-50 text-teal-600 border-teal-200",
    icon: Clock,
  },
  {
    value: "Medium",
    color: "bg-teal-100 text-teal-700 border-teal-300",
    icon: AlertCircle,
  },
  {
    value: "High",
    color: "bg-teal-600 text-white border-teal-600",
    icon: Zap,
  },
];

export default function PrioritySelect({ taskData, setTaskData }) {
  const [open, setOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
        setFocusedIndex(-1);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  const handleKeyDown = (event) => {
    if (!open) {
      if (
        event.key === "Enter" ||
        event.key === " " ||
        event.key === "ArrowDown"
      ) {
        event.preventDefault();
        setOpen(true);
        setFocusedIndex(0);
      }
      return;
    }

    switch (event.key) {
      case "Escape":
        setOpen(false);
        setFocusedIndex(-1);
        buttonRef.current?.focus();
        break;
      case "ArrowDown":
        event.preventDefault();
        setFocusedIndex((prev) => (prev + 1) % priorities.length);
        break;
      case "ArrowUp":
        event.preventDefault();
        setFocusedIndex(
          (prev) => (prev - 1 + priorities.length) % priorities.length
        );
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        if (focusedIndex >= 0) {
          handleSelect(priorities[focusedIndex]);
        }
        break;
    }
  };

  const handleSelect = (priority) => {
    setTaskData((prev) => ({ ...prev, priority: priority.value }));
    setOpen(false);
    setFocusedIndex(-1);
    buttonRef.current?.focus();
  };

  const selectedPriority = priorities.find(
    (p) => p.value === taskData.priority
  );

  return (
    <div className="relative w-48" ref={dropdownRef}>
      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
        <Flag className="w-4 h-4 text-teal-600" />
        Priority Level
      </label>

      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        onKeyDown={handleKeyDown}
        className={`w-full flex justify-between items-center rounded-lg border-2 bg-white py-2.5 px-3 text-left shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${
          open
            ? "border-teal-500 shadow-md"
            : "border-gray-200 hover:border-teal-300 hover:shadow-sm"
        }`}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label="Select priority level"
      >
        <div className="flex items-center gap-2">
          {selectedPriority ? (
            <>
              <selectedPriority.icon className="w-4 h-4 text-teal-600" />
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${selectedPriority.color}`}
              >
                {selectedPriority.value}
              </span>
            </>
          ) : (
            <>
              <div className="w-4 h-4 rounded-full bg-gray-200" />
              <span className="text-gray-500 text-sm">Select priority</span>
            </>
          )}
        </div>
        <ChevronDown
          className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
            open ? "rotate-180 text-teal-600" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute mt-2 w-full rounded-lg bg-white shadow-xl ring-1 ring-black/5 z-50 border border-gray-100 animate-in fade-in-0 zoom-in-95 duration-200">
          <div className="py-1">
            {priorities.map((priority, index) => {
              const selected = taskData.priority === priority.value;
              const focused = focusedIndex === index;
              const IconComponent = priority.icon;

              return (
                <div
                  key={priority.value}
                  onClick={() => handleSelect(priority)}
                  onMouseEnter={() => setFocusedIndex(index)}
                  className={`cursor-pointer select-none py-2 px-3 flex items-center justify-between transition-colors duration-150 ${
                    focused || selected ? "bg-teal-100" : "hover:bg-teal-50"
                  }`}
                  role="option"
                  aria-selected={selected}
                >
                  <div className="flex items-center gap-2">
                    <IconComponent
                      className={`w-4 h-4 ${
                        priority.value === "High"
                          ? "text-teal-600"
                          : "text-teal-500"
                      }`}
                    />
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${priority.color}`}
                    >
                      {priority.value}
                    </span>
                  </div>
                  {selected && (
                    <Check className="h-4 w-4 text-teal-600 animate-in zoom-in-50 duration-200" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
