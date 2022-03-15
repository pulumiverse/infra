import * as github from "@pulumi/github";
import * as pulumi from "@pulumi/pulumi";

function standardRepoTags(args: pulumi.ResourceTransformationArgs) : pulumi.ResourceTransformationResult | undefined {
    let customTopics = args.props.topics as string[];
    let allTopics = [ 'pulumi' ].concat(customTopics);
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
        transformations: [ standardRepoTags ]
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
        transformations: [ standardRepoTags ]
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
        transformations: [ standardRepoTags ]
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
        transformations: [ standardRepoTags ]
    }
);

const pulumi_concourse = new github.Repository("pulumi-concourse",
    {
        name: 'pulumi-concourse',
        description: 'Pulumi provider for Concourse',
        hasDownloads: true,
        hasIssues: false,
        hasProjects: false,
        hasWiki: false,
        visibility: 'public',
        vulnerabilityAlerts: true,
        allowAutoMerge: false,
        allowRebaseMerge: true,
        allowSquashMerge: false,
        allowMergeCommit: true,
        deleteBranchOnMerge: false,
    },
    {
        transformations: [ standardRepoTags ]
    }
);

export const all = [ infra, github_meta, awesome_pulumi, kubernetes_sdks, pulumi_concourse ]