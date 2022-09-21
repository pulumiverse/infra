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
        let govBoard = allTeams.get('governance_board');
        if(govBoard && memberInfo.role == 'admin') {
            new github.TeamMembership(`governance_board_${memberInfo.username}`,
                {
                    username: memberInfo.username,
                    teamId: govBoard.id,
                    role: 'maintainer'
                },
                {
                    parent: govBoard,
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
        members.set(memberInfo.username, orgMembership);

        let createMembership = (requiredRepo: string, role: string) => {
            pulumi.log.debug(`Configure ${memberInfo.username} with role '${role}' to ${requiredRepo}`)
            let repo = allRepositories.get(requiredRepo)
            if (repo) {
                new github.RepositoryCollaborator(`${requiredRepo}_${memberInfo.username}`,
                    {
                        username: memberInfo.username,
                        repository: repo.id,
                        permission: role
                    },
                    {
                        parent: repo,
                        dependsOn: orgMembership, // Can only add to repo after being added to the organization
                        aliases: memberInfo.teamMembershipImport ? [
                            {
                                parent: pulumi.rootStackResource
                            },
                            {
                                name: memberInfo.teamMembershipImport
                            }
                        ] : [
                            {
                                parent: pulumi.rootStackResource
                            }
                        ]
                    }
                )
            } else {
                let message = `Repository ${JSON.stringify(requiredRepo)} doesn't exist. Can't add member ${memberInfo.username}. Did you create the repository or is this a typo?`
                throw new Error(message);
            }
        };

        memberInfo.admin?.forEach((teamOrRepo) => {
            createMembership(teamOrRepo, 'admin')
        })
        memberInfo.maintain?.forEach((teamOrRepo) => {
            createMembership(teamOrRepo, 'maintain')
        })
        memberInfo.push?.forEach((teamOrRepo) => {
            createMembership(teamOrRepo, 'push')
        })
        memberInfo.triage?.forEach((teamOrRepo) => {
            createMembership(teamOrRepo, 'triage')
        })
        memberInfo.pull?.forEach((teamOrRepo) => {
            createMembership(teamOrRepo, 'pull')
        })


    })
    return members
};
