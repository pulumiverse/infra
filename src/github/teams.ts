import * as github from "@pulumi/github";
import * as owners from './owners';

const board = new github.Team('governance_board',
    {
        name: 'governance_board',
        description: 'Governance Board'
    }
)

const board_ringods = new github.TeamMembership('board_ringods',
    {
        teamId: board.id,
        username: 'ringods',
        role: 'maintainer'
    }
)

const board_cobraz = new github.TeamMembership('board_cobraz',
    {
        teamId: board.id,
        username: 'cobraz',
        role: 'maintainer'
    }
)

export const all_teams = [ board ]