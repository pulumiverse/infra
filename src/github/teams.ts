import * as github from "@pulumi/github";
import * as owners from './owners';

const board = new github.Team('governance_board',
    {
        name: 'governance_board',
        description: 'Governance Board'
    }
)

const boardmembers = [
    'ringods',
    'cobraz',
    'usrbinkat',
    'rawkode',
    'tenwit'
];

boardmembers.map((userid) => {
    const board_ringods = new github.TeamMembership(`board_${userid}`,
        {
            teamId: board.id,
            username: userid,
            role: 'maintainer'
        }
    )
})

export const all_teams = [board]