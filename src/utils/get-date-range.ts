export const getDateRange = (type: "month" | "day") => {
  const now = new Date();
  let start, end;

  if (type === "month") {
    start = new Date(now.getFullYear(), now.getMonth(), 1);
    end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
  } else if (type === "day") {
    start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    end = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59,
    );
  }

  return { start, end };
};
