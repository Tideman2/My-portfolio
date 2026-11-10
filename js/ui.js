export const PROJECTS_PER_PAGE = 6;

export function proficiencyLabel(value) {
  return `Proficiency ${value} out of 5`;
}

export function formatStack(stack) {
  if (Array.isArray(stack)) {
    return stack.map((item) => String(item).trim()).filter(Boolean);
  }
  return String(stack ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function platformKey(name) {
  return String(name ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

export function platformIcon(name) {
  const key = platformKey(name);
  if (key.includes("linkedin")) return "linkedin";
  if (key.includes("github")) return "github";
  if (key.includes("whatsapp")) return "whatsapp";
  if (key.includes("gmail") || key.includes("email") || key.includes("mail")) {
    return "email";
  }
  return "link";
}

export function validateEmail(value) {
  const email = String(value ?? "").trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validateContactForm(values) {
  const name = String(values?.name ?? "").trim();
  const email = String(values?.email ?? "").trim();
  const subject = String(values?.subject ?? "").trim();
  const message = String(values?.message ?? "").trim();
  const errors = {};

  if (!name) errors.name = "Enter your name.";
  if (!email) {
    errors.email = "Enter your email address.";
  } else if (!validateEmail(email)) {
    errors.email = "Enter a valid email address.";
  }
  if (!subject) errors.subject = "Enter a subject.";
  if (!message) errors.message = "Enter a message.";

  return { valid: Object.keys(errors).length === 0, errors };
}

export function paginate(items, page, perPage = PROJECTS_PER_PAGE) {
  const list = Array.isArray(items) ? items : [];
  const size = Math.max(1, Number(perPage) || PROJECTS_PER_PAGE);
  const current = Math.max(1, Number(page) || 1);
  const start = (current - 1) * size;
  const end = start + size;
  return {
    items: list.slice(start, end),
    page: current,
    hasMore: end < list.length,
  };
}

export function needsReadMore(goalText, limit = 150) {
  return String(goalText ?? "").trim().length > limit;
}

export function splitBio(bio) {
  return String(bio ?? "")
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

export function initials(name) {
  return String(name ?? "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}

export function prefersReducedMotion(matchMedia) {
  const query =
    matchMedia ??
    (typeof window !== "undefined" && typeof window.matchMedia === "function"
      ? window.matchMedia.bind(window)
      : null);
  if (typeof query !== "function") return false;
  try {
    return Boolean(query("(prefers-reduced-motion: reduce)")?.matches);
  } catch {
    return false;
  }
}

export function revealOnScroll(
  elements,
  { observer, reducedMotion = prefersReducedMotion() } = {}
) {
  const list = Array.from(elements ?? []);
  const show = (element) => element?.classList?.add("is-visible");

  if (reducedMotion || (!observer && typeof IntersectionObserver === "undefined")) {
    list.forEach(show);
    return;
  }

  if (typeof observer === "function") {
    observer(list, show);
    return;
  }

  if (observer && typeof observer.observe === "function") {
    list.forEach((element) => observer.observe(element));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          show(entry.target);
          io.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  list.forEach((element) => io.observe(element));
}
