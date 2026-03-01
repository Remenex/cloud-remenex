export function getUserInitials(user?: {
  name?: string | null;
  email?: string | null;
}) {
  let firstname = "";
  let lastname = "";

  if (!user) return { firstname, lastname };

  if (user.name) {
    const nameParts = user.name.trim().split(" ");
    firstname = nameParts[0] ?? "";
    lastname = nameParts[1] ?? "";
  } else if (user.email) {
    const email = user.email.trim();
    firstname = email[0] ?? "";
    lastname = email[1] ?? "";
  }

  return { firstname, lastname };
}
