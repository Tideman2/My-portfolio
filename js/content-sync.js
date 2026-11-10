const socialPlatformKey = (value) =>
  String(value ?? "").trim().toLowerCase();

const skillNameKey = (value) =>
  String(value ?? "").trim().toLowerCase();

export function planSocialChanges(existing = [], desired = []) {
  const creates = [];
  const updates = [];
  const desiredByPlatform = new Map();

  for (const social of desired) {
    desiredByPlatform.set(
      socialPlatformKey(social?.platform_name),
      social
    );
  }

  const processedPlatforms = new Set();

  for (const social of existing) {
    const key = socialPlatformKey(social?.platform_name);
    const desiredSocial = desiredByPlatform.get(key);

    if (!desiredSocial) continue;

    processedPlatforms.add(key);

    const sameUrl =
      String(social?.url ?? "") === String(desiredSocial?.url ?? "");

    if (!sameUrl) {
      updates.push({
        id: Number(social.id),
        data: { url: desiredSocial.url },
      });
    }
  }

  for (const social of desired) {
    const key = socialPlatformKey(social?.platform_name);

    if (processedPlatforms.has(key)) continue;

    creates.push({
      platform_name: social.platform_name,
      url: social.url,
    });
  }

  return { create: creates, update: updates };
}

export function planSkillChanges(existing = [], desired = []) {
  const creates = [];
  const updates = [];
  const desiredByName = new Map();

  for (const skill of desired) {
    desiredByName.set(skillNameKey(skill?.name), skill);
  }

  const processedNames = new Set();

  for (const skill of existing) {
    const key = skillNameKey(skill?.name);
    const desiredSkill = desiredByName.get(key);

    if (!desiredSkill) continue;

    processedNames.add(key);

    const sameDescription =
      String(skill?.description ?? "") === String(desiredSkill?.description ?? "");
    const sameProficiency =
      Number(skill?.proficiency) === Number(desiredSkill?.proficiency);

    if (!sameDescription || !sameProficiency) {
      updates.push({
        id: Number(skill.id),
        data: {
          description: desiredSkill.description,
          proficiency: desiredSkill.proficiency,
        },
      });
    }
  }

  for (const skill of desired) {
    const key = skillNameKey(skill?.name);

    if (processedNames.has(key)) continue;

    creates.push({
      name: skill.name,
      description: skill.description,
      proficiency: skill.proficiency,
    });
  }

  return { create: creates, update: updates };
}
