import { getUserInitials } from "./get-user-initials";
import { getColorForLetter } from "./letter-color";

export function getUserColor(user?: {
  name?: string | null;
  email?: string | null;
}) {
  const { firstname } = getUserInitials(user);
  return getColorForLetter(firstname.charAt(0));
}
