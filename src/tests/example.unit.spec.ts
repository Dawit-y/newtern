import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";

describe("cn utility", () => {
  it("merges conditional and duplicate classes", () => {
    expect(cn("p-2", "p-2", false && "hidden", "text-sm")).toBe("p-2 text-sm");
  });
});


