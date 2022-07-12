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
    type: RT.Union(RT.Literal('administrative'), RT.Literal('provider'), RT.Literal('information')),
    teams: RT.Array(RT.String).optional(),
    topics: RT.Array(RT.String).optional(),
    import: RT.Boolean.optional(),
    template: RT.String.optional(),
})

export type Team = Static<typeof TeamType>
export type Member = Static<typeof MemberType>
export type Repository = Static<typeof RepositoryType>
