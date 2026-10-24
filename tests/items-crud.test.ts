import { describe, it, expect, beforeEach } from "vitest";
import { app } from "../src/server/routes/api.ts";
import { db } from "../src/server/db/database.ts";
import { seedDemoData } from "../src/server/db/seed.ts";

describe("Festiya Item CRUD & Collaboration Engine Tests", () => {
  beforeEach(async () => {
    await seedDemoData(db);
  });

  describe("Task Lifecycle Management", () => {
    it("lists all tasks for an event", async () => {
      const res = await app.request("/api/events/evt_wedding_jaipur/tasks", {
        headers: { "x-user-id": "usr_souvik" },
      });
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(Array.isArray(data.tasks)).toBe(true);
      expect(data.tasks.length).toBeGreaterThan(0);
    });

    it("creates, updates, and deletes a task", async () => {
      // 1. Create Task (returns 201)
      const createRes = await app.request("/api/events/evt_wedding_jaipur/tasks", {
        method: "POST",
        headers: {
          "x-user-id": "usr_souvik",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: "Finalize NeoPOP LED Wall Vendor",
          category: "production",
          priority: "high",
          dueDate: "2026-11-01",
        }),
      });
      expect(createRes.status).toBe(201);
      const { task } = await createRes.json();
      expect(task.id).toBeDefined();
      expect(task.title).toBe("Finalize NeoPOP LED Wall Vendor");
      expect(task.status).toBe("todo");

      // 2. Update Task (Patch)
      const patchRes = await app.request(`/api/events/evt_wedding_jaipur/tasks/${task.id}`, {
        method: "PATCH",
        headers: {
          "x-user-id": "usr_souvik",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "done",
          priority: "urgent",
        }),
      });
      expect(patchRes.status).toBe(200);
      const { task: updatedTask } = await patchRes.json();
      expect(updatedTask.status).toBe("done");

      // 3. Delete Task
      const deleteRes = await app.request(`/api/events/evt_wedding_jaipur/tasks/${task.id}`, {
        method: "DELETE",
        headers: { "x-user-id": "usr_souvik" },
      });
      expect(deleteRes.status).toBe(200);
      const deleteData = await deleteRes.json();
      expect(deleteData.success).toBe(true);
    });
  });

  describe("Budget Items Management", () => {
    it("lists budget items with categories and planned vs actual amounts", async () => {
      const res = await app.request("/api/events/evt_wedding_jaipur/budget-items", {
        headers: { "x-user-id": "usr_souvik" },
      });
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(Array.isArray(data.items)).toBe(true);
      expect(data.items.length).toBeGreaterThan(0);
    });

    it("creates, patches and deletes a line item", async () => {
      // Create line item (returns 201)
      const createRes = await app.request("/api/events/evt_wedding_jaipur/budget-items", {
        method: "POST",
        headers: {
          "x-user-id": "usr_souvik",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category: "entertainment",
          label: "Holographic Laser Display",
          likelyEstimate: 350000,
          currency: "INR",
        }),
      });
      expect(createRes.status).toBe(201);
      const { item } = await createRes.json();
      expect(item.id).toBeDefined();
      expect(item.likelyEstimate).toBe(350000);

      // Patch line item
      const patchRes = await app.request(`/api/events/evt_wedding_jaipur/budget-items/${item.id}`, {
        method: "PATCH",
        headers: {
          "x-user-id": "usr_souvik",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          actualAmount: 320000,
          status: "committed",
        }),
      });
      expect(patchRes.status).toBe(200);
      const { item: updatedItem } = await patchRes.json();
      expect(updatedItem.actualAmount).toBe(320000);

      // Delete line item
      const delRes = await app.request(`/api/events/evt_wedding_jaipur/budget-items/${item.id}`, {
        method: "DELETE",
        headers: { "x-user-id": "usr_souvik" },
      });
      expect(delRes.status).toBe(200);
      const delData = await delRes.json();
      expect(delData.success).toBe(true);
    });
  });

  describe("Vendor Roster & Sourcing", () => {
    it("lists vendors and creates a new partner record", async () => {
      const listRes = await app.request("/api/events/evt_wedding_jaipur/vendors", {
        headers: { "x-user-id": "usr_souvik" },
      });
      expect(listRes.status).toBe(200);
      const { vendors } = await listRes.json();
      expect(Array.isArray(vendors)).toBe(true);

      const addRes = await app.request("/api/events/evt_wedding_jaipur/vendors", {
        method: "POST",
        headers: {
          "x-user-id": "usr_souvik",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Jaipur Sound & Kinetic Rigging",
          category: "production",
          contactPerson: "Karan Verma",
          contactEmail: "karan@jaipursound.in",
          priceQuote: 450000,
          currency: "INR",
          status: "contracted",
        }),
      });
      expect(addRes.status).toBe(201);
      const { vendor } = await addRes.json();
      expect(vendor.name).toBe("Jaipur Sound & Kinetic Rigging");

      // Patch vendor status
      const patchRes = await app.request(`/api/events/evt_wedding_jaipur/vendors/${vendor.id}`, {
        method: "PATCH",
        headers: {
          "x-user-id": "usr_souvik",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rating: 5, notes: "Flawless sound check completed" }),
      });
      expect(patchRes.status).toBe(200);

      // Delete vendor
      const delRes = await app.request(`/api/events/evt_wedding_jaipur/vendors/${vendor.id}`, {
        method: "DELETE",
        headers: { "x-user-id": "usr_souvik" },
      });
      expect(delRes.status).toBe(200);
    });
  });

  describe("Creative Ideas & Risk Register", () => {
    it("retrieves creative ideas and upvotes an idea", async () => {
      const ideasRes = await app.request("/api/events/evt_wedding_jaipur/ideas", {
        headers: { "x-user-id": "usr_souvik" },
      });
      expect(ideasRes.status).toBe(200);
      const { ideas } = await ideasRes.json();
      expect(ideas.length).toBeGreaterThan(0);

      const idea = ideas[0];
      const patchRes = await app.request(`/api/events/evt_wedding_jaipur/ideas/${idea.id}`, {
        method: "PATCH",
        headers: {
          "x-user-id": "usr_souvik",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "approved" }),
      });
      expect(patchRes.status).toBe(200);
      const { idea: updatedIdea } = await patchRes.json();
      expect(updatedIdea.status).toBe("approved");
    });

    it("retrieves operational risk matrix", async () => {
      const riskRes = await app.request("/api/events/evt_wedding_jaipur/risks", {
        headers: { "x-user-id": "usr_souvik" },
      });
      expect(riskRes.status).toBe(200);
      const { risks } = await riskRes.json();
      expect(Array.isArray(risks)).toBe(true);
      expect(risks.length).toBeGreaterThan(0);
      expect(risks[0].severity).toBeDefined();
      expect(risks[0].mitigation).toBeDefined();
    });
  });

  describe("Run-of-Show Timelines", () => {
    it("lists and appends chronological milestones", async () => {
      const getRes = await app.request("/api/events/evt_wedding_jaipur/run-of-show", {
        headers: { "x-user-id": "usr_souvik" },
      });
      expect(getRes.status).toBe(200);
      const { items } = await getRes.json();
      expect(Array.isArray(items)).toBe(true);

      const addRes = await app.request("/api/events/evt_wedding_jaipur/run-of-show", {
        method: "POST",
        headers: {
          "x-user-id": "usr_souvik",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          timeLabel: "21:30",
          activity: "Sangeet Grand Finale Dance",
          ownerName: "Choreography Lead",
          sortOrder: 10,
        }),
      });
      expect(addRes.status).toBe(201);
      const { item } = await addRes.json();
      expect(item.timeLabel).toBe("21:30");
      expect(item.activity).toBe("Sangeet Grand Finale Dance");
    });
  });
});
