import * as github from "@pulumi/github";

const infra = new github.Repository("infra",
    {
        name: 'infra',
        hasDownloads: false,
        hasIssues: true,
        hasProjects: false,
        hasWiki: false,
        visibility: 'public',
    }
);

const github_meta = new github.Repository("github",
    {
        name: '.github',
        description: 'This repository documents the community model of Pulumiverse. All community related aspects are consolidated here.',
        topics: [
            'pulumi'
        ],
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
        import: '.github'
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
            'pulumi'
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
        import: 'awesome-pulumi'
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
        import: 'kubernetes-sdks'
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
        import: 'pulumi-concourse'
    }
);
