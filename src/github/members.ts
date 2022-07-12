import * as github from "@pulumi/github";
import * as pulumi from "@pulumi/pulumi";
import { Member } from "../configTypes";

export function configureOrganizationMembers(memberArgs: Member[], allTeams: Map<string, github.Team>, allRepositories: Map<string, github.Repository>): Map<string, github.Membership> {
    let members = new Map<string, github.Membership>()
    memberArgs.map((memberInfo) => {
        let orgMembership = new github.Membership(memberInfo.username, {
            username: memberInfo.username,
            role: memberInfo.role || 'member'
        }, {
            aliases: memberInfo.membershipImport ? [{
                name: memberInfo.membershipImport
            }] : []
        });
        members.set(memberInfo.username, orgMembership);

        let createTeamMembership = (requiredTeam: string, role: string) => {
            pulumi.log.debug(`Applying change: ${memberInfo.username} as member to ${requiredTeam}`)
            if (allTeams.has(requiredTeam)) {
                let team = allTeams.get(requiredTeam)
                if (!team) {
                    throw new Error(`Team ${requiredTeam} not found`)
                }
                new github.TeamMembership(`${requiredTeam}_${memberInfo.username}`,
                    {
                        username: memberInfo.username,
                        teamId: team.id,
                        role: role
                    },
                    {
                        parent: allTeams.get(requiredTeam),
                        dependsOn: orgMembership, // Can only add to team after being added to the organization
                        aliases: memberInfo.teamMembershipImport ? [{
                            parent: pulumi.rootStackResource
                        }, {
                            name: memberInfo.teamMembershipImport
                        }] : []
                    }
                )
            } else {
                let message = `Team ${JSON.stringify(requiredTeam)} doesn't exist for member ${memberInfo.username}. Did you create the team or is this a typo?`
                throw new Error(message);
            }
        };

        memberInfo.maintainer?.forEach((team) => {
            pulumi.log.debug(`Configure ${memberInfo.username} as maintainer to ${team}`)
            createTeamMembership(team, 'maintainer')
        })
        memberInfo.member?.forEach((team) => {
            pulumi.log.debug(`Configure ${memberInfo.username} as member to ${team}`)
            createTeamMembership(team, 'member')
        })


    })
    return members
};
