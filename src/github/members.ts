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

        let createMembership = (requiredTeamOrRepo: string, role: string) => {
            pulumi.log.debug(`Applying change: ${memberInfo.username} as member to ${requiredTeamOrRepo}`)
            if (allTeams.has(requiredTeamOrRepo) || allRepositories.has(requiredTeamOrRepo)) {
                let team = allTeams.get(requiredTeamOrRepo)
                let repo = allRepositories.get(requiredTeamOrRepo)
                if (!team && !repo) {
                    throw new Error(`Team or Repository ${requiredTeamOrRepo} not found`)
                }
                if (team) {
                    new github.TeamMembership(`${requiredTeamOrRepo}_${memberInfo.username}`,
                        {
                            username: memberInfo.username,
                            teamId: team.id,
                            role: role
                        },
                        {
                            parent: allTeams.get(requiredTeamOrRepo),
                            dependsOn: orgMembership, // Can only add to team after being added to the organization
                            aliases: memberInfo.teamMembershipImport ? [
                                {
                                    parent: pulumi.rootStackResource
                                },
                                {
                                    name: memberInfo.teamMembershipImport
                                }
                            ] : []
                        }
                    )
                } else if (repo) {
                    new github.RepositoryCollaborator(`${requiredTeamOrRepo}_${memberInfo.username}`,
                        {
                            username: memberInfo.username,
                            repository: repo.id,
                            permission: role === 'maintainer' ? 'maintain' : 'push'
                        },
                        {
                            parent: allTeams.get(requiredTeamOrRepo),
                            dependsOn: orgMembership, // Can only add to team after being added to the organization
                            aliases: memberInfo.teamMembershipImport ? [
                                {
                                    parent: pulumi.rootStackResource
                                },
                                {
                                    name: memberInfo.teamMembershipImport
                                }
                            ] : []
                        }
                    )
                }
            } else {
                let message = `Team ${JSON.stringify(requiredTeamOrRepo)} doesn't exist for member ${memberInfo.username}. Did you create the team or is this a typo?`
                throw new Error(message);
            }
        };

        memberInfo.maintainer?.forEach((teamOrRepo) => {
            pulumi.log.debug(`Configure ${memberInfo.username} as maintainer to ${teamOrRepo}`)
            createMembership(teamOrRepo, 'maintainer')
        })
        memberInfo.member?.forEach((teamOrRepo) => {
            pulumi.log.debug(`Configure ${memberInfo.username} as member to ${teamOrRepo}`)
            createMembership(teamOrRepo, 'member')
        })


    })
    return members
};
