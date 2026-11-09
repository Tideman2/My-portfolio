import test from "node:test";
import assert from "node:assert/strict";
import {
  fallbackContent,
  fallbackSocials,
  fallbackTechnicalSkills,
  fallbackProfessionalSkills,
  proficiencyFromPercentage,
} from "../js/fallback-data.js";

test("percentage buckets map to 1-5", () => {
  assert.equal(proficiencyFromPercentage(0), 1);
  assert.equal(proficiencyFromPercentage(20), 1);
  assert.equal(proficiencyFromPercentage(21), 2);
  assert.equal(proficiencyFromPercentage(40), 2);
  assert.equal(proficiencyFromPercentage(60), 3);
  assert.equal(proficiencyFromPercentage(75), 4);
  assert.equal(proficiencyFromPercentage(100), 5);
});

test("fallback content has the expected shapes", () => {
  assert.equal(fallbackContent.profile.name, "Isaac Mark");
  assert.match(fallbackContent.profile.bio, /self-taught frontend developer/i);
  assert.equal(fallbackSocials.length, 4);
  assert.equal(fallbackTechnicalSkills.length, 12);
  assert.equal(fallbackProfessionalSkills.length, 5);
  for (const skill of [
    ...fallbackTechnicalSkills,
    ...fallbackProfessionalSkills,
  ]) {
    assert.ok(skill.name);
    assert.ok(skill.description);
    assert.ok(skill.proficiency >= 1 && skill.proficiency <= 5);
  }
});
