import { Member } from "./types";

export const members: Member[] = [
    // Valid member
    {
        username: 'ringods',
        role: 'admin',
        membershipImport: 'owner_ringods',
        teamMembershipImport: 'board_ringods',
        maintainer: ['governance_board']
    },
    // Invalid member
    {
        user: 'ghost'
    },
];