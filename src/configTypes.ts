import * as RT from "runtypes";
import {Static} from "runtypes/lib/runtype";

export const Team = RT.Record({
    name: RT.String,
    description: RT.String,
})

export const Member = RT.Record({
    username: RT.String,
    role: RT.String.optional(),
    membershipImport: RT.String.optional(),
    teamMembershipImport: RT.String.optional(),
    maintainer: RT.Array(RT.String).optional(),
    member: RT.Array(RT.String).optional(),
})

export const Repository = RT.Record({
    name: RT.String,
    description: RT.String,
    type: RT.Union(RT.Literal('administrative'), RT.Literal('provider'), RT.Literal('information')),
    teams: RT.Array(RT.String).optional(),
    topics: RT.Array(RT.String).optional(),
    import: RT.Boolean.optional(),
    template: RT.String.optional(),
})

export type Team = Static<typeof Team>
export type Member = Static<typeof Member>
export type Repository = Static<typeof Repository>
