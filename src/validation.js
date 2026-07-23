const ZIP_RE = /^\d{5}(-\d{4})?$/;

function validateName(name) {
  if (typeof name !== "string" || name.trim().length === 0) {
    return null;
  }
  return name.trim();
}

function validateZipCode(zipCode) {
  if (typeof zipCode !== "string" || !ZIP_RE.test(zipCode.trim())) {
    return null;
  }
  return zipCode.trim();
}

// Returns { error } or { name, zipCode }
function validateCreate(body = {}) {
  const name = validateName(body.name);
  if (!name) return { error: "name is required" };
  const zipCode = validateZipCode(body.zipCode);
  if (!zipCode) return { error: "zipCode must be a valid US zip code (e.g. 10001)" };
  return { name, zipCode };
}

// Returns { error } or { name?, zipCode? } with at least one field present
function validateUpdate(body = {}) {
  const result = {};
  if (body.name !== undefined) {
    const name = validateName(body.name);
    if (!name) return { error: "name must not be empty" };
    result.name = name;
  }
  if (body.zipCode !== undefined) {
    const zipCode = validateZipCode(body.zipCode);
    if (!zipCode) return { error: "zipCode must be a valid US zip code (e.g. 10001)" };
    result.zipCode = zipCode;
  }
  if (Object.keys(result).length === 0) {
    return { error: "At least one of name or zipCode must be provided" };
  }
  return result;
}

module.exports = { validateCreate, validateUpdate };
