import * as github from "@pulumi/github";
import {TeamType} from "../configTypes";

// const boardmembers = [
//     'ringods',
//     'cobraz',
//     'usrbinkat',
//     'rawkode',
//     'tenwit'
// ];

// boardmembers.map((userid) => {
//     const board_ringods = new github.TeamMembership(`board_${userid}`,
//         {
//             teamId: board.id,
//             username: userid,
//             role: 'maintainer'
//         }
//     )
// })

export function configureOrganizationTeams(teamArgs: TeamType[]): Map<string, github.Team> {
    let teams = new Map<string, github.Team>()
    teamArgs.map((teamInfo) => {
        teams.set(teamInfo.name, new github.Team(teamInfo.name, {
            description: teamInfo.description,
            name: teamInfo.name,
        }));
    })
    return teams
}

// export const all_teams = [board]