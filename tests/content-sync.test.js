import test from "node:test";
import assert from "node:assert/strict";
import { planSocialChanges, planSkillChanges } from "../js/content-sync.js";

test("planSocialChanges skips an unchanged social and creates a missing one", () => {
  const plan = planSocialChanges(
    [{ id: 2, platform_name: "GitHub", url: "https://github.com/Tideman2" }],
    [
      { platform_name: "GitHub", url: "https://github.com/Tideman2" },
      { platform_name: "Email", url: "mailto:isaacmark83@gmail.com" },
    ]
  );

  assert.deepEqual(plan, {
    create: [{ platform_name: "Email", url: "mailto:isaacmark83@gmail.com" }],
    update: [],
  });
});

test("planSocialChanges updates a social when the platform URL changes", () => {
  const plan = planSocialChanges(
    [{ id: 12, platform_name: "LinkedIn", url: "https://old.example.com/in/old" }],
    [{ platform_name: "LinkedIn", url: "https://new.example.com/in/new" }]
  );

  assert.deepEqual(plan, {
    create: [],
    update: [{ id: 12, data: { url: "https://new.example.com/in/new" } }],
  });
});

test("planSocialChanges ignores existing socials that are not desired", () => {
  const plan = planSocialChanges(
    [{ id: 99, platform_name: "Twitter", url: "https://twitter.com/extra" }],
    [{ platform_name: "GitHub", url: "https://github.com/Tideman2" }]
  );

  assert.deepEqual(plan, {
    create: [{ platform_name: "GitHub", url: "https://github.com/Tideman2" }],
    update: [],
  });
});

test("planSkillChanges updates a skill with changed description or proficiency", () => {
  const plan = planSkillChanges(
    [{ id: 7, name: "JavaScript", description: "Old description.", proficiency: 2 }],
    [{ name: " javascript ", description: "New description.", proficiency: 4 }]
  );

  assert.deepEqual(plan, {
    create: [],
    update: [{ id: 7, data: { description: "New description.", proficiency: 4 } }],
  });
});

test("planSkillChanges creates a missing skill", () => {
  const plan = planSkillChanges(
    [{ id: 3, name: "Old Skill", description: "Old.", proficiency: 1 }],
    [{ name: "New Skill", description: "New.", proficiency: 2 }]
  );

  assert.deepEqual(plan, {
    create: [{ name: "New Skill", description: "New.", proficiency: 2 }],
    update: [],
  });
});
