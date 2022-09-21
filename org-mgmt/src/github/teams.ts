import * as github from "@pulumi/github";
import {Team} from "../configTypes";

export function configureOrganizationTeams(teamArgs: Team[]): Map<string, github.Team> {
    let teams = new Map<string, github.Team>()
    teamArgs.map((teamInfo) => {
        teams.set(teamInfo.name, new github.Team(teamInfo.name, {
            description: teamInfo.description,
            name: teamInfo.name,
        }));
    })
    return teams
}
