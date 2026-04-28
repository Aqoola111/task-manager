import { describe, expect, it } from "vitest";

import { createTaskSchema, updateTaskStatusSchema } from "./task";

const VALID_OBJECT_ID = "507f1f77bcf86cd799439011";

describe("createTaskSchema", () => {
  it("accepts minimal valid payload", () => {
    const parsed = createTaskSchema.parse({
      name: "Task",
      description: "",
      projectId: VALID_OBJECT_ID,
      status: "todo",
      priority: "medium",
    });
    expect(parsed.description).toBe("");
  });

  it("rejects whitespace-only name after trim", () => {
    expect(() =>
      createTaskSchema.parse({
        name: " \t ",
        description: "",
        projectId: VALID_OBJECT_ID,
        status: "todo",
        priority: "low",
      }),
    ).toThrow();
  });

  it("rejects project id that is not 24 hex chars", () => {
    expect(() =>
      createTaskSchema.parse({
        name: "Task",
        description: "",
        projectId: "507f1f77bcf86cd79943901",
        status: "todo",
        priority: "medium",
      }),
    ).toThrow();
  });

  it("rejects project id with invalid characters", () => {
    expect(() =>
      createTaskSchema.parse({
        name: "Task",
        description: "",
        projectId: "zzzzzzzzzzzzzzzzzzzzzzzz",
        status: "todo",
        priority: "medium",
      }),
    ).toThrow();
  });

  it("rejects description longer than limit", () => {
    expect(() =>
      createTaskSchema.parse({
        name: "Task",
        description: "x".repeat(5001),
        projectId: VALID_OBJECT_ID,
        status: "todo",
        priority: "medium",
      }),
    ).toThrow();
  });

  it("accepts cancelled status", () => {
    const parsed = createTaskSchema.parse({
      name: "Task",
      description: "Notes",
      projectId: VALID_OBJECT_ID,
      status: "cancelled",
      priority: "urgent",
    });
    expect(parsed.status).toBe("cancelled");
  });
});

describe("updateTaskStatusSchema", () => {
  it("accepts valid ids", () => {
    const parsed = updateTaskStatusSchema.parse({
      taskId: VALID_OBJECT_ID,
      status: "done",
    });
    expect(parsed.taskId).toBe(VALID_OBJECT_ID);
    expect(parsed.status).toBe("done");
  });

  it("rejects malformed task id", () => {
    expect(() =>
      updateTaskStatusSchema.parse({
        taskId: "not-an-objectid",
        status: "todo",
      }),
    ).toThrow();
  });
});
