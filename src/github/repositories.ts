import * as github from "@pulumi/github";
import * as pulumi from "@pulumi/pulumi";

import { RepositoryType } from "../configTypes";

interface RepositoryArgs {
    description: pulumi.Input<string>,
    teams: pulumi.Input<string[]>,
    allTeams: Map<string, github.Team>;
    import: boolean;
}
abstract class BaseRepository extends pulumi.ComponentResource {

    private _repository: github.Repository;

    constructor(type: string, name: string, args: RepositoryArgs, opts?: pulumi.ComponentResourceOptions) {
        super(type, name, args, opts);

        this._repository = new github.Repository(name,
            {
                name: name,
                description: args.description,
                hasWiki: false,
                hasIssues: true,
                hasDownloads: false,
                hasProjects: false,
                visibility: 'public',
                deleteBranchOnMerge: true,
                vulnerabilityAlerts: true,
            },
            {
                parent: this,
                import: args.import ? name : undefined,
                aliases: [
                    {
                        parent: pulumi.rootStackResource
                    }
                ],
                transformations: [ standardRepoTags ],
            }
        );
        const mainBranchProtection = new github.BranchProtection(`${name}_protect_main`,
            {
                repositoryId: this._repository.nodeId,
                pattern: 'main',
                enforceAdmins: false,
                allowsDeletions: true,
                requireConversationResolution: true,
                requiredPullRequestReviews: [{
                    dismissStaleReviews: true,
                    requiredApprovingReviewCount: 1,
                    requireCodeOwnerReviews: true,
                }],
            },
            {
                parent: this
            }
        );

        pulumi.output(args.teams).apply((teams) => {
            teams.forEach((requiredTeam) => this.addTeamMembership(name, requiredTeam, args.allTeams));
        }) 

    }

    addTeamMembership(name: string, requiredTeam: string, allTeams: Map<string, github.Team>) {
        if (allTeams.has(requiredTeam)) {
            let team = allTeams.get(requiredTeam)
            if (!team) {
                throw new Error(`Team ${requiredTeam} not found`)
            }
            new github.TeamRepository(`${name}_push_${requiredTeam}`,
                {
                    repository: name,
                    teamId: team.id,
                    permission: 'push'
                },
                {
                    parent: this,
                    dependsOn: team,
                }
            )
        } else {
            let message = `Can't add team ${JSON.stringify(requiredTeam)} to ${name}. Did you create the team or is this a typo?`
            throw new Error(message);
        }
    };

}

class ProviderRepository extends BaseRepository {

    private _repositoryTeam: github.Team;

    constructor(name: string, args: RepositoryArgs, opts?: pulumi.ComponentResourceOptions) {
        super('pulumiverse:github:ProviderRepository', name, args, opts);

        this._repositoryTeam = new github.Team(name,
            {
                name: name,
                description: `Team working on ${name}`
            },
            {
                parent: this
            }
        );
        args.allTeams.set(name, this._repositoryTeam);

        this.addTeamMembership(name, name, args.allTeams);

    }

    get team(): github.Team {
        return this._repositoryTeam
    }
}

export function configureRepositories(repositoryArgs: RepositoryType[], allTeams: Map<string, github.Team>) {
    repositoryArgs.map((repositoryInfo) => {

        if (repositoryInfo.type == 'provider') {
            const pulumiverseRepository = new ProviderRepository(repositoryInfo.name, {
                description: repositoryInfo.description,
                teams: repositoryInfo.teams || [],
                allTeams: allTeams,
                import: repositoryInfo.import || false
            })
        }

    });
}

function standardRepoTags(args: pulumi.ResourceTransformationArgs): pulumi.ResourceTransformationResult | undefined {
    let customTopics = args.props.topics as string[];
    let allTopics = ['pulumi'].concat(customTopics);
    args.props.topics = allTopics;
    return { props: args.props, opts: args.opts };
}

const infra = new github.Repository("infra",
    {
        name: 'infra',
        hasDownloads: false,
        hasIssues: true,
        hasProjects: false,
        hasWiki: false,
        visibility: 'public',
    },
    {
        transformations: [standardRepoTags]
    }
);

const github_meta = new github.Repository("github",
    {
        name: '.github',
        description: 'This repository documents the community model of Pulumiverse. All community related aspects are consolidated here.',
        hasDownloads: true,
        hasIssues: true,
        hasProjects: true,
        hasWiki: false,
        visibility: 'public',
        vulnerabilityAlerts: false,
        allowRebaseMerge: true,
        allowMergeCommit: true,
        deleteBranchOnMerge: false,
    },
    {
        transformations: [standardRepoTags]
    }
);

const awesome_pulumi = new github.Repository("awesome-pulumi",
    {
        name: 'awesome-pulumi',
        description: 'Curated list of resources on Pulumi',
        homepageUrl: 'https://github.com/pulumiverse',
        topics: [
            'devops',
            'awesome',
            'infrastructure-as-code',
            'awesome-list',
        ],
        hasDownloads: true,
        hasIssues: true,
        hasProjects: true,
        hasWiki: false,
        visibility: 'public',
        vulnerabilityAlerts: true,
        allowRebaseMerge: false,
        allowMergeCommit: false,
        deleteBranchOnMerge: true,
    },
    {
        transformations: [standardRepoTags]
    }
);

const kubernetes_sdks = new github.Repository("kubernetes-sdks",
    {
        name: 'kubernetes-sdks',
        hasDownloads: true,
        hasIssues: true,
        hasProjects: false,
        hasWiki: false,
        visibility: 'public',
        vulnerabilityAlerts: false,
        allowAutoMerge: true,
        allowRebaseMerge: true,
        allowSquashMerge: false,
        allowMergeCommit: false,
        deleteBranchOnMerge: true,
    },
    {
        transformations: [standardRepoTags]
    }
);

const terraformMigrationGuide = new github.Repository("terraform-migration-guide",
    {
        name: 'terraform-migration-guide',
        hasDownloads: false,
        hasIssues: true,
        hasProjects: false,
        hasWiki: false,
        visibility: 'public',
        vulnerabilityAlerts: false,
        allowAutoMerge: true,
        allowRebaseMerge: true,
        allowSquashMerge: false,
        allowMergeCommit: false,
        deleteBranchOnMerge: true,
    },
    {
        transformations: [standardRepoTags]
    }
);

const pulumi_astra = new github.Repository("pulumi-astra",
    {
        name: 'pulumi-astra',
        description: 'Pulumi provider for datastax astra db',
        hasDownloads: true,
        hasIssues: true,
        hasProjects: true, // false
        hasWiki: true, // false
        visibility: 'public',
        vulnerabilityAlerts: true,
        allowAutoMerge: false,
        allowRebaseMerge: true,
        allowSquashMerge: true, // false
        allowMergeCommit: true,
        deleteBranchOnMerge: false,
        template: {
            owner: 'pulumi',
            repository: 'pulumi-tf-provider-boilerplate'
        }
    },
    {
        transformations: [standardRepoTags]
    }
);
