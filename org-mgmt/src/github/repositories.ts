import * as github from "@pulumi/github";
import * as pulumi from "@pulumi/pulumi";

import { Repository } from "../configTypes";

interface RepositoryArgs {
    description: pulumi.Input<string>,
    teams: pulumi.Input<string[]>,
    topics: pulumi.Input<string[]>,
    allTeams: Map<string, github.Team>;
    import: boolean;
    template: pulumi.Input<string> | undefined;
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
                hasDownloads: args.import ? true : undefined,
                hasProjects: false,
                visibility: 'public',
                deleteBranchOnMerge: true,
                vulnerabilityAlerts: true,
                topics: args.topics,
                template: args.template ? {
                    owner:'pulumi',
                    repository: args.template,
                } : undefined
            },
            {
                parent: this,
                import: args.import ? name : undefined,
                aliases: [
                    {
                        parent: pulumi.rootStackResource
                    }
                ],
                transformations: this.repositoryTransformations(),
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

    abstract repositoryTransformations() : pulumi.ResourceTransformation[];

    get repository(): github.Repository {
        return this._repository
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

    constructor(name: string, args: RepositoryArgs, opts?: pulumi.ComponentResourceOptions) {
        super('pulumiverse:github:ProviderRepository', name, args, opts);
    }

    repositoryTransformations() : pulumi.ResourceTransformation[] {
        return [standardRepoTags, providerRepoTags]
    }

}

// An Administrative repository is a repository owned by the Pulumiverse board to administer the Pulumiverse organization
// Each such repositories has the Pulumiverse board as members, code owners and PR reviewers.
class AdministrativeRepository extends BaseRepository {

    constructor(name: string, args: RepositoryArgs, opts?: pulumi.ComponentResourceOptions) {
        super('pulumiverse:github:AdministrativeRepository', name, args, opts);
    }

    repositoryTransformations() : pulumi.ResourceTransformation[] {
        return [standardRepoTags]
    }

}

// An Information repository is a repository only containing data, no providers, pulumi packages or example code.
class InformationRepository extends BaseRepository {

    constructor(name: string, args: RepositoryArgs, opts?: pulumi.ComponentResourceOptions) {
        super('pulumiverse:github:InformationRepository', name, args, opts);
    }

    repositoryTransformations() : pulumi.ResourceTransformation[] {
        return [standardRepoTags]
    }

}

export function configureRepositories(repositoryArgs: Repository[], allTeams: Map<string, github.Team>) : Map<string, github.Repository> {
    let repositories = new Map<string, github.Repository>()
    repositoryArgs.map((repositoryInfo) => {

        switch (repositoryInfo.type) {
            case 'administrative': {
                repositories.set(repositoryInfo.name, new AdministrativeRepository(repositoryInfo.name, {
                    description: repositoryInfo.description,
                    teams: repositoryInfo.teams || [],
                    topics: repositoryInfo.topics || [],
                    allTeams: allTeams,
                    import: repositoryInfo.import || false,
                    template: repositoryInfo.template,
                }).repository);
                break;
            }
            case 'provider': {
                repositories.set(repositoryInfo.name, new ProviderRepository(repositoryInfo.name, {
                    description: repositoryInfo.description,
                    teams: repositoryInfo.teams || [],
                    topics: repositoryInfo.topics || [],
                    allTeams: allTeams,
                    import: repositoryInfo.import || false,
                    template: repositoryInfo.template,
                }).repository);
                break;
            }
            case 'information': {
                repositories.set(repositoryInfo.name, new InformationRepository(repositoryInfo.name, {
                    description: repositoryInfo.description,
                    teams: repositoryInfo.teams || [],
                    topics: repositoryInfo.topics || [],
                    allTeams: allTeams,
                    import: repositoryInfo.import || false,
                    template: repositoryInfo.template,
                }).repository);
                break;
            }
        }
    });
    return repositories;
}

function standardRepoTags(args: pulumi.ResourceTransformationArgs): pulumi.ResourceTransformationResult | undefined {
    if (args.type == 'github:index/repository:Repository') {
        let customTopics = args.props.topics as string[];
        let allTopics = ['pulumi'].concat(customTopics);
        args.props.topics = allTopics;
        return { props: args.props, opts: args.opts };
    }
    return undefined
}

function providerRepoTags(args: pulumi.ResourceTransformationArgs): pulumi.ResourceTransformationResult | undefined {
    if (args.type == 'github:index/repository:Repository') {
        let customTopics = args.props.topics as string[];
        let allTopics = ['pulumi-provider'].concat(customTopics);
        args.props.topics = allTopics;
        return { props: args.props, opts: args.opts };
    }
    return undefined
}

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
