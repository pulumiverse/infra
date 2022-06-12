import * as RT from "runtypes";
import {Static} from "runtypes/lib/runtype";

export const TeamType = RT.Record({
    name: RT.String,
    description: RT.String,
})

export const MemberType = RT.Record({
    username: RT.String,
    role: RT.String.optional(),
    membershipImport: RT.String.optional(),
    teamMembershipImport: RT.String.optional(),
    maintainer: RT.Array(RT.String).optional(),
    member: RT.Array(RT.String).optional(),
})

export const RepositoryType = RT.Record({
    name: RT.String,
    description: RT.String,
    type: RT.Union(RT.Literal('provider')),
    teams: RT.Array(RT.String).optional(),
    import: RT.Boolean.optional(),
})

export type TeamType = Static<typeof TeamType>
export type MemberType = Static<typeof MemberType>
export type RepositoryType = Static<typeof RepositoryType>
