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
    pull: RT.Array(RT.String).optional(),
    triage: RT.Array(RT.String).optional(),
    push: RT.Array(RT.String).optional(),
    maintain: RT.Array(RT.String).optional(),
    admin: RT.Array(RT.String).optional(),
})

export const Labels = RT.Record({
    name: RT.String,
    color: RT.String,
    description: RT.String.optional(),
})

export const Repository = RT.Record({
    name: RT.String,
    description: RT.String,
    type: RT.Union(RT.Literal('administrative'), RT.Literal('provider'), RT.Literal('information')),
    teams: RT.Array(RT.String).optional(),
    topics: RT.Array(RT.String).optional(),
    labels: RT.Array(Labels).optional(),
    hasDownloads: RT.Boolean.optional(),
    import: RT.Boolean.optional(),
    template: RT.String.optional(),
    removable: RT.Boolean.optional(),
    archived: RT.Boolean.optional(),
    workflows: RT.Literal('ci-mgmt').optional(),
})

export type Team = Static<typeof Team>
export type Member = Static<typeof Member>
export type Repository = Static<typeof Repository>
