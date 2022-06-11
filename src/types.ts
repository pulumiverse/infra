export interface Member {
    username: string;
    role: string;
    membershipImport?: string;
    teamMembershipImport?: string;
    maintainer: string[];
}