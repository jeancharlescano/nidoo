type Membership = {
  id: string;
  familyId: string;
  family: { members: { id: string; userId: string; role: string }[] };
};

// Bind confirmation to the membership state displayed to the user.
export function membershipSnapshot(memberships: Membership[]) {
  return JSON.stringify(
    memberships
      .map((membership) => ({
        id: membership.id,
        familyId: membership.familyId,
        members: membership.family.members
          .map(({ id, userId, role }) => ({ id, userId, role }))
          .sort((a, b) => a.id.localeCompare(b.id)),
      }))
      .sort((a, b) => a.id.localeCompare(b.id)),
  );
}

